const Service = require('egg').Service;
const createApp = () => true
let serverBundle = {}
let clientManifest = ''
const { createBundleRenderer } = require('vue-server-renderer')
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
})
class SsrService extends Service {
    async render(url) {
        const context = { url }
        renderer.renderToString(context, (err, html) => {
            // 处理异常……
            return html
        })
    }
}
module.exports = SsrService;
