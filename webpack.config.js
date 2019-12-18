var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,
    entry: './staticfiles/assets/js/main',
    output: {
        path: path.resolve('./staticfiles/assets/bundles/'),
        filename: 'app.js'
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            {
            test : /\.css$/,
            use : ['style-loader', 'css-loader']
            },
            {
            test: /\.(png|jp(e*)g)$/,
            loader: 'url-loader',
            options: { 
                limit: 10000,
                name: '[name].[ext]',
                publicPath: '../bundles/'
            }
            },
            {
            test: /\.svg$/,
            loader: 'file-loader' 
            } 
        ]
    },
    resolve: {
        alias: {vue: 'vue/dist/vue.common.js'}
    },

};
