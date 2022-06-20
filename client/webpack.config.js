const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    inner: "./src/inner.ts",
    launcher: "./src/launcher.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "static/inner.html",
      chunks: ["inner"],
    }),
    // new HtmlInlineScriptPlugin({
    //   scriptMatchPattern: [/inner\.js$/],
    // }),
  ],
};
