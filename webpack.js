var path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

var assetsPath = path.join(__dirname, "dist");

module.exports = env => {
    return {
        entry: './src/index.js',
        output: {
            path: assetsPath,
            publicPath: '/',
            filename: 'index.js',
        },
        mode: env.NODE_ENV,
        module: {
          // rules: [
          //   {
          //     test: /\.js$/,
          //     exclude: /(node_modules)/,
          //     use: {
          //       loader: 'babel-loader',
          //       options: {
          //         presets: [["@babel/preset-env"], ["@babel/preset-react"]],
          //         plugins: ["@babel/plugin-transform-runtime"]
          //       }
          //     }
          //   }
          // ]
        },
        devServer: {
          contentBase: path.resolve(__dirname, assetsPath),
          port: 8010,
          hot: true,
          stats: "errors-only",
          overlay: true,
          historyApiFallback: true
        },
        plugins: [
          new CleanWebpackPlugin(),
          new HtmlWebpackPlugin({
            title: "request",
            template: "./src/index.html",
            minify: {
              //压缩HTML文件
              removeComments: true, //移除HTML中的注释
              collapseWhitespace: false //删除空白符与换行符
            }
          })
        ]
    }
  }