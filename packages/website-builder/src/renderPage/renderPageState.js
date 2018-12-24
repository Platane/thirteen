import React from 'react'
import { renderToHtml } from './renderToHtml'
import {
  selectMetaTitle,
  selectMetaProperties,
} from '@thirteen/website/src/store/selector'
import { App } from '@thirteen/website/src/component/App'
import stats from '@thirteen/website/.build/stats.json'
import manifest from '@thirteen/website/.build/manifest.json'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { extractCritical } from 'emotion-server'
import serialize from 'serialize-javascript'

import type { State } from '~/store/type'

const getScriptsForEntry = chunkName =>
  (stats.namedChunkGroups[chunkName]
    ? stats.namedChunkGroups[chunkName].assets
    : []
  )
    .filter(f => !f.match(/\.map$/))
    .map(f => stats.publicPath + f)

export const renderPageState = (state: State) => {
  const stubStore = {
    dispatch: () => void 0,
    subscribe: () => void 0,
    getState: () => state,
  }

  const app = (
    <Provider store={stubStore}>
      <App />
    </Provider>
  )

  const { html, css, ids } = extractCritical(renderToString(app))

  const inlineScript = [
    `window._THIRTEEN_EMOTION_IDS=${serialize(ids)};`,
    `window._THIRTEEN_STATE=${serialize(state)};`,
  ].join('')

  return renderToHtml({
    title: selectMetaTitle(state),
    metaProperties: selectMetaProperties(state),
    scripts: getScriptsForEntry('index'),
    styles: [manifest['style.css']].filter(Boolean),
    css,
    html,
    inlineScript,
  })
}
