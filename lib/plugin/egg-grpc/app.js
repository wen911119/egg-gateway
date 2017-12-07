const execFile = require('child_process').execFile
const path = require('path')
const glob = require('glob')
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
        console.log(__dirname)
        console.log(__filename)
        console.log(process.cwd());
        console.log(path.resolve('./'));
        let temp = []
        glob.sync(process.cwd()+'/proto/api/src/main/proto/**/*_service.proto').forEach(function(f){
            console.log(f)
            
        })
    });
};