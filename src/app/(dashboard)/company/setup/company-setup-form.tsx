'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker } from '@/components/color-picker'
import { createCompany } from '@/lib/actions/company'
import { Building2, Upload, Loader2, ArrowRight, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

export function CompanySetupForm() {
  const [companyName, setCompanyName] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [secondaryColor, setSecondaryColor] = useState('#666666')
  const [accentColor, setAccentColor] = useState('#3B82F6')
  const [logoUrl, setLogoUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (5MB limit for logos)
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      if (result.success && result.url) {
        setLogoUrl(result.url)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Failed to upload logo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeLogo = () => {
    setLogoUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyName.trim()) {
      alert('Please enter your company name')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', companyName)
      formData.append('logoUrl', logoUrl)
      formData.append('primaryColor', primaryColor)
      formData.append('secondaryColor', secondaryColor)
      formData.append('accentColor', accentColor)

      await createCompany(formData)
    } catch (error) {
      console.error('Error creating company:', error)
      alert('Failed to create company. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Company Information Card */}
        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic details about your construction company</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Company Name */}
            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                Company Name *
              </Label>
              <Input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., ABC Construction LLC"
                className="mt-1"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This will appear on all your reports and client communications
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Company Logo
              </Label>
              <p className="text-xs text-gray-500 mb-3">
                Upload your company logo (PNG, JPG, or SVG, max 5MB)
              </p>
              
              {!logoUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="relative"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Logo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    or drag and drop your logo here
                  </p>
                </div>
              ) : (
                <div className="relative inline-block">
                  <div className="relative w-48 h-24 bg-gray-50 rounded-lg border border-gray-200 p-2">
                    <Image
                      src={logoUrl}
                      alt="Company logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors Card */}
        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Customize the colors that represent your brand</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <ColorPicker
              id="primary-color"
              label="Primary Color"
              value={primaryColor}
              onChange={setPrimaryColor}
              description="Main brand color used for headers and primary actions"
            />

            <ColorPicker
              id="secondary-color"
              label="Secondary Color"
              value={secondaryColor}
              onChange={setSecondaryColor}
              description="Supporting color for secondary elements and text"
            />

            <ColorPicker
              id="accent-color"
              label="Accent Color"
              value={accentColor}
              onChange={setAccentColor}
              description="Highlight color for buttons, links, and important elements"
            />
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your branding will look on reports</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border rounded-lg overflow-hidden">
              {/* Preview Header */}
              <div 
                className="p-4 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {logoUrl ? (
                      <div className="relative w-12 h-12 bg-white rounded p-1">
                        <Image
                          src={logoUrl}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white/60" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {companyName || 'Your Company Name'}
                      </h3>
                      <p className="text-sm opacity-90">Weekly Construction Report</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-4 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <h4 
                      className="font-semibold mb-1"
                      style={{ color: secondaryColor }}
                    >
                      Project Update
                    </h4>
                    <p className="text-sm text-gray-600">
                      This week we completed the foundation work and began framing...
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    style={{ backgroundColor: accentColor }}
                    className="text-white"
                  >
                    View Full Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !companyName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Company...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}