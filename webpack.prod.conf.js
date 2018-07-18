var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        cubejs: './src/index.js',
        view: './src/view.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                      presets: ['es2015', 'stage-0']
                    }
                }
            }
        ]
    }
}
