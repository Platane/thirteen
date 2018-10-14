import type { Entry, ID } from '~/type'

export type Action =
  | {
      type: 'safe:get:success',
      safe: Safe,
    }
  | {
      type: 'localStorage:read',
      keys: any | null,
    }
  | {
      type: 'resource:fetcher:start',
      resourceName: string,
      params: Object,
      key: string,
    }
  | {
      type: 'resource:fetcher:success',
      resourceName: string,
      params: Object,
      key: string,
      res: any,
    }
  | {
      type: 'resource:fetcher:failure',
      resourceName: string,
      params: Object,
      key: string,
      err: any,
    }
