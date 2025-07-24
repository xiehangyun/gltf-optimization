
# Integrate @gltf-transform with basis_encoder.js

Optimize GLTF models and compress textures with KTX2 directly in the browser environment.

## Setup & Commands

**Initialize Dependencies**
`npm install`

**Run Development Server**
`npm run dev`

**Build GLTF Optimization Module**`npm run buildGltfOptimization`

> **Deployment Note**: When deploying to production web environments, manually copy public dependencies to your application's public folder.

## Implementation Example

```typescript
import { gltfOptimization } from './gltfTransform.js';

// Get GLB file from input
const file: File = input.files[0];
const arrayBuffer = await file.arrayBuffer();

// Optimization configuration options
const options = {
  maxSize: parseInt(maxSizeEl.value),      // Max texture size (0 disables processing)
  hasJoin: hasJoinEl.checked,             // Merge meshes sharing identical materials
  hasPalette: hasPaletteEl.checked,       // Create unified palette texture for solid-color materials
  hasFlatten: hasFlattenEl.checked,       // Flatten redundant node hierarchy
  hasKtx2: hasKtx2El.checked              // Enable KTX2 texture compression (BasisU format)
};

// Process GLB with optimization pipeline
const optimizedArrayBuffer = await gltfOptimization(arrayBuffer, options);
```

## Key Features

- **Web-based Processing**: All operations execute client-side via Web Workers
- **Basis Universal**: Utilizes basis_encoder.js for GPU-optimized texture compression
- **Model Optimization**: Full glTF optimization pipeline (mesh joining, node flattening)
- **Size Control**: Configurable texture downsampling to meet platform constraints，KTX texture compression only supports textures of 2K and below.

> **Performance Note**: KTX2 compression is computationally intensive. For larger models (>50MB), consider implementing progress indicators.
>
