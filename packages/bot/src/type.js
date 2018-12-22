export type Repo = {
  name: string,
  full_name: string,
  git_url: string,
  ssh_url: string,
  owner: User,
}
export type Commit = {
  sha: string,
  repo: Repo,
}

export type User = {
  login: string,
  id: number,
}

export type Label = {
  id: number,
  name: string,
}

export type PullRequest = {
  id: number,
  labels: Label[],
  state: 'closed' | 'open',
  title: string,
  head: Commit,
  base: Commit,
}

export type Action = 'closed' | 'unlabeled' | 'labeled' | any

export type Event = {
  action: Action,
  number: number,
  pull_request: PullRequest,
  labels: Label[],
  sender: User,
  repository: Repo,
  installation: {
    id: string,
  },
}

export type File = {
  sha: string,
  filename: string,
  status: 'added' | any,
  blob_url: string,
  raw_url: string,
}
