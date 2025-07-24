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
use

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
