export { event } from './__fixtures__/github-repository-not-found'

export const label = 'test github repository'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'source-repositoy')

  t.equal(check.result, 'failure', 'source-repositoy check should fail')
}
