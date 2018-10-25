import { makeExecutableSchema } from 'graphql-tools'
import path from 'path'
import fs from 'fs'

import * as resolvers from './resolvers'

const Mutation = {}

const typeDefs = fs
  .readdirSync(path.resolve(__dirname, 'document'))
  .map(filename =>
    fs.readFileSync(path.resolve(__dirname, 'document', filename)).toString()
  )
  .join('\n')

// console.log(typeDefs)
// console.log(resolvers)

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
