export const safeJSONparse = x => {
  try {
    return JSON.parse(x)
  } catch (err) {
    return null
  }
}
