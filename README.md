集成@gltf-transform与basis_encoder.js。

在web端进行GLTF模型优化与KTX2压缩。

[![](public/image.png)](https://badge.fury.io/js/babylonjs)

初始化命令

`npm install`

调试命令

`npm run dev`

编译模块命令

`npm run buildGltfOptimization`

注意，部署到Web时，需将public依赖手动拷贝到程序public文件夹。

```typescript
import { gltfOptimization } from'./gltfTransform.js';
let file: File = input.files[0];
const arrayBuffer = await file.arrayBuffer();

const options = {
	maxSize: parseInt(maxSizeEl.value), // 最大纹理尺寸,0为不做处理;Max texture size (0 disables resizing)
	hasJoin: hasJoinEl.checked,	    // 合并相同材质网格;Merge meshes sharing identical materials
	hasPalette: hasPaletteEl.checked,   // 对纯色材质创建统一调色板纹理;Create unified palette texture for solid-color materials  
	hasFlatten: hasFlattenEl.checked,   //展平节点结构;Flatten redundant node hierarchy
	hasKtx2: hasKtx2El.checked	    // 开启ktx2压缩纹理;Enable KTX2 texture compression
      };


const optimizedArrayBuffer = await gltfOptimization(arrayBuffer, options);

```


## 关键特性

- **基于网页的处理**：所有操作均通过网页工作者在客户端执行
- **基础通用**：使用basis_encoder.js进行GPU优化纹理压缩
- **模型优化**：完整的glTF优化管道（网格合并、节点扁平化）
- **尺寸控制**：可配置的纹理下采样以满足平台限制，KTX 纹理压缩仅支持 2K 及以下分辨率的纹理。

> **性能提示**：KTX2 压缩计算密集型。对于较大模型（>50MB），建议实现进度指示器。
>
