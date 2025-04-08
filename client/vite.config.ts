import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: "client/dist",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.xlsx"], // .xlsx 파일을 Vite 에셋으로 포함
    server: {
      proxy: {
        "/api": {
          target: env.VITE_SERVER_API,
          changeOrigin: true,
          ws: false,
          secure: false,
        },
      },
    },
  };
});
