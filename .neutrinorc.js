const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const Future = require('fluture')
const R = require('ramda')

const assetsDirectory = 'https://github.com/b-gran/fast-keys/raw/master/assets'
const readme = path.join(__dirname, 'README.md')
const license = path.join(__dirname, 'LICENSE')

module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/library',
      {
        name: 'fast-keys'
      }
    ],
    '@neutrinojs/jest',

    // Publish to npm
    neutrino => {
      neutrino.register('publish', () => {
        const isNextRelease = neutrino.options.args.next
        const packageJson = neutrino.options.packageJson
        const mainFile = path.resolve(path.join(neutrino.options.output, packageJson.main))

        return Future.node(done => fs.access(mainFile, done))
          .mapRej(() => {
            console.log()
            console.error('No main file in output directory. Please run npm build')
          })

          // Create package.json for publishing
          .chain(() => {
            const trimPackageJson = R.omit([ 'devDependencies', 'scripts' ], packageJson)
            return Future.encase3(JSON.stringify, trimPackageJson, null, ' ')
          })
          .chain(packageJsonString => {
            const publishablePackageJsonPath = path.resolve(path.join(neutrino.options.output, 'package.json'))
            return Future
              .node(done => fs.writeFile(publishablePackageJsonPath, packageJsonString, done))
          })

          // Copy LICENSE
          .chain(() => Future.node(done => fs.readFile(license, done)))
          .chain(licenseContents => Future.node(done => fs.writeFile(
            path.resolve(path.join(neutrino.options.output, 'LICENSE')),
            licenseContents,
            done
          )))

          // Copy README to build & substitute assets
          .chain(() => Future.node(done => fs.readFile(readme, done)))
          .chain(readmeContents => {
            const substituteAssets = readmeContents.toString().replace(
              /\(assets\/([\w\-_.]+)\)/,
              `(${assetsDirectory}/$1)`
            )
            return Future.node(done => fs.writeFile(
              path.resolve(path.join(neutrino.options.output, 'README.md')),
              substituteAssets,
              done
            ))
          })

          // Run publish
          .chain(() => {
            console.log()
            console.log(`Publishing version ${packageJson.version} to npm ${isNextRelease ? '(@next release) ' : ''}...`)

            const command = isNextRelease
              ? `npm publish --tag next`
              : `npm publish`

            return Future.node(done =>
              child_process.exec(
                command,
                { cwd: neutrino.options.output },
                done
              )
            )
          })
      })
    }
  ]
};
