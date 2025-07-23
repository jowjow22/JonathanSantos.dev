'use server'

import { env } from '@/lib/env'
import { Article } from '@/lib/types/articles'

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch('https://dev.to/api/articles/me/published', {
    headers: {
      'api-key': env.DEV_API_KEY || '',
    },
    next: {
      revalidate: 3600 * 24, // 24 hours
    }
  })

  return res.json()
}
