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
                },
                ApprovalflowService:{
                    groupName: 'minos',
                    groupVersion: '1.0.0',
                    serviceName: 'ApprovalflowService'
                }
            },
            retry: 1, // 重试次数
            pem: process.cwd() + '/grpc.pem',
            options: {
                'grpc.ssl_target_name_override': 'grpc',
                'grpc.default_authority': 'grpc'
            }
        },
        vueSsr: {
            pages: {
                'home': {
                    template: process.cwd() + '/templates/home.template.html'
                }
            }
        }
    }
};
