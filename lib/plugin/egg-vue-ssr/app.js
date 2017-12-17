module.exports = app => {
    app.config.coreMiddleware.push('ssr');
    app.beforeStart(async () => {
        const puppeteer = require('puppeteer');
        app.chrome = await puppeteer.launch();
    })
};