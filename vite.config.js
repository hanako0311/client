import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
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
    build: {
      minify: mode === "production" ? "esbuild" : false, // Minify in production, no minify in dev
      sourcemap: mode === "production" ? false : true, // Disable source maps in production for performance
      outDir: "dist", // Output directory for the build
      rollupOptions: {
        // Customizing the bundle to exclude unnecessary development code in production
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor"; // Creates a separate vendor chunk for better caching
            }
          },
        },
      },
    },
    plugins: [react()],
  };
});
