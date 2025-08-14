'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker } from '@/components/color-picker'
import { updateCompany, deleteCompanyLogo } from '@/lib/actions/company'
import { Building2, Upload, Loader2, Save, RotateCcw, Image as ImageIcon, X, Eye } from 'lucide-react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Company {
  id: string
  name: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

interface CompanySettingsFormProps {
  company: Company
}

export function CompanySettingsForm({ company }: CompanySettingsFormProps) {
  const [companyName, setCompanyName] = useState(company.name)
  const [primaryColor, setPrimaryColor] = useState(company.primaryColor)
  const [secondaryColor, setSecondaryColor] = useState(company.secondaryColor)
  const [accentColor, setAccentColor] = useState(company.accentColor)
  const [logoUrl, setLogoUrl] = useState(company.logoUrl || '')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Track changes
  const checkForChanges = () => {
    const changed = 
      companyName !== company.name ||
      primaryColor !== company.primaryColor ||
      secondaryColor !== company.secondaryColor ||
      accentColor !== company.accentColor ||
      logoUrl !== (company.logoUrl || '')
    setHasChanges(changed)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

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
        checkForChanges()
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

  const removeLogo = async () => {
    setLogoUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    checkForChanges()
  }

  const handleReset = () => {
    setCompanyName(company.name)
    setPrimaryColor(company.primaryColor)
    setSecondaryColor(company.secondaryColor)
    setAccentColor(company.accentColor)
    setLogoUrl(company.logoUrl || '')
    setHasChanges(false)
  }

  const handleResetToDefaults = () => {
    setPrimaryColor('#000000')
    setSecondaryColor('#666666')
    setAccentColor('#3B82F6')
    checkForChanges()
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

      await updateCompany(formData)
      setHasChanges(false)
    } catch (error) {
      console.error('Error updating company:', error)
      alert('Failed to update company. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="branding" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit}>
        <TabsContent value="branding" className="space-y-6">
          {/* Company Information Card */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Update your company details</CardDescription>
                  </div>
                </div>
                {hasChanges && (
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset Changes
                    </Button>
                  </div>
                )}
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
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    checkForChanges()
                  }}
                  placeholder="e.g., ABC Construction LLC"
                  className="mt-1"
                  required
                />
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
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace Logo
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
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle>Brand Colors</CardTitle>
                    <CardDescription>Customize your brand colors</CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToDefaults}
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ColorPicker
                id="primary-color"
                label="Primary Color"
                value={primaryColor}
                onChange={(value) => {
                  setPrimaryColor(value)
                  checkForChanges()
                }}
                description="Main brand color used for headers and primary actions"
              />

              <ColorPicker
                id="secondary-color"
                label="Secondary Color"
                value={secondaryColor}
                onChange={(value) => {
                  setSecondaryColor(value)
                  checkForChanges()
                }}
                description="Supporting color for secondary elements and text"
              />

              <ColorPicker
                id="accent-color"
                label="Accent Color"
                value={accentColor}
                onChange={(value) => {
                  setAccentColor(value)
                  checkForChanges()
                }}
                description="Highlight color for buttons, links, and important elements"
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {/* Preview Cards */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <CardTitle>Report Preview</CardTitle>
              </div>
              <CardDescription>
                This is how your branding will appear on client reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Email Report</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
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
                        <p className="text-sm opacity-90">Weekly Construction Report - Week 45</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <h4 
                      className="font-semibold mb-3 text-lg"
                      style={{ color: secondaryColor }}
                    >
                      Executive Summary
                    </h4>
                    <p className="text-gray-600 mb-4">
                      This week marked significant progress on the Riverside Residence project. 
                      Foundation work has been completed, and framing has begun on schedule.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 mb-1">Completion</p>
                        <p className="font-semibold" style={{ color: accentColor }}>35%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500 mb-1">Budget Used</p>
                        <p className="font-semibold" style={{ color: accentColor }}>$125,000</p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      style={{ backgroundColor: accentColor }}
                      className="text-white w-full"
                    >
                      View Full Report
                    </Button>
                  </div>
                </div>
              </div>

              {/* PDF Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">PDF Report Header</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div 
                    className="p-6"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        {logoUrl ? (
                          <div className="relative w-16 h-16 bg-white rounded p-1">
                            <Image
                              src={logoUrl}
                              alt="Logo preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-white/20 rounded flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-white/60" />
                          </div>
                        )}
                        <div>
                          <h1 className="text-2xl font-bold">
                            {companyName || 'Your Company Name'}
                          </h1>
                          <p className="opacity-90">Professional Construction Services</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-75">Report Date</p>
                        <p className="font-semibold">November 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Usage Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Color Usage Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div>
                    <p className="font-medium">Primary Color</p>
                    <p className="text-sm text-gray-500">Used for headers, main branding elements</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <div>
                    <p className="font-medium">Secondary Color</p>
                    <p className="text-sm text-gray-500">Used for subheadings, secondary text</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div>
                    <p className="font-medium">Accent Color</p>
                    <p className="text-sm text-gray-500">Used for buttons, links, highlights</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </form>
    </Tabs>
  )
}