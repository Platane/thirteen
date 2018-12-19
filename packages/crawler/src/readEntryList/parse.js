export const parseEntryList = (editionSlug, document) =>
  Array.from(document.querySelectorAll('article.entry')).map(entry => {
    const { href } = entry.querySelector('a')

    const [_, slug] = href && href.match(/entries\/([^\/]+)/)

    return editionSlug + '/' + slug
  })
