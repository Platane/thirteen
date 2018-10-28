export const createReportRuns = async (github, pr, checkNames) => {
  const runIds = {}

  /**
   * create the check, as queued
   */
  await Promise.all(
    checkNames.map(({ key, title }) =>
      github.checks
        .create({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          name: title,
          head_sha: pr.head.sha,
          status: 'queued',
        })
        .then(({ data: { id } }) => (runIds[key] = id))
    )
  )

  /**
   * update the checks
   */
  return checks =>
    Promise.all(
      checks.map(({ key, title, description, result: conclusion, detail }) =>
        github.checks.update({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          check_run_id: runIds[key],
          completed_at: new Date().toISOString(),
          status: 'completed',
          conclusion,
          output: {
            title,
            summary: `__${description || ''}__\n\n${detail || ''}`,
          },
        })
      )
    )
}
