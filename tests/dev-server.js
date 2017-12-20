/* eslint-env node */
/* global Promise */
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

exports.create = function (port, coverage) {
	function addEntries(config, dir, entryDir) {
		fs.readdirSync(dir).forEach(file => {
			const name = file.replace(/\.js$/, '');

			config.entry[path.join(entryDir, name)] = path.join(dir, file);
		});
	}

	return new Promise(function (resolve, reject) {
		const webpackOptions = {
			entry: {
				main: [
					'./src/sceditor.js',
					'webpack-dev-server/client?http://localhost:9000'
				],
				'main-jquery': [
					'./src/jquery.sceditor.js',
					'webpack-dev-server/client?http://localhost:9000'
				],
				unit: [
					'./tests/unit/index.js'
				]
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						include: path.resolve('src/'),
						loader: 'istanbul-instrumenter-loader',
						options: {
							esModules: true
						}
					}
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
				'../sceditor.js': 'sceditor',
				jquery: 'jQuery',
				rangy: 'rangy'
			},
			devtool: 'cheap-module-inline-source-map'
		};

		addEntries(webpackOptions, './src/formats/', 'formats/');
		addEntries(webpackOptions, './src/plugins/', 'plugins/');
		addEntries(webpackOptions, './src/icons/', 'icons/');

		if (!coverage) {
			webpackOptions.module = {};
		}

		const compiler = webpack(webpackOptions);

		// Resolve promise when bundle generated
		compiler.plugin('done', resolve);

		/* eslint no-new: off */
		new WebpackDevServer(compiler, {
			contentBase: path.join(__dirname, '..'),
			compress: true,
			publicPath: '/webpack-build/'
		}).listen(port, '', function (err) {
			if (err) {
				reject(err);
			}
		});
	});
};

if (require.main === module) {
	exports.create(9000, false);
}
