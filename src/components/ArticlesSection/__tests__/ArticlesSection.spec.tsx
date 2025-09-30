import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import type { Article } from '@/lib/types/articles'
import { ArticlesSection } from '../ArticlesSection'

describe('Arcticles Section', () => {
  const mockArticles: Article[] = [
    {
      id: '123',
      title: 'test article',
      cover_image: 'url://image.com',
      published_at: '22-02-2003',
      description: 'Bla bla bla bla bla',
      url: 'url://article.com',
    },
  ]
  const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }))

  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.mock('@/components/ui/carousel', () => ({
    Carousel: 'div',
    CarouselItem: 'div',
    CarouselContent: 'div',
    CarouselNext: 'div',
    CarouselPrevious: 'div',
  }))
  it('Should render a list of articles', () => {
    render(<ArticlesSection articles={mockArticles} />)
    const titles = screen.getAllByTestId('articles-titles')

    titles.forEach((title) => {
      expect(title).toHaveTextContent('test article')
    })
  })
  it('Should render title with reticence when the title is too large', () => {
    render(
      <ArticlesSection
        articles={[
          {
            ...mockArticles[1],
            title: 'this title is too big to be rendered without reticence',
          },
        ]}
      />
    )

    expect(
      screen.getByText('this title is too big to be rendered wit...')
    ).toBeInTheDocument()
  })
})
