const
  {resolve} = require('path'),
  glob = require('glob-all'),
  ExtractCssPlugin = require('mini-css-extract-plugin'),
  HtmlPlugin = require('html-webpack-plugin'),
  PurifyCSSPlugin = require('purgecss-webpack-plugin'),// require('purifycss-webpack')
  HighlightPlugin = require('highlight-webpack-plugin')
;



const IS_PROD = process.env.NODE_ENV? process.env.NODE_ENV === 'production': true,
  CONTEXT = __dirname,
  USED_CONTENT = [
    // for Purifycss
    resolve(CONTEXT, './src/*')
  ]
;

const styleLoaders = [
  IS_PROD ? ExtractCssPlugin.loader : 'style-loader',
  {
    loader: 'css-loader'
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        require('autoprefixer')({
          browsers: ['last 2 versions']
        })
      ]
    }
  },
  'sass-loader'
];

// noinspection WebpackConfigHighlighting
let wpConfig = {
  //context: CONTEXT,
  //entry: ENTRIES,
  output: {
    filename: IS_PROD ? '[name].[contenthash].js' : '[name].js'
  },
  mode: IS_PROD ? 'production': 'development',
  devtool: IS_PROD ? false : 'source-map',
  plugins: [
    new ExtractCssPlugin({
      filename: IS_PROD ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: IS_PROD ? '[contenthash].css' : '[id].css'
    }),
    new HighlightPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(USED_CONTENT)
    })
    /*
    new HtmlPlugin({
      title: 'Home',
      template: './src/home/home.html',
      excludeChunks: ['admin']
    }),
     */
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              name: !IS_PROD ? '[name].[ext]' : '[name].[hash].[ext]'
            }
          }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: styleLoaders
      }
    ]
  }
};

module.exports = wpConfig;


