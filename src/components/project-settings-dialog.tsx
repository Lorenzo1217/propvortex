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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Settings, Trash2, AlertTriangle } from 'lucide-react'
import { updateProject, deleteProject } from '@/lib/actions/projects'

interface Project {
  id: string
  name: string
  address: string
  street?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  description: string | null
  startDate: Date | null
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
}

interface ProjectSettingsDialogProps {
  project: Project
  trigger?: React.ReactNode
  buttonText?: string
}

const statusOptions = [
  { value: 'ACTIVE', label: 'Active', description: 'Project is currently under construction' },
  { value: 'ON_HOLD', label: 'On Hold', description: 'Project is temporarily paused' },
  { value: 'COMPLETED', label: 'Completed', description: 'Project has been finished' },
  { value: 'CANCELLED', label: 'Cancelled', description: 'Project has been cancelled' },
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

export function ProjectSettingsDialog({ project, trigger, buttonText = "Project Settings" }: ProjectSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Parse old address format if new fields don't exist
  const getAddressDefaults = () => {
    if (project.street && project.city && project.state && project.zipCode) {
      return {
        street: project.street,
        city: project.city,
        state: project.state,
        zipCode: project.zipCode,
      }
    }
    
    // Try to parse from old address format
    const parts = project.address.split(',').map(p => p.trim())
    if (parts.length >= 3) {
      const street = parts[0]
      const city = parts[1]
      const stateZip = parts[2].split(' ')
      return {
        street,
        city,
        state: stateZip[0] || '',
        zipCode: stateZip[1] || '',
      }
    }
    
    return {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    }
  }

  const addressDefaults = getAddressDefaults()

  async function handleUpdate(formData: FormData) {
    setIsLoading(true)
    try {
      await updateProject(project.id, formData)
      setOpen(false)
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteProject(project.id)
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const triggerButton = trigger || (
    <Button variant="outline" size="sm">
      <Settings className="w-4 h-4 mr-2" />
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
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update project details, status, or delete this project.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8">
          <form action={handleUpdate} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={project.name}
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
                    defaultValue={addressDefaults.street}
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
                      defaultValue={addressDefaults.city}
                      placeholder="e.g., Dallas"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-normal">State *</Label>
                    <SimpleSelect
                      name="state"
                      defaultValue={addressDefaults.state}
                      disabled={isLoading}
                    >
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
                    defaultValue={addressDefaults.zipCode}
                    placeholder="e.g., 75001"
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    title="Please enter a valid ZIP code"
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
                  defaultValue={project.startDate ? project.startDate.toISOString().split('T')[0] : ''}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project.description || ''}
                  placeholder="Brief description of the project (optional)"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <SimpleSelect name="status" defaultValue={project.status} disabled={isLoading}>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </SelectItem>
                  ))}
                </SimpleSelect>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Delete Project</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete the project, all reports, photos, and client data. 
                    This action cannot be undone.
                  </p>
                  <div className="mt-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? 'Deleting...' : 'Delete Project'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            "<strong>{project.name}</strong>" and remove all associated data including:
                            <br /><br />
                            • All weekly reports
                            <br />
                            • All uploaded photos
                            <br />
                            • All client data and portal access
                            <br />
                            • All project history
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Yes, delete project'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}