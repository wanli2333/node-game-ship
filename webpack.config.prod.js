const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: "./src/client/index.ts",
    output: {
        filename: "index.js",
        path: __dirname + "/dist",
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"] // 自动补全
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/html/index.html',//模板文件
            filename: './index.html',
            // chunks: [],
            inject: 'body',// 资源加入到body尾部
            hash: true//加入版本号
        }),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].css',
            filename: '[name].css',
        }),
    ],
};