module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/library',
      {
        name: 'fast-keys'
      }
    ],
    '@neutrinojs/jest'
  ]
};
