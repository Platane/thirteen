import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'
import { handler as handler_ } from './index'

export const withLambda = (fn: APIGatewayEvent => *) => async (
  e: APIGatewayEvent
): Promise<ProxyResult> => ({
  statusCode: 200,
  body: JSON.stringify(await fn(e)),
  headers: { 'Content-Type': 'application/json' },
})

export const handler = withLambda(handler_)
