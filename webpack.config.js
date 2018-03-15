//
// I may benefit from using: 
//		1) `dotenv` plugin and 
//		2) EditorConfig `.editorconfig`
//
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const path = require("path");
const parts = require("./webpack.parts");
const webpack = require("webpack");

const PATH = {
	app: path.resolve(__dirname, "app"),
	build: path.resolve(__dirname, "build"),
};


const commonConfig = merge([
	{
		// Kill webpack process after first error is found
		bail: true,
		
		// Where to start bundling
		entry: {
			app: PATH.app,
		},
		
		// Where to output
		output: {
			// Output to the same directory
			path: PATH.build,
			
			// Capture name from the entry using a pattern
			filename: "index.js",
		},
		
		// How to resolve encountered imports
		module: {
			rules: [
				{ 
					test: "/.css$/",
					use: ["style-loader", "css-loader"],
				},
				{
					test: "/.js$/",
					use: "babel-loader",
					exclude: "/node_modules/",
				},
			],
		},
		
		// What extra processing to perform
		plugins: [
	
			new HtmlWebpackPlugin({
				title: "Webpack demo",
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				options: {
					eslint: {
						// Fail only on errors
						failOnWarning: false,
						failOnError: true,
						
						// Toogle autofix
						fix: false,
						
						// Output to Jenkings compatable XML
						outputReport: {
							filePath: "checkstyle.xml",
							formatter: require("eslint/lib/formatters/checkstyle"),
						},
					},
				},
			}),
		],
		
		// Adjust module resolution algorithm
		resolve: {
			alias: {},
		},
	},
	parts.lintJavaScript({ include: PATH.app }),
]);


const productionConfig = merge([
	parts.productionServer(),
]);


const developmentConfig = merge([
	parts.devServer({
		host: process.env.IP || process.env.HOST || "0.0.0.0",
		port: process.env.PORT || 8080,
	}),
]);


module.exports = (env={target: null}) => {
	
	if (env.target === "production") {
		return( merge([commonConfig, productionConfig]) );
	}

	return( merge([commonConfig, developmentConfig]) );
};