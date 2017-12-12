const Service = require('egg').Service;
const createApp = () => true
class SsrService extends Service {
    async render(url) {
        const context = { url }
        const Vue = require('vue')
        createApp(context).then(app => {
            renderer.renderToString(app, (err, html) => {
                if (err) {
                    if (err.code === 404) {
                        res.status(404).end('Page not found')
                    } else {
                        res.status(500).end('Internal Server Error')
                    }
                } else {
                    res.end(html)
                }
            })
        })
        return url;
    }
}
module.exports = SsrService;
