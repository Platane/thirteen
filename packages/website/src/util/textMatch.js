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

  const completeW = patternW.slice(0, patternW.length - 1)
  let partialW = patternW[patternW.length - 1]

  if (pattern[pattern.length - 1] === ' ') {
    completeW.push(partialW)
    partialW = null
  }

  const score =
    completeW.reduce(
      (sum, p) => sum + Math.max(...textW.map(t => textEqual(t, p))),
      0
    ) + (partialW ? Math.max(...textW.map(t => textPrefix(t, partialW))) : 0)

  return score / patternW.length > 0.99
}
