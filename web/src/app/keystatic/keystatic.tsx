'use client'

import { makePage } from '@keystatic/next/ui/app'
import localConfig from '../../../keystatic.config'
import githubConfig from '../../../keystatic.config.github'

// Use GitHub config in production for Admin UI
const config = process.env.NODE_ENV === 'production' ? githubConfig : localConfig

export default makePage(config)
