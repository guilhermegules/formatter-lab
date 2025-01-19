const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/extension.ts",
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/, path.resolve(__dirname, "src/test")],
      },
      {
        test: /\.js$/,
        use: "source-map-loader",
        enforce: "pre",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: ["vscode"],
  plugins: [],
  devtool: "source-map",
};
