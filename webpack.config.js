const path = require("path")

module.exports = {
    entry: "./packages", // 入口文件
    mode:'production',
    resolve: {
      extensions: [ '.ts', '.js' ],
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'awesome-typescript-loader',
          exclude: [path.resolve(__dirname, "node_modules")]
        },
      ],
    },
    output: {
      filename: `Jamito.min.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'JAMITO',
      libraryTarget: 'umd',
    },
    devtool: 'source-map'
}