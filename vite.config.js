import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {
  ElementPlusResolver,
  VantResolver,
  NaiveUiResolver,
} from "unplugin-vue-components/resolvers";
import px2rem from "postcss-plugin-px2rem";
import viteCompression from "vite-plugin-compression";
import mkcert from "vite-plugin-mkcert";

const px2remOptions = {
  rootValue: 20,
  unitPrecision: 5,
  selectorBlackList: [".wallet-card-desc .label", ".phase2"],

  mediaQuery: false,
  minPixelValue: 0,
};

export default defineConfig({
  server: {
    // https: true,
    host: "0.0.0.0",
    port: 3000,
    open: true,
    cors: true,
    secure: false,
    proxy: {
      "/api": {
        target: "https://owlto.finance",
        changeOrigin: true,
        secure: false,
      },
      "/multi-balance": {
        target: "https://owlto.finance",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
      dts: "src/auto-import.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver(), NaiveUiResolver()],
    }),
    viteCompression({
      verbose: true,
      disable: false,
      deleteOriginFile: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
    // mkcert(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/mixin.scss";',
      },
    },
    postcss: {
      plugins: [px2rem(px2remOptions)],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
