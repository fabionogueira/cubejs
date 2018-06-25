var path = require('path');

module.exports = {
    mode: 'development',
    entry: './test/index.js',
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'cubejs.dev.js'
    }
};