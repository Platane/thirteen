import path from 'path'
import fetch from 'node-fetch'
import webdriver from 'selenium-webdriver'
import getPixels from 'get-pixels'
import { promisify } from 'util'
import {
  BROWSER_STACK_USER,
  BROWSER_STACK_KEY,
} from '../../config/browserstack'

export const key = 'game-run'
export const title = 'Run game'
export const description = 'Game should run without major issue'

export const check = async ({ deploy }) => {
  if (!deploy)
    return {
      result: 'failure',
      detail: 'Game not deployed',
    }

  /**
   * prepare browserstack
   */
  const capabilities = {
    os: 'Windows',
    os_version: '10',
    browserName: 'Chrome',
    browser_version: '62.0',
    'browserstack.local': 'false',
    'browserstack.debug': 'true',
    'browserstack.video': 'true',
    'browserstack.networkLogs': 'true',
    'browserstack.seleniumLogs': 'true',
    'browserstack.selenium_version': '3.5.2',
    'browserstack.user': BROWSER_STACK_USER,
    'browserstack.key': BROWSER_STACK_KEY,
  }

  const driver = new webdriver.Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build()

  const session = await driver.getSession()

  /**
   * access the deployed game
   */
  await driver.get(deploy.gameUrl)

  await driver.sleep(300)

  /**
   * take a screenshot
   */
  const base64screenShot = await driver.takeScreenshot()

  /**
   * read the browser log
   */
  const browserLogs = await driver
    .manage()
    .logs()
    .get(webdriver.logging.Type.BROWSER)

  await driver.quit()

  /**
   * read the network log, from browserstack rest api
   */
  const networkLogs = await httpGet(
    `https://api.browserstack.com/automate/sessions/${session.getId()}/networklogs`,
    { user: BROWSER_STACK_USER, password: BROWSER_STACK_KEY }
  )

  /**
   * look for error in the console
   */
  const criticalLogs = browserLogs
    .map(x => x.toJSON())
    .filter(({ level }) => ['SEVERE'].includes(level))
  if (criticalLogs.length > 0)
    return {
      result: 'failure',
      detail: [
        'Some critical error where found in the browser console:',
        ...criticalLogs.map(({ message }) => ` * \`${message}\``),
      ].join('\n'),
    }

  /**
   * check the network log for external resource call
   * ( which is obviously prohibited )
   * ( expect from the favicon.ico, i guess that's ok )
   */
  const externalUrls = networkLogs.log.entries
    .map(({ request }) => request.url)
    .filter(
      url =>
        !url.startsWith(path.dirname(deploy.gameUrl)) &&
        path.basename(url) !== 'favicon.ico'
    )

  if (externalUrls.length > 0)
    return {
      result: 'failure',
      detail: [
        'Game tried to access external resources',
        ...externalUrls.map(url => ` * ${url}`),
      ].join('\n'),
    }

  /**
   * check that the first thing displayed is no a blank page
   */
  const { data } = await promisify(getPixels)(
    'data:image/png;base64,' + base64screenShot
  )

  if (isImageBlank(data))
    return {
      result: 'failure',
      detail: 'Games does not display anything on screen, is it broken ?',
    }

  /**
   * ok
   */
  return {
    result: 'success',
    detail:
      'The game does not required external resources at loading.\nIt does not have critical errors and seens to display a start screen.',
  }
}

/**
 * perform a http get request, with the Authorization header set
 */
const httpGet = (url, { user, password }) =>
  fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(user + ':' + password).toString(
        'base64'
      )}`,
    },
  })
    .then(res => res.text())
    .then(res => {
      try {
        return JSON.parse(res)
      } catch (err) {
        console.log(res)
        throw err
      }
    })

/**
 * return true if the image is filled with only one color
 */
const isImageBlank = data => {
  let err = 0

  for (let i = 0; i < data.length; i += 4) {
    err +=
      Math.abs(data[i + 0] - data[0]) +
      Math.abs(data[i + 1] - data[1]) +
      Math.abs(data[i + 2] - data[2])
  }

  return err === 0
}
