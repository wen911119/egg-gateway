'use strict';

// had enabled by egg
// exports.static = true;
const path = require('path');
module.exports = {
    grpc: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-grpc'),
    }
};
