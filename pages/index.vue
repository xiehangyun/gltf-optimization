<template>
  <div ref="container">
    <div>注意！KTX2压缩仅支持2K及以下纹理</div>
    <div>
      <label>最大纹理尺寸：</label>

      <select name="" id="" v-model="options.maxSize">
        <option :value="512">512</option>
        <option :value="1024">1024</option>
        <option :value="2048">2048</option>
      </select>
    </div>
    <div>
      <label>合并相同材质网格：</label>
      <input type="checkbox" v-model="options.hasJoin" />
    </div>
    <div>
      <label>纯色材质创建统一调色板纹理并合并：</label>
      <input type="checkbox" v-model="options.hasPalette" />
    </div>
    <div>
      <label>展平多余节点：</label>
      <input type="checkbox" v-model="options.hasFlatten" />
    </div>
    <div>
      <label>启用KTX2纹理压缩：</label>
      <input type="checkbox" v-model="options.hasKtx2" />
    </div>
    <div>
      <label>选择一个GLB文件：</label>
      <input type="file" @change="glbChange" id="glbInput" accept=".glb" />
    </div>
  </div>
</template>
<!-- <RouterView -->

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { gltfOptimization } from './gltf-to-ktx2/gltfTransform';
const container = ref<HTMLElement | null>(null);
const options = ref({
  maxSize: 2048, // 默认最大纹理尺寸,0为不做处理
  hasJoin: true, // 默认合并相同材质网格
  hasPalette: true, // 默认对纯色材质创建统一调色板纹理
  hasFlatten: true, // 默认展平节点结构
  hasKtx2: true, // 默认不ktx2压缩纹理
});

onMounted(async () => {
  console.log(options);
});
async function glbChange(event: Event) {
  const input = event.target as HTMLInputElement;
  input.disabled = true; // 禁用输入框，防止重复选择
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const optimizedArrayBuffer = await gltfOptimization(arrayBuffer, options.value);
    input.disabled = false; // 处理完成后重新启用输入框
    const blob = new Blob([optimizedArrayBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.glb', '-optimized.glb');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 释放内存
  } else {
    alert('请上传一个有效的GLB文件。');
  }
}
</script>

<style>
html,
body {
  padding: 0px;
  margin: 0px;
  padding: 20px;
}
label {
  display: inline-block;
  width: 300px;
  text-align: right;
}
</style>
