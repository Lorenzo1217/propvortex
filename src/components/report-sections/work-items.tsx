'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Hammer } from 'lucide-react'

interface WorkItem {
  id: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

interface WorkItemsProps {
  name: string
  title: string
  description: string
  placeholder: string
  showImpact?: boolean
  items?: WorkItem[]
}

export function WorkItems({ 
  name, 
  title, 
  description, 
  placeholder, 
  showImpact = true,
  items: initialItems = [] 
}: WorkItemsProps) {
  const [items, setItems] = useState<WorkItem[]>(
    initialItems.length > 0 ? initialItems : [{ id: '1', description: '', impact: 'medium' }]
  )

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      description: '', 
      impact: 'medium' 
    }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof WorkItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Hammer className="h-5 w-5 text-gray-700" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input type="hidden" name={name} value={JSON.stringify(items)} />
        
        {items.map((item, index) => (
          <div key={item.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor={`${name}-${item.id}`}>Item {index + 1}</Label>
                  <Input
                    id={`${name}-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder={placeholder}
                    className="mt-1"
                  />
                </div>
                
                {showImpact && (
                  <div>
                    <Label htmlFor={`${name}-impact-${item.id}`}>Impact</Label>
                    <select
                      id={`${name}-impact-${item.id}`}
                      value={item.impact}
                      onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="high">🔴 Critical Impact</option>
                      <option value="medium">🟡 Moderate Impact</option>
                      <option value="low">🔵 Minor Impact</option>
                    </select>
                  </div>
                )}
              </div>
              
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <Button type="button" variant="outline" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  )
}