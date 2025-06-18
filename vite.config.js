import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // Tells Vite to treat src/ as the root
  build: {
    outDir: "../dist", // So dist/ ends up at the project root level
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        generate: resolve(__dirname, "src/generate/index.html"),
        history: resolve(__dirname, "src/history/index.html"),
      },
    },
  },
});