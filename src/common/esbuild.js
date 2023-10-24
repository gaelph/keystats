const Esbuild = require("esbuild");

/**
 * Main program build
 */
Esbuild.build({
  entryPoints: ["./src/index.ts", "./src/dto/keyboard.ts"],
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
