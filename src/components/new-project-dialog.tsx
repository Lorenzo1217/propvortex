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
import { SimpleSelect, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Plus, UserPlus } from 'lucide-react'
import { createProject, checkCanCreateProject } from '@/lib/actions/projects'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ClientRelationship } from '@prisma/client'

interface NewProjectDialogProps {
  trigger?: React.ReactNode
  buttonText?: string
}

const relationshipTypes: { value: ClientRelationship; label: string }[] = [
  { value: 'HOMEOWNER', label: 'Homeowner' },
  { value: 'ARCHITECT', label: 'Architect' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'SUBCONTRACTOR', label: 'Subcontractor' },
  { value: 'OTHER', label: 'Other' },
]

// US States list
const states = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

export function NewProjectDialog({ trigger, buttonText = "New Project" }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [limitMessage, setLimitMessage] = useState('')
  const [addClient, setAddClient] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      // Check if user can create more projects
      const result = await checkCanCreateProject();
      
      if (!result.canCreate) {
        setShowLimitAlert(true)
        setLimitMessage(result.message || "You've reached your project limit.")
        setIsLoading(false)
        return;
      }

      await createProject(formData)
      setOpen(false)
      setShowLimitAlert(false)
      // Reset form is handled by dialog closing
    } catch (error) {
      console.error('Error creating project:', error)
      // TODO: Add toast notification for errors
    } finally {
      setIsLoading(false)
    }
  }

  const triggerButton = trigger || (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new construction project to start sending beautiful reports to your clients.
          </DialogDescription>
        </DialogHeader>
        
        {showLimitAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {limitMessage}
              {limitMessage.includes('project limit') && (
                <Link href="/pricing" className="underline ml-1">
                  Upgrade to create more projects.
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., The Smith Family Residence"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Address Fields Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Project Address</Label>
            
            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm font-normal">Street Address *</Label>
              <Input
                id="street"
                name="street"
                placeholder="e.g., 123 Main Street"
                required
                disabled={isLoading}
              />
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-normal">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Dallas"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-normal">State *</Label>
                <SimpleSelect name="state" defaultValue="TX" disabled={isLoading}>
                  <SelectItem value="">Select state</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SimpleSelect>
              </div>
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-normal">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="e.g., 75001"
                pattern="[0-9]{5}(-[0-9]{4})?"
                title="Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
                required
                disabled={isLoading}
                className="max-w-[200px]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the project (optional)"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          {/* Initial Client Section */}
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="addClient" 
                checked={addClient}
                onCheckedChange={(checked: boolean) => setAddClient(checked)}
                disabled={isLoading}
              />
              <Label 
                htmlFor="addClient" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Add initial client to this project
              </Label>
            </div>
            
            {addClient && (
              <div className="space-y-4 pl-6 animate-in slide-in-from-top-2">
                <input type="hidden" name="addClient" value="true" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientFirstName">First Name *</Label>
                    <Input
                      id="clientFirstName"
                      name="clientFirstName"
                      placeholder="John"
                      required={addClient}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientLastName">Last Name *</Label>
                    <Input
                      id="clientLastName"
                      name="clientLastName"
                      placeholder="Doe"
                      required={addClient}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email Address *</Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    required={addClient}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone Number</Label>
                  <Input
                    id="clientPhone"
                    name="clientPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientRelationshipType">Relationship Type</Label>
                  <SimpleSelect name="clientRelationshipType" defaultValue="HOMEOWNER" disabled={isLoading}>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SimpleSelect>
                </div>
                
                <p className="text-sm text-gray-500 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Client will receive project updates when reports are published
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}