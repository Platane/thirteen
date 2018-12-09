const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-export-namespace-from',
  [
    'transform-inline-environment-variables',
    {
      include: [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_DEFAULT_REGION',

        'GITHUB_APP_ID',
        'GITHUB_APP_PRIVATE_KEY',

        'BROWSER_STACK_USER',
        'BROWSER_STACK_KEY',
      ],
    },
  ],
]

const presets = [
  //
  '@babel/preset-flow',
]

if (process.env.BABEL_ENV === 'node') {
  plugins.push('@babel/plugin-transform-modules-commonjs')
}

module.exports = { plugins, presets }
