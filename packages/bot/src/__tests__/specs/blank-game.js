export { event } from './__fixtures__/blank-game'

export const label = 'test blank game'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'game-run')

  t.equal(check.result, 'failure', 'game-run check should fail')
}
