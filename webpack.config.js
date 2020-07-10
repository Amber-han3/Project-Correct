const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      // { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      { test: /\.js|\.jsx$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.(png|jpg|gif|jpe?g|svg)$/,
        use: [
          { loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: './img',
              emitFile: false
            }  
          }
        ]
      },
    ]
  }
};