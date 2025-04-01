import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.xlsx"], // .xlsx 파일을 Vite 에셋으로 포함
  server: {
    proxy: {
      "/scraping": {
        target: "https://www.musinsa.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scraping/, ""),
      },
      "/test": {
        target: "https://www.google.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/test/, ""),
      },
    },
  },
});
