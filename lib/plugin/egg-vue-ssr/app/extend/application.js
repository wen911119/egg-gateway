const SSR = Symbol('Application#ssr');
module.exports = {
    get ssr() {
        if (!this[SSR]) {
            return function (page, data = {}) {
                const Vue = require('vue')
                const app = new Vue({
                    template: `<div>Hello Vue SSR</div>`
                })
                const templatePath = this.config.vueSsr.pages[page].template
                const renderer = require('vue-server-renderer').createRenderer({
                    template: require('fs').readFileSync(templatePath, 'utf-8')
                })
                return new Promise(function (resolve, reject) {
                    renderer.renderToString(app, data, (err, html) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(html)
                        }
                    })
                })
            }
        } else {
            return this[SSR]
        }
    }
}