module.exports = app => {
    app.config.coreMiddleware.push('ssr');
    app.beforeStart(async () => {
        const ChromeRender = require('chrome-render');
        app.chrome = await ChromeRender.new({})
    })
};