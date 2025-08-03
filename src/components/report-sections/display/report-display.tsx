'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { AlertCircle, CheckCircle2, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface WorkItem {
  id: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

interface IssueItem {
  id: string
  description: string
  risk: 'high' | 'medium' | 'low'
  impact: string
}

interface BudgetItem {
  id: string
  description: string
  type: 'change_order' | 'adjustment' | 'savings' | 'overrun'
  amount: string
  status: 'pending' | 'approved' | 'submitted'
}

interface ClientActionItem {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'approval' | 'selection' | 'information' | 'meeting'
  status: 'pending' | 'completed'
  dueDate?: string
}

// Sophisticated impact indicator without colors
const ImpactIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const indicators = {
    high: { text: 'Critical', className: 'text-gray-900 font-semibold' },
    medium: { text: 'Moderate', className: 'text-gray-700' },
    low: { text: 'Minor', className: 'text-gray-500' }
  }
  
  const { text, className } = indicators[level]
  
  return (
    <span className={`text-xs uppercase tracking-wider ${className}`}>
      {text}
    </span>
  )
}

// Professional risk indicator
const RiskIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const indicators = {
    high: { icon: AlertCircle, text: 'High Risk', className: 'text-gray-900' },
    medium: { icon: AlertCircle, text: 'Medium Risk', className: 'text-gray-700' },
    low: { icon: AlertCircle, text: 'Low Risk', className: 'text-gray-500' }
  }
  
  const { icon: Icon, text, className } = indicators[level]
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs uppercase tracking-wider font-medium">{text}</span>
    </div>
  )
}

// Refined budget type display
const BudgetType = ({ type }: { type: string }) => {
  const types: Record<string, { text: string; icon: React.ElementType }> = {
    change_order: { text: 'Change Order', icon: TrendingUp },
    adjustment: { text: 'Budget Adjustment', icon: Minus },
    savings: { text: 'Cost Savings', icon: TrendingDown },
    overrun: { text: 'Cost Overrun', icon: TrendingUp }
  }
  
  const { text, icon: Icon } = types[type] || { text: type, icon: Minus }
  
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Status badge - minimal and professional
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    approved: 'bg-gray-900 text-white',
    submitted: 'bg-gray-200 text-gray-800',
    completed: 'bg-gray-900 text-white'
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Priority indicator - subtle and professional
const PriorityIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const priorities = {
    high: { text: 'Urgent', className: 'text-gray-900 font-semibold' },
    medium: { text: 'Standard', className: 'text-gray-700' },
    low: { text: 'Low', className: 'text-gray-500' }
  }
  
  const { text, className } = priorities[level]
  
  return (
    <span className={`text-xs uppercase tracking-wider ${className}`}>
      {text} Priority
    </span>
  )
}

// Category display - professional icons only
const CategoryDisplay = ({ category }: { category: string }) => {
  const categories: Record<string, { text: string; icon: React.ElementType }> = {
    approval: { text: 'Approval Required', icon: CheckCircle2 },
    selection: { text: 'Selection Required', icon: CheckCircle2 },
    information: { text: 'Information Needed', icon: AlertCircle },
    meeting: { text: 'Meeting Request', icon: Clock }
  }
  
  const { text, icon: Icon } = categories[category] || { text: category, icon: AlertCircle }
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

export function WorkDisplay({ title, items }: { title: string; items: WorkItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-700 flex-1">{item.description}</p>
                <ImpactIndicator level={item.impact} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function IssuesDisplay({ items }: { items: IssueItem[] }) {
  if (items.length === 0) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Issues & Delays</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-gray-700 flex-1">{item.description}</p>
                <RiskIndicator level={item.risk} />
              </div>
              {item.impact && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Impact:</span> {item.impact}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetDisplay({ items }: { items: BudgetItem[] }) {
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Budget & Change Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <BudgetType type={item.type} />
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{formatAmount(item.amount)}</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ClientActionsDisplay({ items }: { items: ClientActionItem[] }) {
  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Client Actions Required</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div key={item.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <CategoryDisplay category={item.category} />
                </div>
                <div className="text-right space-y-1">
                  <PriorityIndicator level={item.priority} />
                  {item.dueDate && (
                    <p className="text-sm text-gray-600">
                      Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}