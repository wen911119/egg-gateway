const Service = require('egg').Service;
const ChromeRender = require('chrome-render');

class SsrService extends Service {
    async render(url) {
        const context = { url }
        try {
            console.time('ssr')
            const htmlString = await this.app.chrome.render({
                url: 'http://127.0.0.1:8887/#/ssrtest',
                useReady: true
            });
            console.timeEnd('ssr')
            return htmlString
        } catch (e) {
            return 'error'
        }
    }
}
module.exports = SsrService;
