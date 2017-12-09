const GRPC = Symbol('Application#grpc');
const grpc = require('grpc')
const FS = require('fs')
module.exports = {
    get grpc() {
        // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
        if (!this[GRPC]) {
            // 实际情况肯定更复杂
            let temp = {}
            let serviceConfig = this.config.grpc.services
            for (let key in serviceConfig) {
                // key 是用户定义的想要使用的服务名
                const { groupName, groupVersion, serviceName } = serviceConfig[key]
                // pb定义的该service实例
                const instance = this.protos.com.quancheng[groupName].service[serviceName]
                temp[key] = proxyHandler(groupName, groupVersion, instance)
            }
            this[GRPC] = temp
        }
        return this[GRPC];
    },
};

function proxyHandler(groupName, groupVersion, pbInstance) {
    let cache = {}
    return new Proxy({}, {
        get: function (target, key, receiver) {
            console.log(`get ${key}!`)
            return function (ctx, params, metaData) {
                const services = ctx.app.services
                const host = _.sample(services[groupName][groupVersion])
                let client
                if (cache[host]) {
                    client = cache[host]
                } else {
                    const pemPath = ctx.app.config.grpc.pem
                    const ssl_creds = grpc.credentials.createSsl(FS.readFileSync(pemPath))
                    client = cache[host] = new pbInstance(host, ssl_creds)
                }
                let retry = 0
                return new Promise(function invoke(resolve, reject) {
                    client[key](params, function (err, response) {
                        if (err) {
                            if (retry++ > 5) {
                                // 重试超过5次
                                reject(err)
                            } else {
                                invoke(resolve, reject)
                            }
                        } else {
                            resolve(response)
                        }
                    })
                })
            }
        }
    })
}
