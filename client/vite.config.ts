import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
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
        "/weather": {
          target: env.VITE_SERVER_API,
          changeOrigin: true,
          ws: false, // 웹소켓 사용 안 하면 false로
          secure: false, // https 아니면 false
        },
        "/air": {
          target: env.VITE_SERVER_API,
          changeOrigin: true,
          ws: false, // 웹소켓 사용 안 하면 false로
          secure: false, // https 아니면 false
        },
      },
    },
  };
});
