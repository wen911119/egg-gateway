const execFile = require('child_process').execFile
const path = require('path')
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
    });
};