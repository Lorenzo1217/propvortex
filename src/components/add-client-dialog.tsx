'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SimpleSelect, SelectItem } from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'
import { addClientToProject } from '@/lib/actions/projects'
import { ClientRelationship } from '@prisma/client'

interface AddClientDialogProps {
  projectId: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const relationshipTypes: { value: ClientRelationship; label: string }[] = [
  { value: 'HOMEOWNER', label: 'Homeowner' },
  { value: 'ARCHITECT', label: 'Architect' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'SUBCONTRACTOR', label: 'Subcontractor' },
  { value: 'OTHER', label: 'Other' },
]

export function AddClientDialog({ projectId, trigger, onSuccess }: AddClientDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    
    if (!firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    if (!validateForm(formData)) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await addClientToProject(projectId, formData)
      
      if (result.success) {
        setOpen(false)
        // Reset form
        const form = e.target as HTMLFormElement
        form.reset()
        setErrors({})
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error adding client:', error)
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to add client. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Client to Project</DialogTitle>
          <DialogDescription>
            Add a client who will receive project updates and reports. They'll be notified when reports are published.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-gray-500">(optional)</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="relationshipType">
              Relationship Type
            </Label>
            <SimpleSelect name="relationshipType" defaultValue="HOMEOWNER">
              {relationshipTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SimpleSelect>
          </div>
          
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Client...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Client
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}