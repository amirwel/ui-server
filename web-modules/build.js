const { join, dirname } = require('path');

const noop = require('lodash/noop');
const mkdirp = require('mkdirp')
const { rollup } = require('rollup');

const rollupPlugins = require('./rollup-plugins');

module.exports = function buildWebModules(resolveRoot, dependencies, outDir) {
    const dependenciesNames = Object.keys(dependencies);

    return Promise.all(dependenciesNames.map((dependency) => {
        const entries = dependencies[dependency].map((v) => require.resolve(join(dependency, v), { paths: [resolveRoot] }));

        return Promise.all(entries.map(async (path) => {
            try {
                const pathedDependencyName = join(...dependency.split('/'));
                const webModuleFile = join(outDir, path.substring(path.indexOf(pathedDependencyName)));
                const webModuleDir = dirname(webModuleFile);

                console.log('Preparing directory:   ', webModuleDir);
                await mkdirp(webModuleDir);

                console.log('Bundling:              ', webModuleFile);
                const bundle = await rollup({ input: path, plugins: rollupPlugins, onwarn: noop });

                console.log('Writing:               ', webModuleFile);
                await bundle.write({ file: webModuleFile, format: 'es' });
            } catch (e) {
                console.error(dependency, e.message, e);
            }
        }));
    }));

}