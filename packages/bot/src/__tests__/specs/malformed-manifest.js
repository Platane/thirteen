export { event } from './__fixtures__/malformed-manifest'

export const label = 'test malformed manifest'

export const check = t => res =>
  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )
