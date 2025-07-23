import path from 'path';
import fs from 'fs';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/gltf-optimization/' : '/', // 替换为你的仓库名
    buildAssetsDir: '/docs/_nuxt/', // 静态资源目录
    head: {
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
        },
      ],
    },
  },
  rootDir: 'docs',
  plugins: [],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
});
