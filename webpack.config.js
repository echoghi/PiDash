'use strict';
let webpack = require('webpack');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let path = require('path');

let config = {
    context: __dirname + '/src', 
    entry: {
        app: './app.js'
    },
    output: {
        path: path.resolve(__dirname, "build/"), 
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                include: [
                    path.resolve(__dirname, "src/app/scripts"),
                    path.resolve(__dirname, "src/")
                ],
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015', 'react', 'stage-0'] }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }

                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }],
            },

            { test: /\.json$/, loader: "json-loader" }
        ]
    },
    //To run development server
    devServer: {
        host   : "localhost",
        inline : true,
        port   : 8080
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new BrowserSyncPlugin({
                host  : 'localhost',
                port  : 8080,
                proxy : 'http://localhost:8080/'
            },
            {
                reload: true
            }
        )
    ],
    watch: true,
    devtool: "inline-source-map" 
};

module.exports = config;