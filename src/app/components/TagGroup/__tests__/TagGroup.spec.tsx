import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tag } from '../../Tag/Tag'
import { TagGroup } from '../TagGroup'

describe('TagGroup component', () => {
  it('renders single tag correctly', () => {
    render(
      <TagGroup>
        <Tag text="Test Tag" color="#000000" />
      </TagGroup>
    )
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  it('renders multiple tags correctly', () => {
    render(
      <TagGroup>
        <Tag text="Tag 1" color="#000000" />
        <Tag text="Tag 2" color="#000000" />
        <Tag text="Tag 3" color="#000000" />
      </TagGroup>
    )
    expect(screen.getByText('Tag 1')).toBeInTheDocument()
    expect(screen.getByText('Tag 2')).toBeInTheDocument()
    expect(screen.getByText('Tag 3')).toBeInTheDocument()
  })

  it('shows hidden count tag when tags overflow container', () => {
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth'
    )
    const originalClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth'
    )

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200,
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    })

    render(
      <TagGroup>
        <Tag text="Tag 1" color="#000000" />
        <Tag text="Tag 2" color="#000000" />
        <Tag text="Tag 3" color="#000000" />
        <Tag text="Tag 4" color="#000000" />
      </TagGroup>
    )

    expect(screen.getByText('+3')).toBeInTheDocument()

    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetWidth',
        originalOffsetWidth
      )
    }
    if (originalClientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'clientWidth',
        originalClientWidth
      )
    }
  })

  it('renders no hidden count when all tags fit', () => {
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth'
    )
    const originalClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth'
    )

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    })

    render(
      <TagGroup>
        <Tag text="Tag 1" color="#000000" />
        <Tag text="Tag 2" color="#000000" />
        <Tag text="Tag 3" color="#000000" />
      </TagGroup>
    )

    const hiddenCountElements = screen.queryByText(/\+\d+/)
    expect(hiddenCountElements).not.toBeInTheDocument()

    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidth!
    )
    Object.defineProperty(
      HTMLElement.prototype,
      'clientWidth',
      originalClientWidth!
    )
  })
})
