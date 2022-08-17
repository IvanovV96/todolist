const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    devServer: {
        historyApiFallback: true,
        static: {
          directory: path.join(__dirname, './dist'),
        },
        open: true,
        hot: true,
        compress: true,
        port: 8008,
      },
    entry: {
        main: path.resolve(__dirname, './src/js/app.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    plugins : [
        new HtmlWebpackPlugin({
            title: 'Todo',
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html'
        }),
        new CleanWebpackPlugin()
    ]
}