const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	output: { filename: 'index.js' },
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src', 'public', 'js'),
				loader: 'babel-loader'
			}
		]
	},
	optimization: {
		minimizer: [new TerserPlugin()]
	}
};
