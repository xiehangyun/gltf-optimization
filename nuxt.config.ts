import path from "path";
import fs from "fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        },
      ],
      script: [
        // {
        //   src: "/model-viewer.js",
        //   type: "module",
        //   defer: true, // 可选，根据需要设置
        // },
        // {
        //   src: "https://unpkg.com/webxr-polyfill@latest/build/webxr-polyfill.module.js",
        //   type: "module",
        //   defer: true, // 可选，根据需要设置
        // },
      ],
    },
  },
  rootDir: "./",
  plugins: [],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    // host: "0.0.0.0",
    port: 3000,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "./cert.key"), "utf-8"),
    //   cert: fs.readFileSync(path.resolve(__dirname, "./cert.crt"), "utf-8"),
    // },
  },
});
