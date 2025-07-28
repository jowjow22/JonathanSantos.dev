import { env } from '@/lib/env'
import { type Article } from '@/lib/types/articles'

export async function fetchArticles(callback: (articles: Article[]) => void): Promise<Article[]> {
  const res = await fetch('/dev-api/articles/me/published', {
    headers: {
      'api-key': env.VITE_DEV_API_KEY || '',
    },
  })

  const articles = await res.json()
  callback(articles)
  return articles
}