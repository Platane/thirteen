// @flow

const core = {
  presets: ['@babel/preset-flow', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'transform-inline-environment-variables',
      {
        include: [
          'APP_BASENAME',
          'GRAPHQL_ENDPOINT',
          'STATIC_ENDPOINT',
          'APP_ORIGIN',
        ],
      },
    ],
    [
      'transform-assets-import-to-string',
      {
        extensions: ['.graphql'],
      },
    ],
  ],
}

module.exports = api => {
  /**
   * cache the config with this key
   */
  if (api)
    api.cache.invalidate(() =>
      [process.env.NODE_ENV, process.env.BABEL_ENV].join('-')
    )

  switch (process.env.BABEL_ENV) {
    case 'web':
      return {
        presets: [...core.presets],
        plugins: [...core.plugins],
      }
    case 'node':
      return {
        presets: [...core.presets],
        plugins: [...core.plugins, '@babel/plugin-transform-modules-commonjs'],
      }

    default:
      return core
  }
}

// [
//   '@babel/plugin-transform-runtime',
//   {
//     helpers: false,
//     regenerator: true
//   }
// ]
//
// [
//   '@babel/preset-env',
//   {
//     modules: false,
//     targets: {
//       chrome: '67',
//       chromeAndroid: '67',
//       firefox: '61',
//       ie: '11',
//       edge: '17',
//       safari: '11.1',
//       iOS: '11.4'
//     }
//   }
// ]
