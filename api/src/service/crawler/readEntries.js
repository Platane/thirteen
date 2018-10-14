import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'

const END_POINT = 'http://js13kgames.com'

/**
 * write entries from the js13games website
 */
export const readEntries = async subdirectory => {
  const rawEntries = parseEntryList(
    await readPage(`${END_POINT}/entries/${subdirectory}`)
  )

  const entries = []

  for (let i = 0; i < rawEntries.length; i++) {
    const [_, slug] = rawEntries[i].match(/entries\/([^\/]+)/)

    console.log(subdirectory, `${i}/${rawEntries.length}`, slug)

    const entryUrl = `${END_POINT}${rawEntries[i]}`
    const gameUrl = entryUrl.replace('/entries/', '/games/')

    const entry = parseEntry(await readPage(entryUrl))

    entries.push({
      ...entry,
      slug,
      game_url: gameUrl,
      image: {
        '100x100': gameUrl + '/__small.jpg',
        '400x250': gameUrl + '/__big.jpg',
      },
    })
  }

  return entries
}

const readPage = url =>
  fetch(url)
    .then(x => x.text())
    .then(page => new JSDOM(page).window.document)

const parseEntryList = document =>
  Array.from(document.querySelectorAll('article.entry')).map(
    entry => entry.querySelector('a').href
  )

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

const parseEntry = document => {
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
