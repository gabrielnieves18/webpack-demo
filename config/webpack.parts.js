const DashboardPlugin = require("webpack-dashboard/plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const SystemBellPlugin = require("system-bell-webpack-plugin");

exports.devServer = ({ host, port } = {}) => ({
	
	mode: "development",
	
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
		host,
		
		overlay: {
			errors: true,
			warnings: true,
		},
		
		port,
		
		// Controll how verbose is the logger
		stats: "errors-only",
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
	
	plugins: [
		new DashboardPlugin({ port }),
		new FriendlyErrorsWebpackPlugin(), // This plugin throws depricated warnings
		new SystemBellPlugin(),    
	],
});


exports.lintJavaScript = ({ include, exclude, options } = {}) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,
				enforce: "pre",
				loader: "eslint-loader",
				options,
			},
		],
	},
});


exports.productionServer = () => ({
	mode: "production",
});