/* eslint-disable node/no-unpublished-require */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        sourceMapFilename: 'sourceMap/[file].map',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devtool:
        process.env.NODE_ENV === 'development'
            ? 'eval-source-map'
            : 'source-map',
    devServer: { watchFiles: '.src/template.html' },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            favicon: '',
        }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name]-[hash][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
