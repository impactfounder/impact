import { makeRouteHandler } from '@keystatic/next/route-handler'
import localConfig from '../../../../../keystatic.config'
import githubConfig from '../../../../../keystatic.config.github'

// Use GitHub config in production for Admin UI, local config otherwise
const config = process.env.NODE_ENV === 'production' ? githubConfig : localConfig

export const { POST, GET } = makeRouteHandler({
  config,
})
