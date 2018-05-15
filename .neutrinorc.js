const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const Future = require('fluture')
const R = require('ramda')

const assetsDirectory = 'https://github.com/b-gran/fast-keys/raw/master/assets'
const readme = 'README.md'
const license ='LICENSE'
const typeDefs = 'index.d.ts'

function rootDir (name) {
  return path.join(__dirname, name)
}

const getOutputForNeutrino = R.curry(
  (neutrino, name) => path.resolve(path.join(neutrino.options.output, name))
)

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
        const outputDir = getOutputForNeutrino(neutrino)

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

          // Copy type defs
          .chain(() => copyWith(
            rootDir(typeDefs),
            outputDir(typeDefs)
          ))

          // Copy LICENSE
          .chain(() => copyWith(
            rootDir(license),
            outputDir(license)
          ))

          // Copy README to build & substitute assets
          .chain(() => copyWith(
            rootDir(readme),
            outputDir(readme),
            content => content.toString().replace(
              /\(assets\/([\w\-_.]+)\)/,
              `(${assetsDirectory}/$1)`
            )
          ))

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
}

function copyWith (from, to, transform = R.identity) {
  return Future.node(done => fs.readFile(from, done))
    .chain(contents => Future.node(done => fs.writeFile(
      to,
      transform(contents),
      done
    )))
}
