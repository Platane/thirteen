export { event } from './__fixtures__/valid'

export const label = 'test valid'

export const check = t => res => {
  t.assert(
    res.checks.every(({ result }) => result === 'success'),
    'all checks should be green'
  )
}
