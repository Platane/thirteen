export { event } from './__fixtures__/mal-placed'

export const label = 'test mal placed'

export const check = t => res =>
  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )
