const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-export-namespace-from',
  'babel-plugin-inline-import',
  [
    'transform-inline-environment-variables',
    {
      include: [
        'PORT',
        'GRAPHQL_ENDPOINT',
        'STATIC_ENDPOINT',
        'APP_BASENAME',
        'APP_ORIGIN',
      ],
    },
  ],
  ['babel-plugin-module-resolver', { alias: { '~': './src' } }],
]

const presets = [
  //
  '@babel/preset-flow',
  '@babel/react',
]

if (process.env.BABEL_ENV === 'node') {
  plugins.push('@babel/plugin-transform-modules-commonjs')
}

module.exports = { plugins, presets }
