export const event = {
  resource: '/webhook',
  path: '/webhook',
  httpMethod: 'POST',
  headers: {
    'X-GitHub-Event': 'check_suite',
  },
  body: JSON.stringify({
    action: 'rerequested',
    check_suite: {
      pull_requests: [
        {
          url: 'https://api.github.com/repos/Platane/thirteen-sandbox/pulls/14',
          number: 14,
        },
      ],
    },
    repository: {
      name: 'thirteen-sandbox',
      full_name: 'Platane/thirteen-sandbox',
      owner: {
        login: 'Platane',
      },
    },
    installation: {
      id: 370763,
    },
  }),
}
