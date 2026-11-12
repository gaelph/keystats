const path = require("node:path");
const { createRequire } = require("node:module");
const { build } = require("esbuild");

module.exports = async function loadTs(entry, plugins = []) {
  const filename = path.resolve(entry);
  const { outputFiles } = await build({
    entryPoints: [filename], bundle: true, platform: "node", format: "cjs",
    packages: "external", write: false, plugins,
  });
  const compiled = { exports: {} };
  new Function("require", "module", "exports", outputFiles[0].text)(
    createRequire(filename), compiled, compiled.exports,
  );
  return compiled.exports;
};
