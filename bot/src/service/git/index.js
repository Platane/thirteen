const util = require('util')
const exec = util.promisify(require('child_process').exec)
const git = require('lambda-git')()

export const gitCommand = async (
  args,
  options = {
    cwd: '.',
  }
) => {
  await git

  const { stdout, stderr } = await exec(`git ${args}`, options)

  return stdout
}
