'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Users } from 'lucide-react'

interface ClientActionItem {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'approval' | 'selection' | 'information' | 'meeting'
  status: 'pending' | 'completed'
  dueDate?: string
}

interface ClientActionsProps {
  name: string
  items?: ClientActionItem[]
}

export function ClientActions({ name, items: initialItems = [] }: ClientActionsProps) {
  const [items, setItems] = useState<ClientActionItem[]>(initialItems)

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      description: '', 
      priority: 'medium',
      category: 'approval',
      status: 'pending',
      dueDate: ''
    }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof ClientActionItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Client Actions Required
            </CardTitle>
            <CardDescription className="mt-1">
              Decisions, approvals, and information needed from the client
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6 space-y-4">
        <input type="hidden" name={name} value={JSON.stringify(items)} />
        
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No client actions required at this time
          </p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`${name}-desc-${item.id}`}>Action Item {index + 1}</Label>
                    <Textarea
                      id={`${name}-desc-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="e.g., Review and approve master bathroom tile selection"
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`${name}-priority-${item.id}`}>Priority</Label>
                      <select
                        id={`${name}-priority-${item.id}`}
                        value={item.priority}
                        onChange={(e) => updateItem(item.id, 'priority', e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="high">🔴 High Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="low">🔵 Low Priority</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${name}-category-${item.id}`}>Category</Label>
                      <select
                        id={`${name}-category-${item.id}`}
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="approval">Approval Needed</option>
                        <option value="selection">Selection Required</option>
                        <option value="information">Information Needed</option>
                        <option value="meeting">Meeting Request</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`${name}-due-${item.id}`}>Due Date</Label>
                    <Input
                      id={`${name}-due-${item.id}`}
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => updateItem(item.id, 'dueDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
        
        <Button type="button" variant="outline" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Client Action
        </Button>
      </CardContent>
    </Card>
  )
}