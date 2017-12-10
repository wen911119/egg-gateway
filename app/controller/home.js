'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        console.log(Object.keys(this.app.grpc))
        console.log(this.app.grpc.FormDataBinDingService.deleteOne)
        try {
            let ret = await this.app.grpc.FormDataBinDingService.deleteBinDingByFormDataIds({
                formDataIds: []
            })
            console.log(ret)
        } catch (e) {
            console.log(e, 444444444444444)
        }

        let ssrHtml = 'ssr failed !'
        try {
            ssrHtml = await this.app.ssr('home',{
                author:'wenjun',
                title:'Vue SSR Demo !'
            })
        } catch (e) {
            console.log(e)
            console.log('ssr failed !');
        }


        this.ctx.body = ssrHtml;
    }
}

module.exports = HomeController;
