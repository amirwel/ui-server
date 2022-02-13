/**
 * A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules.
 */
const { nodeResolve } = require('@rollup/plugin-node-resolve');

/**
 * A Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle.
 */
const commonjs = require('@rollup/plugin-commonjs');

/**
 * A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules.
 */
const external = require('rollup-plugin-peer-deps-external');

/**
 * Rollup plugin to minify generated es bundle. Uses terser under the hood.
 */
const { terser } = require('rollup-plugin-terser');

module.exports = [
    nodeResolve({
        browser: true,
    }),
    commonjs(),
    external(),
    terser()
];