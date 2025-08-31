import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/dcode-web/",
  server: {
    allowedHosts: ["77adf2d21068.ngrok-free.app"],
  },
});
