'use strict';

// had enabled by egg
// exports.static = true;
const path = require('path');
module.exports = {
    consul: {
        enable: false,
        path: path.join(__dirname, '../lib/plugin/egg-consul'),
    },
    grpc: {
        enable: false,
        path: path.join(__dirname, '../lib/plugin/egg-grpc'),
    },
    vueSsr: {
        enable: false,
        path: path.join(__dirname, '../lib/plugin/egg-vue-ssr'),
    }
};
