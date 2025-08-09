'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Hammer,
  AlertTriangle,
  DollarSign,
  UserCheck,
  ChevronRight,
  Activity,
  Zap,
  Shield
} from 'lucide-react'

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

// Ultra-luxury impact indicator
const ImpactIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const indicators = {
    high: { 
      text: 'Critical Impact', 
      icon: Zap,
      className: 'text-blue-700',
      bgClassName: 'bg-blue-50',
      dotColor: 'bg-blue-600'
    },
    medium: { 
      text: 'Moderate Impact', 
      icon: Activity,
      className: 'text-gray-700',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-600'
    },
    low: { 
      text: 'Minor Impact', 
      icon: Shield,
      className: 'text-gray-600',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-400'
    }
  }
  
  const { text, className, bgClassName, dotColor } = indicators[level]
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgClassName}`}>
      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      <span className={`text-xs font-medium tracking-wide ${className}`}>
        {text}
      </span>
    </div>
  )
}

// Premium risk indicator - EXACTLY matches impact indicator style
const RiskIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const indicators = {
    high: { 
      text: 'High Risk', 
      className: 'text-blue-700',
      bgClassName: 'bg-blue-50',
      dotColor: 'bg-blue-600'
    },
    medium: { 
      text: 'Medium Risk', 
      className: 'text-gray-700',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-600'
    },
    low: { 
      text: 'Low Risk', 
      className: 'text-gray-600',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-400'
    }
  }
  
  const { text, className, bgClassName, dotColor } = indicators[level]
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgClassName}`}>
      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      <span className={`text-xs font-medium tracking-wide ${className}`}>
        {text}
      </span>
    </div>
  )
}

// Elegant budget type display - clean minimal style
const BudgetType = ({ type }: { type: string }) => {
  const types: Record<string, { 
    text: string; 
    icon: React.ElementType; 
  }> = {
    change_order: { 
      text: 'Change Order', 
      icon: TrendingUp
    },
    adjustment: { 
      text: 'Budget Adjustment', 
      icon: Minus
    },
    savings: { 
      text: 'Cost Savings', 
      icon: TrendingDown
    },
    overrun: { 
      text: 'Cost Overrun', 
      icon: TrendingUp
    }
  }
  
  const { text, icon: Icon } = types[type] || types.adjustment
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Premium status badge - EXACTLY matches impact indicator style
const StatusBadge = ({ status }: { status: string }) => {
  const indicators: Record<string, { 
    className: string;
    bgClassName: string;
    dotColor: string;
  }> = {
    approved: {
      className: 'text-gray-600',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-400'
    },
    pending: {
      className: 'text-gray-700',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-600'
    },
    submitted: {
      className: 'text-gray-700',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-600'
    },
    rejected: {
      className: 'text-blue-700',
      bgClassName: 'bg-blue-50',
      dotColor: 'bg-blue-600'
    },
    completed: {
      className: 'text-gray-600',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-400'
    }
  }
  
  const indicator = indicators[status?.toLowerCase()] || {
    className: 'text-gray-600',
    bgClassName: 'bg-gray-50',
    dotColor: 'bg-gray-400'
  }
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${indicator.bgClassName}`}>
      <div className={`w-2 h-2 rounded-full ${indicator.dotColor}`}></div>
      <span className={`text-xs font-medium tracking-wide ${indicator.className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  )
}

// Sophisticated priority indicator - EXACTLY matches impact indicator style
const PriorityIndicator = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const indicators = {
    high: { 
      text: 'Urgent', 
      className: 'text-blue-700',
      bgClassName: 'bg-blue-50',
      dotColor: 'bg-blue-600'
    },
    medium: { 
      text: 'Standard', 
      className: 'text-gray-700',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-600'
    },
    low: { 
      text: 'Low', 
      className: 'text-gray-600',
      bgClassName: 'bg-gray-50',
      dotColor: 'bg-gray-400'
    }
  }
  
  const { text, className, bgClassName, dotColor } = indicators[level]
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgClassName}`}>
      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      <span className={`text-xs font-medium tracking-wide ${className}`}>
        {text}
      </span>
    </div>
  )
}

// Premium category display
const CategoryDisplay = ({ category }: { category: string }) => {
  const categories: Record<string, { text: string; icon: React.ElementType }> = {
    approval: { text: 'Approval Required', icon: CheckCircle2 },
    selection: { text: 'Selection Required', icon: UserCheck },
    information: { text: 'Information Needed', icon: AlertCircle },
    meeting: { text: 'Meeting Request', icon: Clock }
  }
  
  const { text, icon: Icon } = categories[category] || { text: category, icon: AlertCircle }
  
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <div className="p-1 bg-gray-100 rounded">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm font-light">{text}</span>
    </div>
  )
}

export function WorkDisplay({ title, items }: { title: string; items: WorkItem[] }) {
  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Hammer className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-light tracking-wide text-gray-900">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
              <div className="pl-6 pb-4">
                <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed flex-1">{item.description}</p>
                  <ImpactIndicator level={item.impact} />
                </div>
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
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-light tracking-wide text-gray-900">
            Issues & Delays
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group"
            >
              <div className="bg-gray-50/50 rounded-lg p-5 hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-gray-700 leading-relaxed flex-1 font-light">
                    {item.description}
                  </p>
                  <RiskIndicator level={item.risk} />
                </div>
                {item.impact && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Impact Analysis:</span> {item.impact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetDisplay({ items }: { items: BudgetItem[] }) {
  // Match Control Estimate's formatCurrency exactly
  const formatCurrency = (value: string | number | null | undefined): string => {
    if (!value) return '$0';
    const cleanValue = String(value).replace(/[^0-9.-]/g, '');
    const number = parseFloat(cleanValue);
    if (isNaN(number)) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };
  
  // Calculate total change
  const totalChange = items.reduce((sum, item) => {
    const amount = parseFloat(item.amount)
    if (item.type === 'savings') return sum - amount
    if (item.type === 'overrun' || item.type === 'change_order') return sum + amount
    return sum
  }, 0)
  
  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Budget & Change Orders
            </CardTitle>
          </div>
          {totalChange !== 0 && (
            <div className={`text-lg font-medium ${totalChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              Net: {formatCurrency(Math.abs(totalChange).toString())}
              {totalChange > 0 ? ' Over' : ' Under'}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-5">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="group bg-gray-50 hover:bg-gray-100/50 rounded-lg p-4 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  <BudgetType type={item.type} />
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg font-semibold">
                    {formatCurrency(item.amount)}
                  </p>
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
  
  const pendingCount = items.filter(item => item.status === 'pending').length
  
  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Client Actions Required
            </CardTitle>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {pendingCount} Pending
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-5">
          {sortedItems.map((item) => (
            <div 
              key={item.id} 
              className="group"
            >
              <div className={`rounded-lg border p-5 transition-all duration-200 ${
                item.status === 'completed' 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <p className={`leading-relaxed ${
                      item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'
                    }`}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <CategoryDisplay category={item.category} />
                      {item.dueDate && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due {format(new Date(item.dueDate), 'MMM d')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <PriorityIndicator level={item.priority} />
                    {item.status === 'pending' && (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}