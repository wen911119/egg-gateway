const _ = require('lodash');

// 定时获取远程服务的地址
module.exports = {
    schedule: {
        interval: '10s', // 间隔
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        let consul = require('consul')({
            promisify: true,
            host: 'daily.quancheng-ec.com',
            port: '8500'
        });
        let groups = ['athena-service', 'ceres-service', 'zeus-service', 'minos-service', 'sparta-search', 'chaos-service', 'budget-service','samoyed-service']
        let consulPromiseArray = groups.map(group => {
            return new Promise(async (resolve) => {
                let _ret = await consul.health.service({
                    service: `saluki_${group}`,
                    passing: true
                })
                resolve({
                    groupName: group,
                    groupInfo: _ret
                })
            })
        })

        let allGroupsResult = await Promise.all(consulPromiseArray)
        let servicesMap = arrayToMap(allGroupsResult, 'groupName', ['groupInfo'], function (groupInfo) {
            let _temp = {}
            for (let service of groupInfo) {
                let infos = service.Service.ID.split('-')
                let host = infos[0]
                let serviceName = infos[1]
                let version = infos[2]
                if (_temp[version]) {
                    if (_temp[version][serviceName]) {
                        _temp[version][serviceName].push(host)
                    } else {
                        _temp[version][serviceName] = [host]
                    }
                } else {
                    _temp[version] = {
                        [serviceName]: [host]
                    }
                }
            }
            return _temp
        })

        //console.log(JSON.stringify(servicesMap, null, 4))
        // let _servicesMap = { // 目标格式
        //     // group名
        //     "minos-service": {
        //         // group版本号
        //         "1.0.0": {
        //             // service名
        //             "com.quancheng.minos.service.ApprovalflowDefService": [
        //                 "10.42.118.41:15009", // host1
        //                 "10.42.30.235:15009"  // host2
        //             ]
        //         },
        //         "2.0.0": {

        //         }
        //     }
        // }

        ctx.app.services = servicesMap
    }
};

function arrayToMap(arr, leader, followers = [], filter = (t) => t) {
    let ret = {}
    for (let item of arr) {
        if (item[leader]) {
            let _temp = null
            if (followers.length === 0) {
                delete item[leader]
                _temp = item
            } else if (followers.length === 1) {
                _temp = item[followers[0]]
            } else {
                _temp = _.pick(followers)
            }
            ret[item[leader]] = filter(_temp)
        }
    }
    return ret
}