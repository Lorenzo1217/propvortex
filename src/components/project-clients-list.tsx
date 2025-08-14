'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, UserMinus, Mail, Phone, Calendar, UserCheck, Clock, Loader2 } from 'lucide-react'
import { removeClientFromProject } from '@/lib/actions/projects'
import { ClientRelationship } from '@prisma/client'
import { format } from 'date-fns'
import { AddClientDialog } from '@/components/add-client-dialog'

interface ProjectClient {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  relationshipType: ClientRelationship
  isInvited: boolean
  invitedAt: Date
  firstLoginAt: Date | null
  lastLoginAt: Date | null
}

interface ProjectClientsListProps {
  projectId: string
  clients: ProjectClient[]
  onClientRemoved?: () => void
  onClientAdded?: () => void
}

const relationshipColors: Record<ClientRelationship, string> = {
  HOMEOWNER: 'bg-blue-100 text-blue-800',
  ARCHITECT: 'bg-purple-100 text-purple-800',
  INVESTOR: 'bg-green-100 text-green-800',
  SUBCONTRACTOR: 'bg-orange-100 text-orange-800',
  OTHER: 'bg-gray-100 text-gray-800',
}

const relationshipLabels: Record<ClientRelationship, string> = {
  HOMEOWNER: 'Homeowner',
  ARCHITECT: 'Architect',
  INVESTOR: 'Investor',
  SUBCONTRACTOR: 'Subcontractor',
  OTHER: 'Other',
}

export function ProjectClientsList({ 
  projectId, 
  clients, 
  onClientRemoved,
  onClientAdded 
}: ProjectClientsListProps) {
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ProjectClient | null>(null)

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    
    setIsDeleting(true)
    setDeletingClientId(clientToDelete.id)
    
    try {
      await removeClientFromProject(projectId, clientToDelete.id)
      onClientRemoved?.()
      setClientToDelete(null)
    } catch (error) {
      console.error('Error removing client:', error)
      alert('Failed to remove client. Please try again.')
    } finally {
      setIsDeleting(false)
      setDeletingClientId(null)
    }
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Yet</h3>
            <p className="text-gray-500 mb-6">
              Add clients to keep them updated on project progress
            </p>
            <AddClientDialog 
              projectId={projectId} 
              onSuccess={onClientAdded}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Clients ({clients.length})
          </CardTitle>
          <AddClientDialog 
            projectId={projectId} 
            onSuccess={onClientAdded}
          />
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={relationshipColors[client.relationshipType]}>
                        {relationshipLabels[client.relationshipType]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.isInvited ? (
                        <div className="flex items-center text-green-600">
                          <UserCheck className="w-4 h-4 mr-1" />
                          <span className="text-sm">Invited</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                      {client.firstLoginAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          First login: {format(new Date(client.firstLoginAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(client.invitedAt), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setClientToDelete(client)}
                        disabled={deletingClientId === client.id}
                      >
                        {deletingClientId === client.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserMinus className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {client.firstName} {client.lastName}
                    </h4>
                    <Badge className={`${relationshipColors[client.relationshipType]} mt-1`}>
                      {relationshipLabels[client.relationshipType]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClientToDelete(client)}
                    disabled={deletingClientId === client.id}
                  >
                    {deletingClientId === client.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserMinus className="w-4 h-4 text-red-500" />
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-3 h-3 mr-2" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-3 h-3 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-3 h-3 mr-2" />
                    Added {format(new Date(client.invitedAt), 'MMM d, yyyy')}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  {client.isInvited ? (
                    <div className="flex items-center text-green-600">
                      <UserCheck className="w-4 h-4 mr-1" />
                      <span className="text-sm">Invited</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">Pending Invitation</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {clientToDelete?.firstName} {clientToDelete?.lastName} from this project? 
              They will no longer receive project updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove Client'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}