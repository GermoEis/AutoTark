import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Listen on both IPv4 and IPv6 so the extension's 127.0.0.1 URL works
    // even when the browser resolves localhost to ::1.
    host: true,
    port: 5173,
    strictPort: true,
  },
});
