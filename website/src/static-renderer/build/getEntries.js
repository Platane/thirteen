global.fetch = global.fetch || require('node-fetch')

import { GRAPHQL_ENDPOINT } from '~/config'

export const getEntries = () =>
  fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          editions {
            items {
              slug
              entries {
                items {
                  slug
                }
              }
            }
          }
        }
      `,
    }),
  })
    .then(res => res.json())
    .then(({ data }) => data)
