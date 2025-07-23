import { initBasis } from './basisLoader';

export async function toKTX2UASTC(data: Uint8Array, MimeType: string, isSRGB: boolean) {
  let basisModule: any = await initBasis();
  // @ts-ignore
  let { BasisEncoder } = basisModule;
  let encoder = new BasisEncoder();

  const uastcFormat = basisModule.basis_tex_format.cUASTC4x4.value;
  encoder.setFormatMode(uastcFormat);
  encoder.setUASTC(true);
  // 基础配置
  encoder.setCreateKTX2File(true); // 生成KTX2容器
  encoder.setKTX2UASTCSupercompression(true); // 启用超级压缩

  let inputType = basisModule.ldr_image_type.cPNGImage.value;
  if (MimeType === 'image/jpeg' || MimeType === 'image/jpg' || MimeType === 'jfif') {
    inputType = basisModule.ldr_image_type.cJPGImage.value;
  }

  encoder.setSliceSourceImage(
    0, // 切片索引
    data, // 图像数据
    0, // 原始宽度（0表示自动检测）
    0, // 原始高度
    inputType // 输入类型
  );
  // UASTC专用参数
  encoder.setPackUASTCFlags(0); // 质量级别1（0=最快，4=最高质量）
  encoder.setKTX2SRGBTransferFunc(isSRGB);
  encoder.setPerceptual(isSRGB);
  encoder.setMipGen(true);
  encoder.setMipSRGB(isSRGB);

  const outputBuffer = new Uint8Array(4096 * 4096 * 32);

  try {
    // 执行编码
    const byteSize = encoder.encode(outputBuffer);

    if (byteSize === 0) {
      return null;
    }

    // 提取有效数据
    return outputBuffer.slice(0, byteSize);
  } catch (error) {
    return null;
  } finally {
    // 释放资源
    encoder.delete();
  }
}
