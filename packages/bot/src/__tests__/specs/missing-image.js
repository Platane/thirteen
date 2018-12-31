export { event } from './__fixtures__/missing-image'

export const label = 'test missing image'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'valid-images')

  t.equal(check.result, 'failure', 'valid-images check should fail')
}
