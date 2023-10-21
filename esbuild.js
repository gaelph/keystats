const Fs = require("fs");
const Esbuild = require("esbuild");

/** We need to get the migrations in the build directory
 * so that they are included in the pkg binary
 */
const migrations = Fs.readdirSync("./migrations");

const migrationsEntries = migrations.map((migration) => {
  let migrationOut = migration.replace(".js", "");
  return {
    in: `./migrations/${migration}`,
    out: `./migrations/${migrationOut}`,
  };
});

// This banner will ensure the migrations are detected and included
// in the binary
let banner = "const path = require('path');\n";
for (let migration of migrations) {
  banner += "require('./migrations/" + migration + "');\n";
}

/**
 * Since we are in a node environment, we don’t need to
 * bundle the denpendencies (some of which have .node files
 * which can’t be bundled anyway)
 */
const packgeJson = JSON.parse(Fs.readFileSync("./package.json", "utf8"));

const dependencies = [
  Object.keys(packgeJson.dependencies || {}),
  Object.keys(packgeJson.devDependencies),
].flat(4);

/**
 * Main program build
 */
Esbuild.build({
  entryPoints: [{ in: "./src/index.ts", out: "./keystats" }],
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
  sourcemap: "inline",
  target: "node18",
  inject: ["./src/server/import_meta.js"],
  allowOverwrite: true,
  define: {
    "import.meta.url": "import_meta_url",
  },
  external: [
    "@mapbox/node-pre-gyp",
    "pg-query-stream",
    "better-sqlite3",
    "oracledb",
    "tedious",
    "mysql",
    "mysql2",
    "pg",
    "sqlite3",
    "usb-detection",
    "node-usb-detection",
    "node-hid",
  ],
});

/**
 * Migrations build (so that they are included in the binary)
 */
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
    "@mapbox/node-pre-gyp",
    "pg-query-stream",
    "better-sqlite3",
    "oracledb",
    "tedious",
    "mysql",
    "mysql2",
    "pg",
    "sqlite3",
    "usb-detection",
    "node-usb-detection",
    "node-hid",
  ],
});
