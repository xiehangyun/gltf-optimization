
# 将 @gltf-transform 与 basis_encoder.js 集成

在浏览器环境中直接优化 GLTF 模型并压缩 KTX2 纹理。

## 设置与命令

**初始化依赖项**
`npm install`

**运行开发服务器**
`npm run dev`

**构建 GLTF 优化模块** `npm run buildGltfOptimization`

> **部署说明**：在部署到生产环境时，请手动将公共依赖项复制到应用程序的公共文件夹中。

## 实现示例

```typescript
import { gltfOptimization } from ‘./gltfTransform.js’;

// 从输入获取 GLB 文件
const file: File = input.files[0];
const arrayBuffer = await file.arrayBuffer();

// 优化配置选项
const options = {
  maxSize: parseInt(maxSizeEl.value),      // 最大纹理大小（0 表示禁用处理）
  hasJoin: hasJoinEl.checked,             // 合并共享相同材质的网格
  hasPalette: hasPaletteEl.checked,       // 为纯色材质创建统一的调色板纹理
  hasFlatten: hasFlattenEl.checked,       // 扁平化冗余节点层次结构
  hasKtx2: hasKtx2El.checked              // 启用KTX2纹理压缩（BasisU格式）
};

// 使用优化管道处理 GLB
const optimizedArrayBuffer = await gltfOptimization(arrayBuffer, options);
```

通过DeepL.com（免费版）翻译

## 关键特性

- **基于网页的处理**：所有操作均通过网页工作者在客户端执行
- **基础通用**：使用basis_encoder.js进行GPU优化纹理压缩
- **模型优化**：完整的glTF优化管道（网格合并、节点扁平化）
- **尺寸控制**：可配置的纹理下采样以满足平台限制，KTX 纹理压缩仅支持 2K 及以下分辨率的纹理。

> **性能提示**：KTX2 压缩计算密集型。对于较大模型（>50MB），建议实现进度指示器。
