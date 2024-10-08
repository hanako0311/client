import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target:
          "https://findnest-firebase-springboot-be574de6e212.herokuapp.com/",
        secure: false,
        changeOrigin: true, // Ensure the origin header is correctly set
      },
    },
  },
  plugins: [react()],
});
