const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

module.exports = {
	// Tell webpack to run babel on every file it runs through
	devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({})
  ],
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					presets: [
						'react',
						'stage-0'			
					]
				}
			},
			{
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
				})
			},
			{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 55000
            }
          }
        ]
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "fonts/[name].[ext]",
					},
				},
			},
			{
				// Match woff2 in addition to patterns like .woff?v=1.1.1.
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: "url-loader",
					options: {
						// Limit at 50k. Above that it emits separate files
						limit: 50000,
			
						// url-loader sets mimetype if it's passed.
						// Without this it derives it from the file extension
						mimetype: "application/font-woff",
			
						// Output below fonts directory
						name: "./fonts/[name].[ext]",
					}
				},
			},
			{
				test: /\.woff$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
					},
				},
			},
			{
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    	}
		]
	},
  plugins: [
    new ExtractTextPlugin("main.css"),
  ]
}