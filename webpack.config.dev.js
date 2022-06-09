const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    // watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: ['**/servers/**', '**/node_modules'],
    },
    entry: "./src/client/index.ts",
    output: {
        filename: "index.js",
        path: path.join(__dirname, 'dist'),
        publicPath: "/"
    },
    devtool: "source-map", // 生成map
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
            inject: 'body',//资源加入到底部
            hash: true //加入hash
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: "./src/client/assets", to: "./dist" },
        //     ]
        // }),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].css',
            filename: '[name].css',
        }),
    ],
    // devServer: {
    //     publicPath: '/',
    //     contentBase: path.join(__dirname, './src/client/'),
    //     compress: true,
    //     port: 9000,
    //     hot: true,
    //     after: function (app, server, compiler) {
    //         console.log('app after');
    //         console.log(path.join(__dirname, 'dist'));
    //     },
    // }
};