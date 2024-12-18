import resolve from "@rollup/plugin-node-resolve";

const config =  {
  input: "build/es6/antity.js",
  output: {
    name: "antity",
    file: "build/antity.cjs.js",
    format: "cjs"
  },
  external: [
  ],
  plugins: [
    resolve(),
  ]
};

export default config;