import { validateManifestSchema } from '../../service/manifestSchema'

export const key = 'valid-manifest'
export const title = 'Valid Manifest'
export const description = 'Should contains a valid manifest.json'
export const check = ({ manifest, config }) => {
  if (!manifest)
    return { result: 'failure', detail: 'Could not find a valid json file' }

  const { error } = validateManifestSchema(manifest, {
    categories: config.categories,
  })

  if (error)
    return {
      result: 'failure',
      detail: error.details
        .map(({ message, path }) => `- ${message}   at [${path.join(', ')}]`)
        .join('\n'),
    }

  return true
}
