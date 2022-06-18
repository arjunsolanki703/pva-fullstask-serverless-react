const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const serverlessWebpack = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
  devtool: 'inline-cheap-module-source-map',
  entry: serverlessWebpack.lib.entries,
  mode: serverlessWebpack.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false,
  },
  node: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@environments': path.resolve(__dirname, 'src/environments/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@shared': path.resolve(__dirname, 'src/shared/'),
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    new ForkTsCheckerWebpackPlugin({
      typescript: true,
    }),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(require('config')),
    }),
  ],
};
