/*
 * @Author: chenzhen
 * @Date: 2020-10-21 19:13:52
 * @Last Modified by: chenzhen
 * @Last Modified time: 2021-01-05 10:33:34
 */
import babel /* , { getBabelOutputPlugin } */ from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";

// const banner = `/*
// * @Author: chenzhen 
// * @Date: 2020-10-21 19:13:52 
// * @Last Modified by:   chenzhen 
// * @Last Modified time: 2020-10-21 19:13:52 
// */`;
export default {
  input: {
    comment:'script/index.js'
  },
  output: [
    {
      dir: "build",
      entryFileNames: "[name].js",
      format: "umd",
      name: "AQES",
      exports: "auto",
      sourcemap: true,
      inlineDynamicImports: true,
      // banner,
    },
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
      // pass custom options to the resolve plugin
      moduleDirectory: ["node_modules"]
    }),
    babel({
      exclude: ["node_modules/**"],
      babelHelpers: "bundled",
    }),
  ]
};
