import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export const readHtmlPage = url =>
  fetch(url)
    .then(x => x.text())
    .then(page => new JSDOM(page).window.document)
