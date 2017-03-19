import path from 'path';
import fs from 'fs';

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    path: `${__dirname}/lib/`,
    filename: 'bundle.js',
  },
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.resolve(__dirname),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  devServer: {
    contentBase: `${__dirname}/lib/`,
  },
};
