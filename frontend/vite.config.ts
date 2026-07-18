import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Serve the committed fixtures in ./mocks at /mocks/* during dev, so the app
// runs fully against static JSON (USE_MOCKS) without copying files into public/.
function serveMocks(): Plugin {
  const mocksDir = path.resolve(__dirname, "mocks");
  return {
    name: "serve-mocks",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (!url.startsWith("/mocks/")) return next();
        const file = path.join(mocksDir, url.slice("/mocks/".length));
        if (file.startsWith(mocksDir) && fs.existsSync(file)) {
          res.setHeader("content-type", "application/json");
          fs.createReadStream(file).pipe(res);
          return;
        }
        res.statusCode = 404;
        res.end("mock not found");
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveMocks()],
  server: { port: 5173 },
});
