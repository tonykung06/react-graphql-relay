var path = require('path');

module.exports = {
	entry: __dirname + '/app/main.jsx',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /jsx?$/,
			loader: 'babel',
			query: {
				plugins: [path.resolve(__dirname, './babelRelayPlugin.js')]
			}
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};