'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Upload failed:', error)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Document to Client Portal</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'file' ? 'default' : 'outline'}
            onClick={() => setMode('file')}
            className={mode === 'file' ? 'bg-blue-600' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant={mode === 'link' ? 'default' : 'outline'}
            onClick={() => setMode('link')}
            className={mode === 'link' ? 'bg-blue-600' : ''}
          >
            <Link className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {mode === 'file' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File (PDF, Excel, Word)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max file size: 10MB
              </p>
            </div>
            {isUploading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2">Uploading document...</span>
              </div>
            )}
          </div>
        ) : (
          <form action={handleLinkSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Link Name</Label>
                <Input 
                  name="name" 
                  id="name"
                  required 
                  placeholder="e.g., Permit Application" 
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input 
                  name="url" 
                  id="url"
                  type="url" 
                  required 
                  placeholder="https://..." 
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  name="description" 
                  id="description"
                  placeholder="Brief description of this document or link..." 
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add Link
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}