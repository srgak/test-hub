const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.ts',
  devtool: 'inline-source-map',
  //билд на выходе
  output: {
    filename: 'bundle-js.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]')
  },
  module: {
    rules: [
      //файлы pug
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: isDev
            }
          }
        ]
      },
      //файлы стилей
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      //файлы изобрадений
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
      //js
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: isProd ? ['babel-loader', 'ts-loader'] : ['ts-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  //плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.pug'),
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/pages/chat.pug'),
      filename: 'chat.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle-css.[contenthash].css'
    }),
    new CleanWebpackPlugin(),
  ],
  //дев сервер
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 4200
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
}