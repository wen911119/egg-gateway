'use strict';

module.exports = appInfo => {
    return {
        consul: {
            host: 'daily.quancheng-ec.com',
            port: "8500",
            groups: ['athena', 'ceres', 'zeus', 'minos', 'sparta', 'chaos', 'budget', 'samoyed']
        },
        grpc: {
            proto: {
                remote: "git@gitlab.quancheng-ec.com:shared/service-all.git",
                branch: "master"
            },
            services: {
                FormDataBinDingService: {
                    groupName: 'athena',
                    groupVersion: '1.0.0',
                    serviceName: 'FormDataBinDingService'
                }
            },
            retry: 1, // 重试次数
            pem: process.cwd() + '/grpc.pem'
        }
    }
};
