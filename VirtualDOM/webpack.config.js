var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: './index.js',
  plugins: [new HtmlWebpackPlugin()],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_componentss)/,
        use: {
          loader:'babel-loader'
        }
      }
    ]
  }
}