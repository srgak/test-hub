const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pathSource = '../src';

module.exports = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, pathSource, 'pages/index/index.pug'),
    filename: 'index.html'
  })
];