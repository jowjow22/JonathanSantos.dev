'use client'

import {
  ReactElement,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Tag } from '../Tag/Tag'

interface ITagGroupProps {
  children: ReactElement | ReactElement[]
}

export const TagGroup = ({ children }: ITagGroupProps) => {
  const [visibleTags, setVisibleTags] = useState<ReactElement[]>([])
  const [hiddenCount, setHiddenCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<(HTMLDivElement | null)[]>([])

  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  )

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.clientWidth
      let currentWidth = 0
      let visibleCount = 0

      tagsRef.current = tagsRef.current.slice(0, childrenArray.length)

      for (let i = 0; i < tagsRef.current.length; i++) {
        const tagElement = tagsRef.current[i]
        if (!tagElement) continue

        const tagWidth = tagElement.offsetWidth
        const reservedSpace = i < childrenArray.length - 1 ? 70 : 0

        if (currentWidth + tagWidth + reservedSpace <= containerWidth) {
          currentWidth += tagWidth
          visibleCount++
        } else {
          break
        }
      }

      setVisibleTags(childrenArray.slice(0, visibleCount))
      setHiddenCount(childrenArray.length - visibleCount)
    }

    calculateVisibleTags()
    window.addEventListener('resize', calculateVisibleTags)

    return () => {
      window.removeEventListener('resize', calculateVisibleTags)
    }
  }, [childrenArray])

  return (
    <div ref={containerRef} className="flex gap-2 w-full">
      {childrenArray.map((tag, index) => (
        <div
          key={index}
          ref={(el) => {
            tagsRef.current[index] = el
          }}
          className={
            index >= visibleTags.length ? 'absolute -left-full' : 'relative'
          }
        >
          {cloneElement(tag)}
        </div>
      ))}

      {hiddenCount > 0 && (
        <Tag text={`+${hiddenCount}`} color="var(--color-indigo-600)" />
      )}
    </div>
  )
}
