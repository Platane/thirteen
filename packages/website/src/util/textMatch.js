const normalize = text => text.toLowerCase()

const textEqual = (a, b) => (a === b ? 1 : 0)
const textPrefix = (a, b) => (a.startsWith(b) ? 1 : 0)

export const textMatch = (pattern, text) => {
  const patternW = normalize(pattern)
    .split(' ')
    .filter(Boolean)
  const textW = normalize(text)
    .split(' ')
    .filter(Boolean)

  const firsts = patternW.slice(0, patternW.length - 1)
  const last = patternW[patternW.length - 1]

  const score =
    firsts.reduce(
      (sum, p) => sum + Math.max(...textW.map(t => textEqual(t, p))),
      0
    ) + Math.max(...textW.map(t => textPrefix(t, last)))

  return score / patternW.length > 0.99
}
