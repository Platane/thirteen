/**
 * takes an array of functions that return promises
 * run all the promises in batch
 */
export const parallel = (
  n: number,
  tasks: () => Promise<void>
): Promise<void> =>
  new Promise((resolve, reject) => {
    let l = 0

    const loop = async () => {
      if (l == 0 && tasks.length == 0) return resolve()

      if (l >= n) return

      const next = tasks.shift()

      if (!next) return

      l++

      loop()

      await next().catch(reject)
      l--

      loop()
    }

    loop()
  })
