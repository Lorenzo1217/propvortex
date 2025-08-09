'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

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
}

export function ControlEstimate({ initialData, isEditing = true }: ControlEstimateProps) {
  if (!isEditing) {
    // Display mode for published reports
    return (
      <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Control Estimate Update
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <div className="space-y-3">
            {initialData?.professionalFees && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Professional Fees</span>
                <span className="font-medium text-gray-900">{initialData.professionalFees}</span>
              </div>
            )}
            {initialData?.constructionCosts && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Construction Costs</span>
                <span className="font-medium text-gray-900">{initialData.constructionCosts}</span>
              </div>
            )}
            {initialData?.offsiteUtilities && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Offsite Utilities</span>
                <span className="font-medium text-gray-900">{initialData.offsiteUtilities}</span>
              </div>
            )}
            {initialData?.ffe && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">FFE</span>
                <span className="font-medium text-gray-900">{initialData.ffe}</span>
              </div>
            )}
            {initialData?.insuranceFinancing && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Insurance & Financing</span>
                <span className="font-medium text-gray-900">{initialData.insuranceFinancing}</span>
              </div>
            )}
            {initialData?.total && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="font-semibold text-gray-900 text-lg">{initialData.total}</span>
                </div>
              </div>
            )}
            {(initialData?.contingency || initialData?.contingencyUsed) && (
              <div className="border-t pt-3 mt-3 space-y-2">
                {initialData?.contingency && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Project Contingency</span>
                    <span className="font-medium text-gray-900">{initialData.contingency}</span>
                  </div>
                )}
                {initialData?.contingencyUsed && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Contingency Used</span>
                    <span className="font-medium text-gray-900">{initialData.contingencyUsed}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode - simple form inputs
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <DollarSign className="h-5 w-5 text-gray-700" />
          Control Estimate Update
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ceProfessionalFees">Professional Fees</Label>
            <Input
              id="ceProfessionalFees"
              name="ceProfessionalFees"
              type="text"
              defaultValue={initialData?.professionalFees || ''}
              placeholder="$0.00"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ceConstructionCosts">Construction Costs</Label>
            <Input
              id="ceConstructionCosts"
              name="ceConstructionCosts"
              type="text"
              defaultValue={initialData?.constructionCosts || ''}
              placeholder="$0.00"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ceOffsiteUtilities">Offsite Utilities</Label>
            <Input
              id="ceOffsiteUtilities"
              name="ceOffsiteUtilities"
              type="text"
              defaultValue={initialData?.offsiteUtilities || ''}
              placeholder="$0.00"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ceFFE">FFE</Label>
            <Input
              id="ceFFE"
              name="ceFFE"
              type="text"
              defaultValue={initialData?.ffe || ''}
              placeholder="$0.00"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ceInsuranceFinancing">Insurance & Financing</Label>
            <Input
              id="ceInsuranceFinancing"
              name="ceInsuranceFinancing"
              type="text"
              defaultValue={initialData?.insuranceFinancing || ''}
              placeholder="$0.00"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ceTotal">Total</Label>
            <Input
              id="ceTotal"
              name="ceTotal"
              type="text"
              defaultValue={initialData?.total || ''}
              placeholder="$0.00"
              className="mt-1"
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
                placeholder="$0.00"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ceContingencyUsed">Contingency Used</Label>
              <Input
                id="ceContingencyUsed"
                name="ceContingencyUsed"
                type="text"
                defaultValue={initialData?.contingencyUsed || ''}
                placeholder="$0.00"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}