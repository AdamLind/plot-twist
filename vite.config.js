import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        generate: resolve(__dirname, "src/generate/index.html"),
      },
    },
  },
});