const GRPC = Symbol('Application#grpc');
const grpc = require('grpc')
const FS = require('fs')
const _ = require('lodash')
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
            return function (ctx, params, metaData = {}) {
                const services = ctx.app.services
                const host = _.sample(services[groupName][groupVersion])
                let client
                if (cache[host]) {
                    console.info('client from cache !')
                    client = cache[host]
                } else {
                    const pemPath = ctx.app.config.grpc.pem
                    const ssl_creds = grpc.credentials.createSsl(FS.readFileSync(pemPath))
                    const mcreds = grpc.credentials.createFromMetadataGenerator(function (_, callback) {
                        const metadata = new grpc.Metadata()
                        metadata.set('plugin_key', 'plugin_value')
                        callback(null, metadata)
                    })
                    const combined_creds = grpc.credentials.combineChannelCredentials(ssl_creds, mcreds)
                    client = cache[host] = new pbInstance(host, combined_creds, ctx.app.config.grpc.options)
                }
                let retry = 0
                const maxRetry = ctx.app.config.grpc.retry || 5 // 最大重试次数， 默认5次
                let customMetadata = new grpc.Metadata()
                Object.keys(metaData).forEach(k => customMetadata.set(k, metadata[k]))
                return new Promise(function invoke(resolve, reject) {
                    client[key](params, customMetadata, function (err, response) {
                        if (err) {
                            console.warn(`methods:${key}出现错误，错误原因:${err}`)
                            if (++retry > maxRetry) {
                                console.error(`重试超过${maxRetry}次,放弃！`)
                                // 重试超过规定次数
                                reject(err)
                            } else {
                                console.warn(`准备重试-->第${retry}次`)
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
