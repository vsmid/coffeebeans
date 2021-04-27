import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

module.exports = {
  input: "esm/coffeebeans.js",
  output: [
    {
      file: "coffeebeans.js",
      format: "iife",
      name: "coffeebeans",
    },
    {
      file: "coffeebeans.min.js",
      format: "iife",
      name: "coffeebeans",
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectories: ["node_modules"],
      },
    }),
    babel({ presets: ["@babel/preset-env"] }),
  ],
};
