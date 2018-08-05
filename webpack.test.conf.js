var path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        test: './test/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'test'),
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
            },
            {
                test: /\.css$/,
                use: [
                  'css-loader'
                ]
             },
             {
                test: /\.csv$/,
                use: [
                  'text-loader'
                ]
             },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    }
}
