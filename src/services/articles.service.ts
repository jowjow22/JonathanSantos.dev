import { type Article } from '@/lib/types/articles'

export async function fetchArticles(
  callback: (articles: Article[]) => void
): Promise<Article[]> {
  try {
    const res = await fetch('https://dev.to/api/articles?username=jow')

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`)
    }

    const articles = await res.json()
    callback(articles)
    return articles
  } catch (error) {
    console.error('Failed to fetch articles:', error)

    const fallbackArticles: Article[] = []
    callback(fallbackArticles)
    return fallbackArticles
  }
}
