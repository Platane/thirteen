const parseGithub = url => {
  {
    const res = url.match(/github\.com\/([\w_-]+)(\/[\w_-]+)?/)

    if (res) {
      const [_, login, repositoryName] = res

      return {
        login,
        repository: repositoryName ? login + repositoryName : undefined,
      }
    }
  }

  {
    const res = url.match(/([\w_-]+)\.github\.io(\/[\w_-]+)?/)

    if (res) {
      const [_, login, repositoryName] = res

      return {
        login,
        repository: repositoryName ? login + repositoryName : undefined,
      }
    }
  }

  return {}
}

const parseTwitter = url => {
  const [_, login] = url.match(/twitter\.com\/([^\/]+)/) || []

  return { login }
}

const parseCategories = text => {
  const categories = text
    .split(':')[1]
    .split(',')
    .map(x => x.toLowerCase().trim())

  // for 2012
  if (categories.length === 1 && categories[0] === 'all') return ['desktop']

  return categories
}

export const parseEntry = document => {
  const content = document.querySelector('.content')

  const entry = {
    title: content.querySelector('.info h2').innerHTML,

    description: Array.from(content.querySelectorAll('.description p'))
      .map(p => p.innerHTML)
      .filter(Boolean)
      .join('\n')
      .replace(/<br>/g, '\n'),

    categories: parseCategories(
      content.querySelector('.description strong').innerHTML
    ),
  }

  const author = {
    name: content.querySelector('.info h3').innerHTML,
  }

  entry.authors = [author]

  Array.from(content.querySelectorAll('.info ul > li')).forEach(li => {
    switch (li.className) {
      case 'twitter':
        author.twitter = parseTwitter(li.querySelector('a').href).login
        break
      case 'website':
        author.website = li.querySelector('a').href
        break
      case 'github':
        const { login, repository } = parseGithub(li.querySelector('a').href)

        entry.github_repository = repository
        author.github = login
        break
    }
  })

  return entry
}
