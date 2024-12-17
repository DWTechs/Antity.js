import resolve from "@rollup/plugin-node-resolve";

const config =  {
  input: "build/es6/passken.js",
  output: {
    name: "passken",
    file: "build/passken.cjs.js",
    format: "cjs"
  },
  external: [
  ],
  plugins: [
    resolve(),
  ]
};

export default config;