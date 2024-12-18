
const config =  {
  input: "build/es6/antity.js",
  output: {
    name: "antity",
    file: "build/antity.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard",
  ],
  plugins: []
};

export default config;
