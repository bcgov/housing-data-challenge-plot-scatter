// See http://engineering.invisionapp.com/post/optimizing-webpack/

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        vendor: [path.join(__dirname, 'src', 'vendors.js')]
    },
    output: {
        path: path.join(__dirname, 'public', 'dll'),
        filename: 'dll.[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            name: '[name]',
            context: path.resolve(__dirname, 'src')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        modules: ['node_modules']
    }
};