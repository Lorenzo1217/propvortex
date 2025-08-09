'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, DollarSign } from 'lucide-react'

interface BudgetItem {
  id: string
  description: string
  type: 'change_order' | 'adjustment' | 'savings' | 'overrun'
  amount: string
  status: 'pending' | 'approved' | 'submitted'
}

interface BudgetChangeOrdersProps {
  name: string
  items?: BudgetItem[]
}

const getStatusDotColor = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'approved': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'submitted': return 'bg-blue-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

export function BudgetChangeOrders({ name, items: initialItems = [] }: BudgetChangeOrdersProps) {
  const [items, setItems] = useState<BudgetItem[]>(initialItems)

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      description: '', 
      type: 'change_order',
      amount: '',
      status: 'pending'
    }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof BudgetItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Budget & Change Orders
            </CardTitle>
            <CardDescription className="mt-1">
              Track change orders, budget adjustments, and cost variations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6 space-y-4">
        <input type="hidden" name={name} value={JSON.stringify(items)} />
        
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No budget updates or change orders this week
          </p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`${name}-desc-${item.id}`}>Item {index + 1}</Label>
                    <Input
                      id={`${name}-desc-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="e.g., Additional waterproofing for basement"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`${name}-type-${item.id}`}>Type</Label>
                      <select
                        id={`${name}-type-${item.id}`}
                        value={item.type}
                        onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="change_order">Change Order</option>
                        <option value="adjustment">Budget Adjustment</option>
                        <option value="savings">Cost Savings</option>
                        <option value="overrun">Cost Overrun</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${name}-amount-${item.id}`}>Amount ($)</Label>
                      <Input
                        id={`${name}-amount-${item.id}`}
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`${name}-status-${item.id}`}>Status</Label>
                      <select
                        id={`${name}-status-${item.id}`}
                        value={item.status}
                        onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>
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
          Add Budget Item
        </Button>
      </CardContent>
    </Card>
  )
}