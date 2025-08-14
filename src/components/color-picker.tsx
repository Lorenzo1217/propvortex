'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

const presetColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Rose', value: '#F43F5E' },
]

export function ColorPicker({ id, label, value, onChange, description }: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || newValue === '#' || /^#[0-9A-Fa-f]{1,5}$/.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          <Palette className="w-3 h-3 mr-1" />
          {showPresets ? 'Hide' : 'Show'} Presets
        </Button>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
            style={{ backgroundColor: value }}
          />
          <div 
            className="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"
            style={{ backgroundColor: value }}
          />
        </div>
        
        <Input
          id={id}
          type="text"
          value={value}
          onChange={handleColorChange}
          placeholder="#000000"
          className="flex-1 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>

      {showPresets && (
        <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {presetColors.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className="group relative"
              title={preset.name}
            >
              <div 
                className={`w-full h-8 rounded-md border-2 transition-all ${
                  value === preset.value 
                    ? 'border-blue-500 shadow-lg scale-110' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }`}
                style={{ backgroundColor: preset.value }}
              />
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-500">Preview:</span>
        <div className="flex items-center space-x-2 flex-1">
          <div 
            className="w-full h-8 rounded-md border border-gray-300"
            style={{ backgroundColor: value }}
          />
        </div>
      </div>
    </div>
  )
}