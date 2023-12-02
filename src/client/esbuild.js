import { Command } from "commander";
import Esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  outfile: "build/static/main.js",
  format: "esm",
  metafile: true,
  treeShaking: true,
  sourcemap: true,
  loader: {
    ".js": "jsx",
    ".ts": "tsx",
    ".woff2": "dataurl",
    ".woff": "dataurl",
    ".module.css": "local-css",
  },
  jsx: "automatic",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  plugins: [
    copy({
      assets: {
        from: "public/**/*",
        to: "../",
      },
    }),
  ],
};

function build() {
  buildOptions.dropLabels = ["DEV"];
  Esbuild.build(buildOptions);
}

async function serve() {
  buildOptions.jsxDev = true;
  buildOptions.minify = false;
  buildOptions.dropLabels = [];
  buildOptions.plugins.push({
    name: "on-rebuild",
    setup(build) {
      build.onStart(function () {
        console.log("rebuilding...");
      });
      build.onEnd(function (result) {
        console.log("rebuilt", result);
      });
    },
  });

  const ctx = await Esbuild.context(buildOptions);

  await ctx.watch();

  const { host, port } = await ctx.serve({
    servedir: "./build",
    port: parseInt(process.env.PORT || 8000, 10),
  });

  console.log(`Serving on http://${host}:${port}`);
}

async function main() {
  const program = new Command();
  program.option("-s, --serve", "start the dev server");
  program.parse(process.argv);
  const options = program.opts();
  console.log("LS -> esbuild.js:50 -> options: ", options);

  if (options.serve) {
    await serve();
  } else {
    await build();
  }
}

main();
