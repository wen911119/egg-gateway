module.exports = app => {
    app.config.coreMiddleware.push('ssr');
};