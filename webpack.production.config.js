var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    cache: true,
    devtool: 'cheap-module-source-map',
    entry: './src/client.js',
    output: {
        path: './public',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': JSON.stringify('production') }
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, 'src'),
            manifest: require('./dll/vendor-manifest.json')
        }),
        new CopyWebpackPlugin([
            { from: 'src/data/data-sources.json', to: 'data/data-sources.json' },
            { from: 'src/data/boundary_linked/Census_2016/Dwellings_DisArea.csv', to: 'data/boundary-linked/census-dwellings.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/MedianIncome_Formatted_Municipalities.csv', to: 'data/boundary-linked/median-incomes.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/Commute_Formatted_Municipalities.csv', to: 'data/boundary-linked/commute_municipalities.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/Household_Formatted_Municipalities.csv', to: 'data/boundary-linked/household_municipalities.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/IncomeCost_formatted_Municipalities.csv', to: 'data/boundary-linked/incomecost_municipalities.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/Mobility_Formatted_Municipalities.csv', to: 'data/boundary-linked/mobility_municipalities.csv' },
            { from: 'src/data/boundary_linked/Population/PopulationProjection_Formatted_RegionalDistricts.csv', to: 'data/boundary-linked/population_projections.csv' },
            { from: 'src/data/boundary_linked/PTT/municipal_monthly/ptt_municipal_0616.csv', to: 'data/boundary-linked/ptt_municipal_0616.csv' },
            { from: 'src/data/boundary_linked/PTT/municipal_monthly/ptt_municipal_months_aggregated.csv', to: 'data/boundary-linked/ptt_municipal_months_aggregated.csv' },
            { from: 'src/data/boundary_linked/Transit/TransitCosts_Municipalities.csv', to: 'data/boundary-linked/transitcosts_municipalities.csv' },
            { from: 'src/data/layers/Health/hospital_locations.csv', to: 'data/layer/health-hospital-locations.csv' },
            { from: 'src/data/layers/Health/hlbc_WalkInClinics.csv', to: 'data/layer/health-clinic-locations.csv' },
            { from: 'src/data/layers/Health/hlbc_EmergencyRooms.csv', to: 'data/layer/health-emergency-room-locations.csv' },
            { from: 'src/data/layers/Bike_Routes/bike_routes_kelowna.json', to: 'data/layer/bike_routes_kelowna.json' },
            { from: 'src/data/layers/Bike_Routes/bike_routes_vancouver.json', to: 'data/layer/bike_routes_vancouver.json' },
            { from: 'src/data/layers/Bike_Routes/bike_routes_victoria.json', to: 'data/layer/bike_routes_victoria.json' },
            { from: 'src/data/layers/Parks/parks_kelowna.json', to: 'data/layer/parks_kelowna.json' },
            { from: 'src/data/layers/Parks/parks_vancouver.json', to: 'data/layer/parks_vancouver.json' },
            { from: 'src/data/layers/Parks/parks_victoria.json', to: 'data/layer/parks_victoria.json' },
            { from: 'src/data/layers/Education/school_locations.csv', to: 'data/layer/education-school-locations.csv' },
            { from: 'src/data/layers/Education/postsecondary_locations.csv', to: 'data/layer/education-postsecondary-locations.csv' },
            { from: 'src/data/boundary_linked/NHS_Profile_2011/UseCase_Sample.csv', to: 'data/boundary-linked/household-index.csv' }
        ]),
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src')
                ],
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.csv$/,
                loader: 'url-loader'
            },
            {
                test: /\.png$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader'
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.json']
    }
};
