const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry:'./src/index.js',
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader'
            },
            {
                test:/\.css$/,
                exclude:/node_modules/,
                loader:'css-loader'
            }
        ]
    }
}