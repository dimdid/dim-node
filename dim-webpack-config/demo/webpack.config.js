const WebpackConfig = require('../index.js')
  , {resolve} = require('path')
;
const util = require('util');

const opts = {
  htmlPluginsOptions: [
    {
      //use default template (no body)
      title: 'HOME',
      filename: 'home.html',
      chunks: ['core', 'global']
    },
    {
      //test page
      title: 'TEST',
      filename: 'test.[hash].html',
      chunks: ['test'],
      template: './test/test.html' //TODO: detect it auto with chunkname|index
    },
    {
      // page2
      title: 'PAGE2',
      filename: 'page2.[hash].html',
      chunks: ['global', 'page2'],
      template: './page2/page2.html'
    }

  ],
  usedOfCss: resolve(__dirname, './*/*.html')
};

let config = new WebpackConfig(
  __dirname,
  {
    core: ['./index.js'],
    test:'./test/test.js',
    page2: './page2/page2.js'
  },
  `${__dirname}/dist`,
  opts
);
console.log(config.plugins)
module.exports = config;