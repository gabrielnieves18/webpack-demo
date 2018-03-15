//
// I may benefit from using `dotenv` plugin
//
const _ = require("lodash/array");
const DashboardPlugin = require("webpack-dashboard/plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const SystemBellPlugin = require("system-bell-webpack-plugin");
const webpack = require("webpack");

const PATH = {
	app: path.resolve(__dirname, "app"),
	build: path.resolve(__dirname, "build"),
};


const commonConfig = {
	
	mode: "development",
	
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
		}),
	],
	
	// Adjust module resolution algorithm
	resolve: {
		alias: {},
	},
};


const productionConfig = () => {
	commonConfig.mode = "production";
	return(commonConfig);
};


const developmentConfig = () => {
	
	// Add development plugins
	const devPlugins = [
		new DashboardPlugin({ port: process.env.PORT || 8080 }),
		new FriendlyErrorsWebpackPlugin(), // This plugin throws depricated warnings
		new SystemBellPlugin(),    
	];
	
	const config = {
		
		devServer: {
			
			allowedHosts: [
				// Add access to cloud9 host
				process.env.C9_HOSTNAME,
			],
			
			compress: true,
			
			// Enable history API fallback so HTML5 History based
			// routing works. Good for complex setups.
			historyApiFallback: true,
			
			// Parse host and port from env to allow customization.
			//
			// If you use Docker, Vagrant or Cloud 9, set
			// host: process.env.IP || "0.0.0.0";
			// 
			// 0.0.0.0 is available to all network devices 
			// unlike default `localhost`.
			host: process.env.IP || process.env.HOST || "0.0.0.0",
			port: process.env.PORT || 8080,
		},
		
		module: {
			rules: [
				{
					test: /\.js$/,
					enforce: "pre",
					
					loader: "eslint-loader",
					options: {
						emitWarning: true,
					},
				},
			],
		},

		// Merge plugins
		plugins: _.concat(
			[],
			commonConfig.plugins,
			devPlugins
		), 
		
	};
	
	// Merge config and commonConfig
	return(Object.assign(
		{}, 
		commonConfig, 
		config
	));
};


module.exports = (env={target: null}) => {
	
	if (env.target === "production") {
		return( productionConfig() );
	}

	return( developmentConfig() );
};