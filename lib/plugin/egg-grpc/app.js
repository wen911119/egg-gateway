const execFile = require('child_process').execFile
const path = require('path')
const glob = require('glob')
const grpc = require('grpc')
const _ = require('lodash')
module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        const { remote, branch } = app.config.grpc.proto
        let fetch_proto = new Promise(function (resolve, reject) {
            try {
                execFile(__dirname + '/fetch_proto.sh', [remote, branch], {}, function (err, stdout, stderr) {
                    if (err) {
                        reject(stderr)
                    } else {
                        resolve(stdout)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
        let res = await fetch_proto
        console.log(res)
        // pb文件已经有了
        // 接下来读取pb文件
        let protos = {}
        let root = process.cwd() + '/proto/api/src/main/proto/'
        glob.sync(root + '**/*_service.proto').forEach(function (f) {
            protos = _.defaultsDeep(protos, grpc.load({ root: root, file: f.substring(root.length) }))
        })
        // 将读取出来的pb对象挂到app上供别人使用
        app.protos = protos

        // console.log(Object.keys(protos.com.quancheng.zeus))
        // console.log(JSON.stringify(protos.com.quancheng.zeus.service))
    });
};