const path = require('path')
const config = require('./webpack.config.js')

module.exports = {
  ...config,

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../', 'electron', 'include', 'cli'),
  },
}
