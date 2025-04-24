'use server'

import { env } from '@/app/env'
export async function fetchArticles() {
  const res = await fetch('https://dev.to/api/articles/me/published', {
    headers: {
      'api-key': env.DEV_API_KEY || '',
    },
  })

  return res.json()
}
