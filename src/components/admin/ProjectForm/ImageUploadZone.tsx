import { useCallback, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, ImagePlus } from 'lucide-react'

export interface ImageItem {
  id: string // DB row id for saved, crypto.randomUUID() for pending
  type: 'saved' | 'pending'
  preview: string // signed URL for saved, object URL for pending
  file?: File // only present for pending images
  sort_order: number
  storagePath?: string // only for saved images (for deletion)
}

interface IImageUploadZoneProps {
  items: ImageItem[]
  onChange: (items: ImageItem[]) => void
  onDeleteSaved: (id: string, storagePath: string) => void
}

function SortableImageCard({
  item,
  isThumbnail,
  onRemove,
}: Readonly<{
  item: ImageItem
  isThumbnail: boolean
  onRemove: () => void
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-video w-40 cursor-grab overflow-hidden rounded-md border"
    >
      <img src={item.preview} alt="" className="h-full w-full object-cover" />
      {isThumbnail && (
        <span className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
          Thumbnail
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="hover:bg-destructive absolute top-1 right-1 rounded-full bg-black/70 p-0.5 text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export function ImageUploadZone({
  items,
  onChange,
  onDeleteSaved,
}: Readonly<IImageUploadZoneProps>) {
  const objectUrlsRef = useRef<Set<string>>(new Set())
  // Own ref so we can call .click() directly — more reliable than react-dropzone's
  // internal open() which can be blocked when the input has display:none
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: ImageItem[] = acceptedFiles.map((file, i) => {
        const preview = URL.createObjectURL(file)
        objectUrlsRef.current.add(preview)
        return {
          id: crypto.randomUUID(),
          type: 'pending',
          preview,
          file,
          sort_order: items.length + i,
        }
      })
      onChange([...items, ...newItems])
    },
    [items, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    noClick: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      sort_order: idx,
    }))
    onChange(reordered)
  }

  const handleRemove = (item: ImageItem) => {
    if (item.type === 'pending') {
      URL.revokeObjectURL(item.preview)
      objectUrlsRef.current.delete(item.preview)
      onChange(
        items
          .filter((i) => i.id !== item.id)
          .map((i, idx) => ({ ...i, sort_order: idx }))
      )
    } else {
      onDeleteSaved(item.id, item.storagePath ?? '')
    }
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-3">
              {items.map((item, idx) => (
                <SortableImageCard
                  key={item.id}
                  item={item}
                  isThumbnail={idx === 0}
                  onRemove={() => handleRemove(item)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div
        {...getRootProps()}
        onClick={(e) => {
          e.stopPropagation()
          requestAnimationFrame(() => fileInputRef.current?.click())
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <ImagePlus className="text-muted-foreground h-6 w-6" />
        <p className="text-muted-foreground text-sm">
          {isDragActive
            ? 'Drop images here'
            : 'Drag & drop or click to add images'}
        </p>
      </div>
    </div>
  )
}
