import test from 'tape'
import { validateManifestSchema } from '../index'

test('manifest.json schema validation ', async t => {
  t.assert(
    !validateManifestSchema({
      title: 'asdas',
      description: 'asdas asd asd',
      categories: [],
      github_repository: 'a/one',
      authors: [{ github: 'a' }],
      images: { big: 'xx', small: 'xx' },
    }).error,
    'should not fail on valid schema'
  )

  t.assert(
    !validateManifestSchema({
      title: 'asdas',
      description: 'asdas asd asd',
      categories: [],
      github_repository: 'a/one',
      bundle_path: './bundle.zip',
      bundle_index: './index.html',
      authors: [{ github: 'a' }],
      images: { big: 'xx', small: 'xx' },
    }).error,
    'should not fail on valid schema'
  )

  t.assert(
    validateManifestSchema({
      description: 'asdas asd asd',
      categories: [],
      github_repository: 'a/one',
      authors: [{ github: 'a' }],
      images: { big: 'xx', small: 'xx' },
    }).error,
    'should fail if title is undefiend'
  )

  t.end()
})
