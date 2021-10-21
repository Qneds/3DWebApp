import WorkerPlugin from 'worker-plugin';
import path from 'path';

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: /(src)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'useBuiltIns': 'usage',
                  'corejs': 3,
                },
              ],
              ['@babel/preset-typescript', {allowNamespaces: true}],
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        }],
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }],
      },
      {
        test: /\.worker\.js$/,
        use: {loader: 'worker-loader'},
      },
    ],
  },
  plugins: [
    new WorkerPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
