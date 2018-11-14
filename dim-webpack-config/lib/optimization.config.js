module.exports = {
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        core: {
          name: 'core',
          chunks: 'initial'
        }
      },
      chunks: 'all'
    }
  }
};
