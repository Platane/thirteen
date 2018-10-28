import path from 'path'

const checks = [
  require('./checks/valid-manifest'),
  require('./checks/file-structure'),
  require('./checks/bundle-size'),
  require('./checks/valid-images'),
]

type Check = {
  result: 'success' | 'failure' | 'neutral',
  title: string,
  detail: string,
}

type Result = Check[]

export const analyzeSubmission = ctx =>
  Promise.all(
    checks.map(async ({ check, ...c }) => {
      let res = await check(ctx)

      if (typeof res === 'string') res = { result: res }
      if (!res || typeof res === 'boolean')
        res = { result: res ? 'success' : 'failure' }

      return { ...c, ...res }
    })
  )

export const checkNames = checks.map(({ check, ...x }) => x)
