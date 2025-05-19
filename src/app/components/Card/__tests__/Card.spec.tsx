import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('renders with default variant', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    )

    expect(screen.getByText('Header content')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('renders with image_background variant', () => {
    render(
      <Card variant="image_background">
        <Card.Header>Header content</Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    )

    expect(screen.getByText('Header content')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
    expect(screen.getByAltText('Project Title')).toBeInTheDocument()
  })

  it('renders CardHeader with custom image', () => {
    const customImage = {
      src: '/custom-image.png',
      alt: 'Custom image',
    }

    render(
      <Card>
        <Card.Header image={customImage}>Header content</Card.Header>
      </Card>
    )

    const image = screen.getByAltText('Custom image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('custom-image.png')
    )
  })

  it('applies custom className to components', () => {
    render(
      <Card>
        <Card.Header className="custom-header">Header content</Card.Header>
        <Card.Content className="custom-content">Content</Card.Content>
        <Card.Footer className="custom-footer">Footer content</Card.Footer>
      </Card>
    )

    const header = screen.getByTestId('card-header')
    const content = screen.getByTestId('card-content')
    const footer = screen.getByTestId('card-footer')

    expect(header?.className).toContain('custom-header')
    expect(content?.className).toContain('custom-content')
    expect(footer?.className).toContain('custom-footer')
  })

  it('renders default image when no image prop is provided in default variant', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>
    )

    const image = screen.getByAltText('Card image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('sample-project.png')
    )
  })
})
