'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Link, Upload, X, Loader2 } from 'lucide-react'
import { createDocumentLink } from '@/lib/actions/documents'
import { useRouter } from 'next/navigation'

interface DocumentUploadModalProps {
  projectId: string
}

export function DocumentUploadModal({ projectId }: DocumentUploadModalProps) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [mode, setMode] = useState<'file' | 'link'>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a file')
      return
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (selectedFile.size > maxSize) {
      alert('File is too large. Maximum file size is 10MB.')
      return
    }

    setIsUploading(true)
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    
    try {
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('projectId', projectId)
      uploadData.append('title', title || selectedFile.name)
      uploadData.append('description', description || '')
      
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: uploadData
      })
      
      if (response.ok) {
        setOpen(false)
        setSelectedFile(null)
        router.refresh()
      } else if (response.status === 413) {
        alert('File is too large. Maximum file size is 10MB.')
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleLinkSubmit = async (formData: FormData) => {
    await createDocumentLink(formData, projectId)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        setSelectedFile(null)
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Document to Client Portal</DialogTitle>
          <DialogDescription>
            Upload files or add links for your client to access in their portal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={mode === 'file' ? 'default' : 'outline'}
            onClick={() => setMode('file')}
            className={mode === 'file' ? 'bg-blue-600' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <Button
            type="button"
            variant={mode === 'link' ? 'default' : 'outline'}
            onClick={() => setMode('link')}
            className={mode === 'link' ? 'bg-blue-600' : ''}
          >
            <Link className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {mode === 'file' ? (
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Select File (Max 10MB)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // Check file size immediately
                    const maxSize = 10 * 1024 * 1024 // 10MB
                    if (file.size > maxSize) {
                      alert('File is too large. Maximum file size is 10MB.')
                      e.target.value = '' // Clear the input
                      return
                    }
                    setSelectedFile(file)
                  } else {
                    setSelectedFile(null)
                  }
                }}
                required
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="title">Document Title *</Label>
              <Input 
                id="title"
                name="title" 
                required 
                placeholder="e.g., Building Permit" 
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the name that will be displayed to the client
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                name="description" 
                placeholder="Brief description of the document..." 
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </form>
        ) : (
          <form action={handleLinkSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Link Title *</Label>
              <Input 
                id="name"
                name="name" 
                required 
                placeholder="e.g., Permit Application Website" 
              />
            </div>
            
            <div>
              <Label htmlFor="url">URL *</Label>
              <Input 
                id="url"
                name="url" 
                type="url" 
                required 
                placeholder="https://..." 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                name="description" 
                placeholder="Brief description..." 
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}