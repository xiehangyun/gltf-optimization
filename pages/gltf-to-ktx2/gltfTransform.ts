import { type GLTF, WebIO, Node } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS, KHRTextureBasisu } from '@gltf-transform/extensions';
import { metalRough, prune, sparse, dedup, flatten, palette, resample, weld, join, compressTexture, draco } from '@gltf-transform/functions';
import { createDecoderModule, createEncoderModule } from 'draco3dgltf';
import { toKTX2UASTC } from './toKTX2UASTC';
export { toKTX2UASTC } from './toKTX2UASTC';
// 需放置静态资源 draco_decoder_gltf 与 draco_encoder

export interface IGLTFOptimizationOptions {
  maxSize?: number; // 最大纹理尺寸,0为不做处理
  hasJoin?: boolean; // 是否合并相同材质网格
  hasPalette?: boolean; // 是否对纯色材质创建统一调色板纹理
  hasFlatten?: boolean; // 是否展平节点结构
  hasKtx2?: boolean; // 是否ktx2压缩纹理
}

const defaultOptions: IGLTFOptimizationOptions = {
  maxSize: 2048, // 默认最大纹理尺寸,0为不做处理
  hasJoin: true, // 默认合并相同材质网格
  hasPalette: true, // 默认对纯色材质创建统一调色板纹理
  hasFlatten: true, // 默认展平节点结构
  hasKtx2: true, // 默认不ktx2压缩纹理
};

/**
 * GLB模型优化压缩方法
 * @param { ArrayBuffer } gltf gltf 模型文件ArrayBuffer
 * @param { IGLTFOptimizationOptions } options  压缩选项参数
 * @returns { Promise<ArrayBuffer> } 返回压缩后的glTF模型文件ArrayBuffer
 */
export async function gltfOptimization(gltf: ArrayBuffer, options: IGLTFOptimizationOptions = defaultOptions): Promise<Uint8Array<ArrayBufferLike>> {
  const io = new WebIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({
    'draco3d.decoder': await createDecoderModule(),
    'draco3d.encoder': await createEncoderModule(),
  }); // web
  // @ts-ignore
  let { maxSize = 2048, hasJoin, hasPalette, hasFlatten, hasKtx2 } = options;
  const uint8Array = new Uint8Array(gltf);
  const glbDocument = await io.readBinary(uint8Array);

  let flag = glbDocument
    .getRoot()
    .listMaterials()
    .some((material) => {
      return !!material.getExtension('KHR_materials_pbrSpecularGlossiness');
    });
  if (flag) {
    await glbDocument.transform(
      metalRough() // 将材质转换为金属粗糙度工作流[9,11](@ref)
    );

    glbDocument
      .getRoot()
      .listMaterials()
      .forEach((material) => {
        const iorExt = material.getExtension<any>('KHR_materials_ior');
        iorExt?.setIOR(1.5); // 设置折射率为1.5
      });

    // 删除不需要的扩展，降低文件体积 start https://www.donmccurdy.com/2022/11/28/converting-gltf-pbr-materials-from-specgloss-to-metalrough/
    const DENYLIST = ['KHR_materials_ior', 'KHR_materials_specular'];

    for (const extension of glbDocument.getRoot().listExtensionsUsed()) {
      if (DENYLIST.includes(extension.extensionName)) {
        extension.dispose();
      }
    }

    glbDocument.transform(prune()); // 删除未使用的材质和纹理
  }

  let transformList = [];

  transformList.push(dedup()); // 去重资源
  if (hasPalette) {
    transformList.push(palette({ min: 5 })); // 对纯色材质创建统一调色板纹理
  }
  if (hasJoin) {
    transformList.push(join()); // 合并相同材质网格
  }
  if (hasFlatten) {
    transformList.push(flatten()); // 展平节点结构
  }

  transformList.push(weld()); // 合并顶点
  transformList.push(resample()); // 无损压缩动画关键帧
  transformList.push(prune()); // 移除未使用资源
  transformList.push(sparse({ ratio: 0.2 })); // 压缩数据存储访问器
  transformList.push(
    draco({
      method: 'edgebreaker',
      quantizePosition: 24,
      quantizeNormal: 10,
      quantizeColor: 8,
      quantizeTexcoord: 12,
      quantizeGeneric: 8,
      quantizationVolume: 'mesh',
    })
  ); // 使用drcao压缩几何体

  await glbDocument.transform(...transformList); // 删除重复的几何体

  // 纹理分辨率处理，舍弃textureCompress，自行处理，对超过限制的纹理进行分辨率压缩 start TODO!!后续将在此处集成ktx2压缩

  let ktx2Flag = false;
  let textures = glbDocument.getRoot().listTextures();
  console.time('transformTexture');
  for (var i = 0; i < textures.length; i++) {
    let texture = textures[i];
    let size = texture.getSize();
    console.time('one texture transformTexture');
    if (size && maxSize) {
      if (size[0] > maxSize || size[1] > maxSize) {
        await compressTexture(texture, {
          resize: [maxSize, maxSize],
        });
      }
    }

    let type = texture.getMimeType();
    if (hasKtx2 && type !== 'image/ktx2') {
      let image = texture.getImage() as Uint8Array;
      let newSize = texture.getSize();
      if (newSize) {
        if (newSize[0] * newSize[1] < 6_000_000) {
          //   let ktx2Data = await toKTX2UASTC(image, type, !!getTextureColorSpace(texture));
          let ktx2Data = await toKTX2UASTC(image, type, true);
          if (ktx2Data) {
            ktx2Flag = true;
            texture.setImage(ktx2Data).setMimeType('image/ktx2').setURI(`${texture.getName()}.ktx2`);
          }
        } else {
          console.warn('texture size limited 6 megapixels');
        }
      }
    }
    console.timeEnd('one texture transformTexture');
    console.info('----textures compress progress:', `${i + 1}/${textures.length}`);
  }
  console.timeEnd('transformTexture');
  if (ktx2Flag) {
    glbDocument.createExtension(KHRTextureBasisu).setRequired(true);
  }

  // 纹理分辨率处理，舍弃textureCompress，自行处理，对超过限制的纹理进行分辨率压缩 end

  const glbArrayBuffer = await io.writeBinary(glbDocument);

  return glbArrayBuffer; // 返回ArrayBuffer
}
