import Esbuild from "esbuild";
Esbuild.build({
  entryPoints: [
    { in: "./src/index.ts", out: "./keystats.cjs" },
    { in: "./src/server/index.ts", out: "./keystats-server.cjs" },
  ],
  loader: {
    ".ts": "ts",
    ".node": "file",
  },
  bundle: true,
  platform: "node",
  outdir: "build",
  sourcemap: true,
  target: "node18",
  inject: ["./src/server/import_meta.js"],
  allowOverwrite: true,
  define: {
    "import.meta.url": "import_meta_url",
  },
  external: [
    "better-sqlite3",
    "mysql",
    "mysql2",
    "oracledb",
    "pg",
    "pg-query-stream",
    "tedious",
    "@mapbox/node-pre-gyp",
    "sqlite3",
    "usb-detection",
    "node-hid",
  ],
});
