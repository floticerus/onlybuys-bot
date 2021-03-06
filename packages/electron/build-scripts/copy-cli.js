/* eslint-disable  @typescript-eslint/no-var-requires */
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

module.exports = (buildPath, electronVersion, platform, arch, done) => {
  const source = path.join(__dirname, '../', '../', 'cli')
  const dest = path.join(buildPath, 'cli')

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  fsExtra.copySync(source, dest)

  done()
}
