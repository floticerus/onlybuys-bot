const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

module.exports = (buildPath, electronVersion, platform, arch, done) => {
  //
  console.log('copy cli')

  console.log(buildPath)

  const sourceDir = path.join(
    __dirname,
    '../',
    'node_modules',
    '@onlybuys-bot',
    'cli',
  )
  const destinationDir = path.join(
    buildPath,
    'node_modules',
    '@onlybuys-bot',
    'cli',
  )

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true })
  }

  fsExtra.copySync(sourceDir, destinationDir)

  done()
}
