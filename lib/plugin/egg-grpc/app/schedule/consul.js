// 定时获取远程服务的地址
module.exports = {
    schedule: {
        interval: '5s', // 间隔
        type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        let consul = require('consul')({
            promisify: true,
            host: 'daily.quancheng-ec.com',
            port: '8500'
        });
        let groups = ['minos-service']
        let consulPromiseArray = groups.map(group => {
            return consul.health.service({
                service: `saluki_${group}`,
                passing: true
            })
        })

        let allGroupsResult = await Promise.all(consulPromiseArray)

        console.log(allGroupsResult[0])

        // allGroupsResult = allGroupsResult.map(serviceResult=>{

        // })
        // let servicesMap = {}
        // for(groupResult of allGroupsResult){
        //     servicesMap[groupResult.groupName] = servicesMap.map
        // }
        // services = services.map(function (service) {
        //     let _service = service.Service
        //     let _temp = _service.ID.split('-') //"10.42.144.64:10053-com.quancheng.athena.service.AthenaExportService-1.0.0"
        //     return {
        //         name: _temp[1], // 服务名 com.quancheng.athena.service.AthenaExportService
        //         version: _temp[2], // 服务的版本
        //         address: _temp[0], // 服务的调用地址
        //         group: '' // 改服务属于哪个分组
        //     }
        // })
        //console.log(ret)
        let servicesMap = {
            // group名
            "minos-service": {
                // group版本号
                "1.0.0": {
                    // service名
                    "com.quancheng.minos.service.ApprovalflowDefService": [
                        "10.42.118.41:15009", // host1
                        "10.42.30.235:15009"  // host2
                    ]
                },
                "2.0.0": {

                }
            }
        }
    }
};