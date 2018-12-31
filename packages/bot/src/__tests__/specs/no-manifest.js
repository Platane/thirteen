export { event } from './__fixtures__/no-manifest'

export const label = 'test no manifest'

export const check = t => res =>
  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )
