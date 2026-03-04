import { useState, type KeyboardEvent } from 'react'
import { Controller, type Control } from 'react-hook-form'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ProjectFormData } from './projectForm.schema'

interface ITechStackInputProps {
  control: Control<ProjectFormData>
}

export function TechStackInput({ control }: ITechStackInputProps) {
  const [inputValue, setInputValue] = useState('')

  return (
    <Controller
      name="tech_stack"
      control={control}
      render={({ field }) => {
        const tags: string[] = field.value ?? []

        const addTag = () => {
          const trimmed = inputValue.trim()
          if (trimmed && !tags.includes(trimmed)) {
            field.onChange([...tags, trimmed])
          }
          setInputValue('')
        }

        const removeTag = (tag: string) => {
          field.onChange(tags.filter((t) => t !== tag))
        }

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
          } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1])
          }
        }

        return (
          <div className="border-input focus-within:ring-ring flex flex-wrap gap-2 rounded-md border px-3 py-2 focus-within:ring-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary flex items-center gap-1 rounded px-2 py-0.5 text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addTag}
              placeholder={
                tags.length === 0 ? 'Add technology, press Enter...' : ''
              }
              className="h-auto min-w-32 flex-1 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        )
      }}
    />
  )
}
