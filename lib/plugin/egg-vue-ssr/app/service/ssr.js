const Service = require('egg').Service;

class SsrService extends Service {
    async render(url) {
        const context = { url }
        try {
            console.time('ssr')
            const page = await this.app.chrome.newPage();


            page.waitForSelector('#app').then(async function () {

                await page.evaluate(() => {
                    Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
                        get() {
                            return {
                                emit: function (event, payload) {
                                    if (event === 'vuex:init') {
                                        window._state_w_j = payload.state
                                    }
                                },
                                on: function () { }
                            }
                        }
                    });
                })
            })
            await page.goto('http://127.0.0.1:8887/#/ssrtest', { waitUntil: 'networkidle0' });
            let state = await page.evaluate(() => {
                document.getElementById('app').dataset.serverRendered = true
                return window._state_w_j
            })
            
            await page.addScriptTag({
                content: `window.__INITIAL_STATE__=${JSON.stringify(state)}`
            })
            const htmlString = await page.content()
            console.timeEnd('ssr')
            return htmlString
        } catch (e) {
            return 'error'
        }
    }
}
module.exports = SsrService;
