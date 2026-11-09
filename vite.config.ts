import { defineConfig } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { readFontCorpus, selectFontCSS } from "./scripts/font-subset.mjs";
import { compressGlb } from "./scripts/compress-model.mjs";

// Keep Blender's stable source/export paths, while production URLs identify
// exact bytes and can be cached without revalidation across deployments.
const models = await Promise.all(
  ["archive-cassette", "archive-assembly"].map(async (name) => {
    const source = await compressGlb(readFileSync(`public/assets/${name}.glb`));
    const hash = createHash("sha256").update(source).digest("hex").slice(0, 16);
    return {
      key: `assets/${name}.glb`,
      fileName: `assets/${name}.${hash}.glb`,
      source,
    };
  }),
);
const hasNovecento = ["Normal", "DemiBold", "Bold"].every((weight) =>
  existsSync(
    `public/fonts/novecento/webFonts/NovecentoSansWide${weight}/font.woff2`,
  ),
);
export default defineConfig(({ mode }) => ({
  base: mode === "wallpaper" ? "./" : "/",
  define: {
    __RHINE_MODELS__: JSON.stringify(
      Object.fromEntries(models.map((model) => [model.key, model.fileName])),
    ),
    __RHINE_NOVECENTO__: JSON.stringify(hasNovecento),
  },
  plugins: [
    {
      name: "authored-font-coverage",
      apply: "build",
      enforce: "pre",
      async transform(source, id) {
        if (id !== fileURLToPath(new URL("./src/style.css", import.meta.url)))
          return;
        const fonts = fileURLToPath(
          new URL("./src/fonts.css", import.meta.url),
        );
        this.addWatchFile(fonts);
        if (!source.includes('@import "./fonts.css";'))
          throw new Error("Missing MiSans stylesheet import");
        return source.replace(
          '@import "./fonts.css";',
          selectFontCSS(readFileSync(fonts, "utf8"), await readFontCorpus()),
        );
      },
    },
    {
      name: "versioned-model-assets",
      apply: "build",
      buildStart() {
        for (const model of models)
          this.emitFile({
            type: "asset",
            fileName: model.fileName,
            source: model.source,
          });
      },
    },
    ...(mode === "wallpaper"
      ? [
          {
            name: "wallpaper-host",
            transformIndexHtml(html: string) {
              return {
                html: html.replace(/\s*<link rel="manifest"[^>]*>/, ""),
                tags: [
                  {
                    tag: "script",
                    children: readFileSync("wallpaper/host.js", "utf8"),
                    injectTo: "head-prepend" as const,
                  },
                ],
              };
            },
          },
        ]
      : []),
  ],
}));
