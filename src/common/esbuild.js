const Esbuild = require("esbuild");

/**
 * Main program build
 */
Esbuild.build({
  entryPoints: ["./src/index.ts", "./src/dto/keyboard.ts", "./src/dto/projection.ts"],
  outdir: "dist",
  format: "esm",
  loader: {
    ".ts": "ts",
  },
  outExtension: { ".js": ".js" },
  bundle: false,
  platform: "neutral",
  sourcemap: process.env.ENV === "dev" ? true : "inline",
  target: "node18",
  allowOverwrite: true,
});

// Keep the pure engine self-contained, including its static, validated profiles.
Esbuild.build({
  entryPoints: ["./src/projection/index.ts"],
  outfile: "dist/projection/index.js",
  bundle: true,
  platform: "neutral",
  format: "esm",
  target: "node18",
});
