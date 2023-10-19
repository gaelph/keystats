const Fs = require("fs");
const Esbuild = require("esbuild");

const migrations = Fs.readdirSync("./migrations");

const migrationsEntries = migrations.map((migration) => {
  let migrationOut = migration.replace(".js", "");
  return {
    in: `./migrations/${migration}`,
    out: `./migrations/${migrationOut}`,
  };
});

let banner = "const path = require('path');\n";
for (let migration of migrations) {
  // migration = migration.replace(".js", ".cjs");
  banner += "require('./migrations/" + migration + "');\n";
}

Esbuild.build({
  entryPoints: [
    { in: "./src/index.ts", out: "./keystats" },
    { in: "./src/server/index.ts", out: "./keystats-server" },
  ],
  entryNames: "[dir]/[name]",
  banner: { js: banner },
  loader: {
    ".ts": "ts",
    ".node": "file",
  },
  outExtension: { ".js": ".cjs" },
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

Esbuild.build({
  entryPoints: migrationsEntries,
  entryNames: "[dir]/[name]",
  loader: {
    ".ts": "ts",
    ".node": "file",
  },
  outExtension: { ".js": ".js" },
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
