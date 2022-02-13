#!/usr/bin/env node

const merge = require('lodash/merge');
const { join } = require('path');

const buildWebModules = require('./web-modules/build');
const startServer = require('./server/start');

const flags = {
    noBundling: process.argv.includes('--no-bundling'),
    noServing: process.argv.includes('--no-serving')
};

const cwd = (process.env['INIT_CWD'] || __dirname).trim();

const config = {
    port: 3000,
    entriesMap: {},
    paths: {
        static: join(cwd, 'static'),
        src: join(cwd, 'src'),
        dist: join(cwd, 'dist'),
        web_modules: join(cwd, 'web_modules')
    }
};

(async () => {
    try {
        const externalConfig = require(join(cwd, 'ui-server.config.js'));
        merge(config, externalConfig);

        if (!flags.noBundling) {
            await buildWebModules(cwd, config.dependencies, config.paths.web_modules);
        }

        if (!flags.noServing) {
            startServer(config.port, config.paths);
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
})();