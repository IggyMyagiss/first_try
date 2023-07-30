const path = require('path')
/* const - объявляем глобальную переменную, которую нельзя изменить
require - функция для закгрузки модуля в которую передается название модуля */
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = (ext) => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];
  if (isDev) {
    loaders.push('eslint-loader');
  }
  return loaders;
};


// экспортируем модуль с вэбпаком
module.exports = {
  context: path.resolve(__dirname, 'src'),
  /* то где лежат все исходники нашего приложения,
__dirname - путь до текущей папки - MY_JS, к нему конкатинируется src
метод .resolve() объекта Promise возвращает объект Promise,
который был успешно выполнен с заданным значением
(изменяет состояние объекта Promise на fulfilled - успешное выполнение).
Метод .resolve(), как правило, используется для
преобразования какого-то значения в объект Promise.
ИТОГО : context смотрит за всеми исходниками в папке src */
  mode: 'development', // режим разработки
  entry: ['@babel/polyfill', './index.js'], // остальные настройки
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
