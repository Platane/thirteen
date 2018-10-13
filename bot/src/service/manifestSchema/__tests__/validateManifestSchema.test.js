import test from 'tape'
import { validateManifestSchema } from '../index'

test('manifest.json schema validation ', async t => {
  t.assert(
    !validateManifestSchema({
      title: 'asdas',
      description: 'asdas asd asd',
      github_repository: 'a/one',
      authors: [{ github: 'a' }],
    }).error,
    'should not fail on valid schema'
  )

  t.assert(
    !validateManifestSchema({
      title: 'asdas',
      description: 'asdas asd asd',
      github_repository: 'a/one',
      authors: [{ github: 'a' }],
      bundle_path: './bundle.zip',
      bundle_index: './index.html',
    }).error,
    'should not fail on valid schema'
  )

  t.assert(
    !validateManifestSchema(
      {
        title: 'asdas',
        description: 'asdas asd asd',
        github_repository: 'a/one',
      },
      { github_user_login: 'a' }
    ).error,
    'should not fail if authors is null'
  )

  t.assert(
    validateManifestSchema(
      {
        description: 'asdas asd asd',
        github_repository: 'a/one',
      },
      { github_user_login: 'a' }
    ).error,
    'should fail if title is undefiend'
  )

  t.end()
})
