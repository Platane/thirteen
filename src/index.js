import type { APIGatewayEvent, ProxyResult } from 'flow-aws-lambda'

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
  console.log(event)
}
