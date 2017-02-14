/* eslint-env node */
/* global Promise */
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

exports.create = function () {
	return new Promise(function (resolve, reject) {
		const compiler = webpack({
			entry: {
				main: [
					'./src/jquery.sceditor.js',
					'webpack-dev-server/client?http://localhost:9000'
				],
				unit: [
					'./tests/unit/index.js'
				]
			},
			output: {
				path: path.join(__dirname, 'dist'),
				filename: '[name].js'
			},
			resolve: {
				modules: [
					path.join(__dirname, '..'),
					path.join(__dirname, '../node_modules')
				],
				alias: {
					src: path.join(__dirname, '../src'),
					tests: path.join(__dirname, '../tests')
				}
			},
			externals: {
				jquery: 'jQuery',
				rangy: 'rangy'
			},
			devtool: 'eval-source-map'
		});

		compiler.plugin('done', resolve);

		/* eslint no-new: off */
		new WebpackDevServer(compiler, {
			contentBase: path.join(__dirname, '..'),
			compress: true,
			publicPath: '/webpack-server/'
		}).listen(9000, 'localhost', function (err) {
			if (err) {
				reject(err);
			}
		});
	});
};

if (require.main === module) {
	exports.create();
}
