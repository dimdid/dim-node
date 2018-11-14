const {HotModuleReplacementPlugin} = require('webpack')
;

module.exports = function addDev(config){
  config.devServer = {
    contentBase: config.output.path,
    hot: true
  };
  config.plugins.push(
    new HotModuleReplacementPlugin()
  );
};
