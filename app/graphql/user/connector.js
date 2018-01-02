'use strict';

const DataLoader = require('dataloader');

class UserConnector {
    constructor(ctx) {
        this.ctx = ctx;
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    async fetch(ids) {
        // const users = this.ctx.app.model.User.findAll({
        //     where: {
        //         id: {
        //             $in: ids,
        //         },
        //     },
        // }).then(us => us.map(u => u.toJSON()));
        const params = {
            accountId: '103170405113016002',//accountId,
            extend: 'apply',
            nodeType: 'executive',
            pageRequest: {
                currentPage: 1,
                pageSize: 1000
            }
        }
        const rets = await this.ctx.app.grpc.ApprovalflowService.waitMyApprove(params)
        return rets
    }

    fetchByIds(ids) {
        return this.loader.loadMany(ids);
    }

    fetchById(id) {
        return this.loader.load(id);
    }
}

module.exports = UserConnector;