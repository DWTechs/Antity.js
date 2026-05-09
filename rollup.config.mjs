
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

export default config;
