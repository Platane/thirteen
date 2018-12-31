export { event } from './__fixtures__/game-error'

export const label = 'test game error'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'game-run')

  t.equal(check.result, 'failure', 'game-run check should fail')
}
