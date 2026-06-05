import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__server.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}",
    },
  },
});
