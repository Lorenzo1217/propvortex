'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PhotoTagSelector } from '@/components/photo-tag-selector'
import { Search, X, Filter, RotateCcw } from 'lucide-react'
import { getTagColor } from '@/config/photo-tags'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface PhotoSearchBarProps {
  onSearch: (searchTerm: string, tags: string[]) => void
  placeholder?: string
  className?: string
}

export function PhotoSearchBar({ 
  onSearch, 
  placeholder = "Search photos...",
  className = ""
}: PhotoSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, selectedTags)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedTags, onSearch])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedTags([])
    onSearch('', [])
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const hasActiveFilters = searchTerm || selectedTags.length > 0

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`relative ${selectedTags.length > 0 ? 'border-blue-500' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Tags
              {selectedTags.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filter by Tags</h3>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                  >
                    Clear tags
                  </Button>
                )}
              </div>
              <PhotoTagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select tags to filter..."
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-gray-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              <span>{searchTerm}</span>
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className={`${getTagColor(tag)} border flex items-center gap-1`}
            >
              <span className="text-xs">{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}