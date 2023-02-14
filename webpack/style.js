const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.(less|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader'
          ]
        }
      ]
    }
  }
};