export { event } from './__fixtures__/illegal-request'

export const label = 'test illegal request'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'game-run')

  const checkFailed = check.result === 'failure'
  const checkWarning = check.detail.includes('⚠️')

  t.assert(
    checkFailed || checkWarning,
    'game-run check should fail, or at least display a warning'
  )
}
