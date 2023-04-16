const path = require('path');
const pages = require('./webpack/pages');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const mode = process.env.NODE_ENV || 'development';
const isDev = mode === 'development';

module.exports = {
  devtool: isDev ? 'inline-source-map' : false,
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
    filename: '[name].bundle.js',
    assetModuleFilename: path.join('assets/images', '[name][ext]')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp4|mov|webm)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('assets/video', '[name][ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('assets/fonts', '[name][ext]')
        }
      },
      {
        test: /\.(json)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('mock', '[name][ext]')
        }
      }
    ]
  },
  plugins: [
    ...pages,
    new FileManagerPlugin({
      events: {
        onEnd: {
          delete: ['dist/*.LICENSE.txt']
        }
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 8080
  }
};