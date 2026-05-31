import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (existsSync("dist/index.html")) {
  const indexHtml = readFileSync("dist/index.html", "utf8");

  // GitHub Pages serves this fallback for refreshed SPA routes such as
  // /admin/reservations. Root-relative assets keep those deep links working on
  // the custom domain instead of resolving to /admin/assets.
  const fallbackHtml = indexHtml.replaceAll("./assets/", "/assets/");

  writeFileSync("dist/404.html", fallbackHtml);
}
