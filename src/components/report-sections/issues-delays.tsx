'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, GripVertical, AlertTriangle } from 'lucide-react'

export interface Issue {
  id: string
  description: string
  risk: 'high' | 'medium' | 'low'
  impact: string
}

interface IssuesDelaysProps {
  name: string
  items?: Issue[]
}

const getRiskDotColor = (risk: string) => {
  switch(risk?.toLowerCase()) {
    case 'low': return 'bg-blue-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getRiskLabel = (risk: string) => {
  switch(risk?.toLowerCase()) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Medium Risk';
    case 'high': return 'High Risk';
    default: return risk || 'Unknown';
  }
};

export function IssuesDelays({ name, items = [] }: IssuesDelaysProps) {
  const [issues, setIssues] = useState<Issue[]>(
    items.length > 0 ? items : [{ id: '1', description: '', risk: 'medium', impact: '' }]
  )

  const addIssue = () => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      description: '',
      risk: 'medium',
      impact: ''
    }
    setIssues([...issues, newIssue])
  }

  const removeIssue = (id: string) => {
    if (issues.length > 1) {
      setIssues(issues.filter(issue => issue.id !== id))
    }
  }

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    ))
  }

  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Issues & Delays
            </CardTitle>
            <CardDescription className="mt-1">
              Track challenges, delays, and potential risks to the project timeline
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">

        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={issue.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex gap-2 items-start">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move mt-2" />
                
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Describe the issue or delay..."
                    value={issue.description}
                    onChange={(e) => updateIssue(issue.id, { description: e.target.value })}
                    className="w-full"
                  />
                  
                  <div className="flex gap-2">
                    <select
                      value={issue.risk}
                      onChange={(e) => updateIssue(issue.id, { risk: e.target.value as 'high' | 'medium' | 'low' })}
                      className="w-40 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="high">High Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="low">Low Risk</option>
                    </select>

                    <Input
                      placeholder="What does this impact? (e.g., Timeline, Budget)"
                      value={issue.impact}
                      onChange={(e) => updateIssue(issue.id, { impact: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIssue(issue.id)}
                  disabled={issues.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIssue}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Issue
        </Button>

        <input
          type="hidden"
          name={name}
          value={JSON.stringify(issues.filter(issue => issue.description.trim()))}
        />
      </CardContent>
    </Card>
  )
}