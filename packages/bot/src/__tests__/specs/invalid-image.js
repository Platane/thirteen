export { event } from './__fixtures__/invalid-image'

export const label = 'test invalid image'

export const check = t => res => {
  const check = res.checks.find(({ key }) => key === 'valid-images')

  t.equal(check.result, 'failure', 'valid-images check should fail')
}
