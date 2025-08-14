'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  PHOTO_TAGS, 
  TAG_CATEGORIES, 
  getTagColor,
  getTagBadgeColor 
} from '@/config/photo-tags'
import { ChevronDown, X, Tags, Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PhotoTagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
  placeholder?: string
  maxTags?: number
}

export function PhotoTagSelector({ 
  selectedTags, 
  onChange, 
  disabled = false,
  placeholder = "Select tags...",
  maxTags
}: PhotoTagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [open])

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag))
    } else {
      if (!maxTags || selectedTags.length < maxTags) {
        onChange([...selectedTags, tag])
      }
    }
  }

  const removeTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag))
  }

  const clearAll = () => {
    onChange([])
  }

  // Filter tags based on search
  const filterTags = (tags: string[]) => {
    if (!searchQuery) return tags
    return tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const renderTagGroup = (
    category: keyof typeof PHOTO_TAGS, 
    label: string, 
    color: string
  ) => {
    const filteredTags = filterTags(PHOTO_TAGS[category])
    if (filteredTags.length === 0) return null

    return (
      <div key={category} className="space-y-2">
        <div className="px-1 py-1">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {label}
          </h4>
        </div>
        <div className="space-y-1">
          {filteredTags.map(tag => (
            <label
              key={tag}
              className={`flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Checkbox
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
                disabled={disabled || (maxTags !== undefined && selectedTags.length >= maxTags && !selectedTags.includes(tag))}
                className="h-4 w-4"
              />
              <span className="text-sm flex-1">{tag}</span>
              {selectedTags.includes(tag) && (
                <div className={`px-2 py-0.5 rounded-full text-xs ${getTagBadgeColor(tag)}`}>
                  ✓
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Photo Tags
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between text-left font-normal"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Tags className="h-4 w-4 flex-shrink-0 text-gray-500" />
              {selectedTags.length > 0 ? (
                <span className="text-sm">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3"
              />
            </div>
            {maxTags && (
              <p className="text-xs text-gray-500 mt-2">
                Select up to {maxTags} tags ({selectedTags.length}/{maxTags})
              </p>
            )}
          </div>
          
          <ScrollArea className="h-80">
            <div className="p-3 space-y-4">
              {Object.entries(TAG_CATEGORIES).map(([key, { label, color }]) => 
                renderTagGroup(key as keyof typeof PHOTO_TAGS, label, color)
              )}
              
              {/* No results message */}
              {searchQuery && 
                Object.keys(PHOTO_TAGS).every(
                  key => filterTags(PHOTO_TAGS[key as keyof typeof PHOTO_TAGS]).length === 0
                ) && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No tags found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {selectedTags.length > 0 && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="w-full"
              >
                Clear all selections
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className={`${getTagColor(tag)} border flex items-center gap-1 py-1`}
            >
              <span className="text-xs">{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Tags help organize and find photos quickly. Select relevant areas, phases, and features.
      </p>
    </div>
  )
}