import { SolidPlugin } from "@dschz/bun-plugin-solid";
import tailwind from "bun-plugin-tailwind";
import { build } from "bun";

export function bundle(prod: boolean) {
  build({
    entrypoints: ["./src/app.tsx",'./src/tailwind.css'],
    outdir: "./dist",
    target:'browser',
    minify: prod,
    sourcemap: prod?'none':'external',
    define: {
      "process.env.NODE_ENV": prod ? '"production"' : '"development"',
    },
    format: "iife",
    plugins: [
      SolidPlugin({
        generate: "dom",
        hydratable: false,
        sourceMaps: !prod,
      }),
      tailwind,
    ],
  }).catch((e) => console.log(`Error ${e}`)
  );
}
