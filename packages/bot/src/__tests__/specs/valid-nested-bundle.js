export { event } from './__fixtures__/valid-nested-bundle'

export const label = 'test valid with nested bundle'

export const check = t => res => {
  t.assert(
    res.checks.every(({ result }) => result === 'success'),
    'all checks should be green'
  )
}
