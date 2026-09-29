import dts from "rollup-plugin-dts";

const config = {
  input: "build/es6/antity.js",
  // onwarn(warning, warn) {
  //   if (warning.code === "THIS_IS_UNDEFINED") return;
  //   warn(warning);
  // },
  output: {
    name: "antity",
    file: "build/antity.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard", "@dwtechs/winstan"
  ],
  plugins: []
};

// Bundles the per-file .d.ts output tsc already generates in build/es6/ (one
// per source module) into a single declaration file matching the single
// bundled antity.mjs above — tree-shaken down to only what antity.ts's entry
// point re-exports, so internals (normalize/validate/control/... ) stay hidden
// the same way they're hidden from the JS bundle.
const dtsConfig = {
  input: "build/es6/antity.d.ts",
  output: {
    file: "build/antity.d.ts",
    format: "es"
  },
  external: [
    "express"
  ],
  plugins: [dts()]
};

export default [config, dtsConfig];
