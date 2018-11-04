// @flow

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

type Props = {
  css: string,
  html: string,
  inlineScript: string,
  metaProperties: (
    | { name: string, content: string }
    | { property: string, content: string }
  )[],
  scripts: string[],
  styles: string[],
}

const Html = ({
  html,
  css,
  metaProperties,
  title,
  inlineScript,
  scripts,
  styles,
}: Props) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {title && <title>{title}</title>}
      {metaProperties.map(({ name, property, content }) => (
        <meta
          key={name || property}
          name={name}
          property={property}
          content={content}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {styles.map(s => (
        <link key={s} rel="stylesheet" type="text/css" href={s} />
      ))}
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: html }} />
      <script
        type="application/javascript"
        dangerouslySetInnerHTML={{
          __html: inlineScript,
        }}
      />
      {scripts.map(s => (
        <script key={s} type="application/javascript" src={s} />
      ))}
    </body>
  </html>
)

export const renderToHtml = (props: Props) =>
  `<!doctytpe html>${renderToStaticMarkup(<Html {...props} />)}`
