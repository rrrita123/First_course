const path = require('path');  // require изпользуем для импортирования
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Плагин генерирует HTML-файл
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Плагин для удаления / очистки папок сборки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Этот плагин извлекает CSS в отдельные файлы
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //Плагин для оптимизации, минимизации CSS.
const TerserJSPlugin = require('terser-webpack-plugin'); // Плагин для оптимизации, минимизации JS
const CopyPlugin = require('copy-webpack-plugin'); // Копирует отдельные файлы или целые каталоги


module.exports = {
  mode: 'development', // модификация сборки - для разработки
  entry: './source/index.js', // точка входа наших модулей, берем модули из index.js
  output: { // выходные данные, описываем куда мы ходим положить получ. bundle.js
    filename: 'bundle.js',
    path: path.join(__dirname, '/build/'), // задаем куда мы хотим положить bundle, благодаря пакету path сам знает какая ОС и сам проставляет нужный путь правильным синтаксисом
  },
  devtool: 'source-map', // карта исходников, указывает в каком файле исходников лежит наш код
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  devServer: {
    contentBase: path.join(__dirname, '/build/'), // путь, server понимает, откуда следует брать контент
    watchContentBase: true // указываем серверу, чтобы он следил за изменениями файлов
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // Этот плагин извлекает CSS в отдельные файлы
          // Translates CSS into CommonJS
          'css-loader',
          // Компилирует Sass в CSS
          'sass-loader'
        ]
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[name].[ext]',
            }
          }

        ],
      },

      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader', //
            options: {
              name: '[name].[ext]',
              outputPath: "img/",
            },
          }
        ],
        exclude: /.+fonts.+$/i // исключаем обработку svg шрифтов
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ // перенос index.html в build
      template: './source/' + 'index.html',
      filename: 'index.html',
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: './css/style.css', // путь и наименование файла css
    }),
    new CleanWebpackPlugin(), // очистка папки сборки
    new CopyPlugin({          // копирование img в build
      patterns: [
        {from: './source/' + 'img', to: 'img' },
      ],
    }),
  ]
}
