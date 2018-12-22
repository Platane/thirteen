export const event = {
  body: JSON.stringify({
    action: 'requested',
    check_suite: {
      id: 42385143,
      node_id: 'MDEwOkNoZWNrU3VpdGU0MjM4NTE0Mw==',
      head_branch: 'submission/valid',
      head_sha: '37898472a023ee0194de3cd3cd2b8c9b85a71904',
      status: 'queued',
      conclusion: null,
      before: 'ebc65dc9c41f21558b6f6da3701e781443582812',
      after: '37898472a023ee0194de3cd3cd2b8c9b85a71904',
      pull_requests: [
        {
          url: 'https://api.github.com/repos/Platane/thirteen-sandbox/pulls/8',
          id: 240628421,
          number: 8,
          head: {
            ref: 'submission/valid',
            sha: '37898472a023ee0194de3cd3cd2b8c9b85a71904',
            repo: {
              id: 154995123,
              url: 'https://api.github.com/repos/Platane/thirteen-sandbox',
              name: 'thirteen-sandbox',
            },
          },
          base: {
            ref: 'master',
            sha: '27ec9895870e24f1a1c38f0fded702b6562ba0fb',
            repo: {
              id: 154995123,
              url: 'https://api.github.com/repos/Platane/thirteen-sandbox',
              name: 'thirteen-sandbox',
            },
          },
        },
      ],
      latest_check_runs_count: 0,
      check_runs_url:
        'https://api.github.com/repos/Platane/thirteen-sandbox/check-suites/42385143/check-runs',
      head_commit: {
        id: '37898472a023ee0194de3cd3cd2b8c9b85a71904',
        tree_id: '1e0d447aec6976f1e1481915ae5b2a1464f9ebc1',
        message: 'resize image',
        timestamp: '2018-12-22T16:48:31Z',
        author: {
          name: 'platane',
          email: 'me@platane.me',
        },
        committer: {
          name: 'platane',
          email: 'me@platane.me',
        },
      },
    },
    repository: {
      id: 154995123,
      node_id: 'MDEwOlJlcG9zaXRvcnkxNTQ5OTUxMjM=',
      name: 'thirteen-sandbox',
      full_name: 'Platane/thirteen-sandbox',
      private: false,
      owner: {
        login: 'Platane',
        id: 1659820,
        node_id: 'MDQ6VXNlcjE2NTk4MjA=',
      },
    },
    sender: {
      login: 'Platane',
      id: 1659820,
      node_id: 'MDQ6VXNlcjE2NTk4MjA=',
    },
    installation: {
      id: 370763,
      node_id: 'MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uMzcwNzYz',
    },
  }),
}
