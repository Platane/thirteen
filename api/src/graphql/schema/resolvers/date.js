import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const Date = new GraphQLScalarType({
  name: 'Date',
  description:
    'Date as timestamp in ms, define a date ( /!\\ not a date+time )',
  parseValue(value) {
    return new Date(value).getTime() // value from the client
  },
  serialize(value) {
    return new Date(value).getTime() // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10) // ast value is always in string format
    }
    return null
  },
})
