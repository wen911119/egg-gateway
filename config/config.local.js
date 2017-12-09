'use strict';

module.exports = appInfo => {
    return {
        consul: {
            host: 'daily.quancheng-ec.com',
            port: "8500",
            groups: ['athena-service', 'ceres-service', 'zeus-service', 'minos-service', 'sparta-search', 'chaos-service', 'budget-service', 'samoyed-service']
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
            pem: process.cwd() + '/grpc.gem'
        }
    }
};
