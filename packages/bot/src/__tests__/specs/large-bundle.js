export { event } from './__fixtures__/large-bundle'

export const label = 'test large bundle'

export const check = t => res => {
  t.assert(
    !res.checks.every(({ result }) => result === 'success'),
    'at least one test should fail'
  )
}
