const { join } = require('path');

const express = require('express');

module.exports = function startServer(port, paths) {
    console.log('Starting server...');

    const app = express();

    app.use((req, res, next) => {
        console.log(new Date().toISOString(), req.method, req.path);
        next();
    });

    // serve sources - Developer Tools support
    app.use('/src/', express.static(paths.src, { fallthrough: false }));

    // serve web_modules (dependencies)
    app.use('/web_modules/', express.static(paths.web_modules, { fallthrough: false }));

    // serve static assets or app modules by file extension
    const servePublicStaticAssets = express.static(paths.static, { fallthrough: true, index: 'index.html' });
    const serveAppModules = express.static(paths.dist, { fallthrough: true, index: 'index.js' });

    app.use((req, res, next) => {
        const fileExtenstion = req.path.split('/').pop().split('.').pop();

        switch (fileExtenstion) {
            case 'html':
            case 'css':
            case 'ttf':
            case 'woff2':
            case 'svg':
                return servePublicStaticAssets(req, res, next);
            case 'js':
            case 'ts':
            case 'map':
                return serveAppModules(req, res, next);
        }

        next();
    });

    // fallback to index.html - SPA routing support
    app.use((req, res) => res.sendFile(join(paths.static, 'index.html')));


    app.listen(port, () => {
        console.log(`Server listening on "http://localhost:${port}"`);
    })
}