'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp } from "lucide-react";

interface ControlEstimateProps {
  initialData?: {
    professionalFees?: string;
    constructionCosts?: string;
    offsiteUtilities?: string;
    ffe?: string;
    insuranceFinancing?: string;
    total?: string;
    contingency?: string;
    contingencyUsed?: string;
  };
  isEditing?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// Format currency with proper $ and commas
const formatCurrency = (value: string | number | null | undefined): string => {
  if (!value) return '$0';
  
  // Remove any existing formatting
  const cleanValue = String(value).replace(/[^0-9.-]/g, '');
  const number = parseFloat(cleanValue);
  
  if (isNaN(number)) return '$0';
  
  // Format with commas and dollar sign
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Parse currency for calculations
const parseCurrency = (value: string | null | undefined): number => {
  if (!value) return 0;
  const cleanValue = String(value).replace(/[^0-9.-]/g, '');
  return parseFloat(cleanValue) || 0;
};

// Calculate contingency percentage
const calculateContingencyPercentage = (used: string | null | undefined, total: string | null | undefined): number => {
  const usedNum = parseCurrency(used);
  const totalNum = parseCurrency(total);
  
  if (!totalNum || !usedNum) return 0;
  return (usedNum / totalNum) * 100;
};

// Get color based on contingency percentage
const getContingencyColor = (percentage: number): string => {
  if (percentage <= 25) return 'bg-green-100 text-green-700';
  if (percentage <= 50) return 'bg-yellow-100 text-yellow-700';
  if (percentage <= 75) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
};

const getContingencyBarColor = (percentage: number): string => {
  if (percentage <= 25) return 'bg-green-500';
  if (percentage <= 50) return 'bg-yellow-500';
  if (percentage <= 75) return 'bg-orange-500';
  return 'bg-red-500';
};

export function ControlEstimate({ 
  initialData, 
  isEditing = true,
  primaryColor = '#000000',
  secondaryColor = '#666666',
  accentColor = '#3B82F6'
}: ControlEstimateProps) {
  if (!isEditing) {
    // Display mode for published reports - sophisticated like Budget section
    const percentage = calculateContingencyPercentage(initialData?.contingencyUsed, initialData?.contingency);
    const remaining = parseCurrency(initialData?.contingency) - parseCurrency(initialData?.contingencyUsed);
    
    return (
      <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
        <CardHeader 
          className="border-b px-8 py-6"
          style={{
            background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
            borderBottomColor: secondaryColor
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
              <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Control Estimate Update
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <div className="space-y-6">
            {/* Main Financial Categories */}
            <div className="space-y-4">
              {/* Professional Fees */}
              {initialData?.professionalFees && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-medium">Professional Fees</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Design & Consulting</span>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(initialData.professionalFees)}</span>
                </div>
              )}
              
              {/* Construction Costs */}
              {initialData?.constructionCosts && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-medium">Construction Costs</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Labor & Materials</span>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(initialData.constructionCosts)}</span>
                </div>
              )}
              
              {/* Offsite Utilities */}
              {initialData?.offsiteUtilities && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-medium">Offsite Utilities</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Infrastructure</span>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(initialData.offsiteUtilities)}</span>
                </div>
              )}
              
              {/* FFE */}
              {initialData?.ffe && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-medium">FFE</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Furniture, Fixtures & Equipment</span>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(initialData.ffe)}</span>
                </div>
              )}
              
              {/* Insurance & Financing */}
              {initialData?.insuranceFinancing && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-medium">Insurance & Financing</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Risk & Capital</span>
                  </div>
                  <span className="text-lg font-semibold">{formatCurrency(initialData.insuranceFinancing)}</span>
                </div>
              )}
            </div>
            
            {/* Total Section - Make it prominent */}
            {initialData?.total && (
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-light text-gray-700">Project Total</span>
                  <span className="text-2xl font-semibold text-gray-900">{formatCurrency(initialData.total)}</span>
                </div>
              </div>
            )}
            
            {/* Contingency Section with Visual Indicators */}
            {(initialData?.contingency || initialData?.contingencyUsed) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contingency Tracking</h4>
                
                {/* Contingency Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Original Contingency</span>
                  <span className="font-semibold">{formatCurrency(initialData.contingency)}</span>
                </div>
                
                {/* Contingency Used with Percentage */}
                {initialData?.contingencyUsed && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Amount Used</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatCurrency(initialData.contingencyUsed)}</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getContingencyColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getContingencyBarColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    {/* Remaining Amount */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-gray-700">Remaining</span>
                      <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode - simple form inputs with auto-formatting
  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader 
        className="border-b px-8 py-6"
        style={{
          background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
          borderBottomColor: secondaryColor
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
            <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <CardTitle className="text-xl font-light tracking-wide text-gray-900">
            Control Estimate Update
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ceProfessionalFees">Professional Fees</Label>
            <Input
              id="ceProfessionalFees"
              name="ceProfessionalFees"
              type="text"
              defaultValue={initialData?.professionalFees || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="ceConstructionCosts">Construction Costs</Label>
            <Input
              id="ceConstructionCosts"
              name="ceConstructionCosts"
              type="text"
              defaultValue={initialData?.constructionCosts || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="ceOffsiteUtilities">Offsite Utilities</Label>
            <Input
              id="ceOffsiteUtilities"
              name="ceOffsiteUtilities"
              type="text"
              defaultValue={initialData?.offsiteUtilities || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="ceFFE">FFE</Label>
            <Input
              id="ceFFE"
              name="ceFFE"
              type="text"
              defaultValue={initialData?.ffe || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="ceInsuranceFinancing">Insurance & Financing</Label>
            <Input
              id="ceInsuranceFinancing"
              name="ceInsuranceFinancing"
              type="text"
              defaultValue={initialData?.insuranceFinancing || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="ceTotal">Total</Label>
            <Input
              id="ceTotal"
              name="ceTotal"
              type="text"
              defaultValue={initialData?.total || ''}
              placeholder="$0"
              className="mt-1"
              onBlur={(e) => {
                const formatted = formatCurrency(e.target.value);
                e.target.value = formatted;
              }}
            />
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contingency Tracking</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ceContingency">Project Contingency</Label>
              <Input
                id="ceContingency"
                name="ceContingency"
                type="text"
                defaultValue={initialData?.contingency || ''}
                placeholder="$0"
                className="mt-1"
                onBlur={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  e.target.value = formatted;
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="ceContingencyUsed">Contingency Used</Label>
              <Input
                id="ceContingencyUsed"
                name="ceContingencyUsed"
                type="text"
                defaultValue={initialData?.contingencyUsed || ''}
                placeholder="$0"
                className="mt-1"
                onBlur={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  e.target.value = formatted;
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}