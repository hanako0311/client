import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Bind to all interfaces so Heroku can access it
    port: process.env.PORT || 3000, // Use the Heroku-provided port or default to 3000 locally
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
