
const config =  {
  input: "build/es6/passken.js",
  output: {
    name: "passken",
    file: "build/passken.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard",
  ],
  plugins: []
};

export default config;
