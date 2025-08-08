'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Copy, Calculator } from "lucide-react";
import { useState, useEffect } from "react";

interface ControlEstimateData {
  professionalFees?: string;
  constructionCosts?: string;
  offsiteUtilities?: string;
  ffe?: string;
  insuranceFinancing?: string;
  total?: string;
  contingency?: string;
  contingencyUsed?: string;
}

interface ControlEstimateProps {
  initialData?: ControlEstimateData;
  onChange?: (data: ControlEstimateData) => void;
  isEditing?: boolean;
}

export function ControlEstimate({ initialData, onChange, isEditing = true }: ControlEstimateProps) {
  const [data, setData] = useState<ControlEstimateData>(initialData || {});
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Format number with thousand separators
  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return '';
    const num = String(value).replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Parse formatted currency to number
  const parseCurrency = (value: string | null | undefined): number => {
    if (!value) return 0;
    return parseFloat(String(value).replace(/[^0-9.-]/g, '') || '0');
  };

  // Calculate total
  useEffect(() => {
    if (autoCalculate && isEditing) {
      const fields = [
        data.professionalFees,
        data.constructionCosts,
        data.offsiteUtilities,
        data.ffe,
        data.insuranceFinancing
      ];
      
      const total = fields.reduce((sum, field) => {
        return sum + parseCurrency(field || '0');
      }, 0);
      
      const newData = { ...data, total: total.toString() };
      setData(newData);
      onChange?.(newData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.professionalFees, data.constructionCosts, data.offsiteUtilities, data.ffe, data.insuranceFinancing, autoCalculate, isEditing]);

  const handleChange = (field: keyof ControlEstimateData, value: string) => {
    const formattedValue = formatCurrency(value);
    const newData = { ...data, [field]: formattedValue };
    setData(newData);
    onChange?.(newData);
  };

  const calculateContingencyPercentage = () => {
    const used = parseCurrency(data.contingencyUsed || '0');
    const total = parseCurrency(data.contingency || '0');
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const copyFromLastWeek = () => {
    // TODO: Implement copy from last week functionality
    console.log('Copy from last week - to be implemented');
  };

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
          <div className="space-y-1">
            {/* Main line items */}
            <div className="space-y-2">
              <div className="flex justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
                <span className="text-gray-700">Professional Fees</span>
                <span className="font-medium text-gray-900 tabular-nums">${data.professionalFees || '0'}</span>
              </div>
              <div className="flex justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
                <span className="text-gray-700">Construction Costs</span>
                <span className="font-medium text-gray-900 tabular-nums">${data.constructionCosts || '0'}</span>
              </div>
              <div className="flex justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
                <span className="text-gray-700">Offsite Utilities</span>
                <span className="font-medium text-gray-900 tabular-nums">${data.offsiteUtilities || '0'}</span>
              </div>
              <div className="flex justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
                <span className="text-gray-700">FFE</span>
                <span className="font-medium text-gray-900 tabular-nums">${data.ffe || '0'}</span>
              </div>
              <div className="flex justify-between py-2 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
                <span className="text-gray-700">Insurance & Financing</span>
                <span className="font-medium text-gray-900 tabular-nums">${data.insuranceFinancing || '0'}</span>
              </div>
            </div>
            
            {/* Total row */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="font-semibold text-gray-900 text-lg tabular-nums">${data.total || '0'}</span>
              </div>
            </div>
            
            {/* Contingency section */}
            {(data.contingency || data.contingencyUsed) && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Project Contingency</span>
                    <span className="font-medium text-gray-900 tabular-nums">${data.contingency || '0'}</span>
                  </div>
                  
                  {/* Progress bar for contingency usage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Contingency Usage</span>
                      <span className="font-medium text-gray-900">
                        {calculateContingencyPercentage()}% • ${data.contingencyUsed || '0'} of ${data.contingency || '0'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                        style={{width: `${calculateContingencyPercentage()}%`}} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode
  return (
    <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-light tracking-wide text-gray-900">
              Control Estimate Update
            </CardTitle>
          </div>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={copyFromLastWeek}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy from Last Week
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-6">
          {/* Main estimate fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional-fees" className="text-sm font-medium text-gray-700">
                  Professional Fees
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="professional-fees"
                    type="text"
                    value={data.professionalFees || ''}
                    onChange={(e) => handleChange('professionalFees', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="construction-costs" className="text-sm font-medium text-gray-700">
                  Construction Costs
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="construction-costs"
                    type="text"
                    value={data.constructionCosts || ''}
                    onChange={(e) => handleChange('constructionCosts', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offsite-utilities" className="text-sm font-medium text-gray-700">
                  Offsite Utilities
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="offsite-utilities"
                    type="text"
                    value={data.offsiteUtilities || ''}
                    onChange={(e) => handleChange('offsiteUtilities', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ffe" className="text-sm font-medium text-gray-700">
                  FFE
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="ffe"
                    type="text"
                    value={data.ffe || ''}
                    onChange={(e) => handleChange('ffe', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance-financing" className="text-sm font-medium text-gray-700">
                  Insurance & Financing
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="insurance-financing"
                    type="text"
                    value={data.insuranceFinancing || ''}
                    onChange={(e) => handleChange('insuranceFinancing', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Total section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="total" className="text-base font-medium text-gray-900">
                  Total
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoCalculate(!autoCalculate)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Calculator className="w-4 h-4" />
                  {autoCalculate ? 'Auto' : 'Manual'}
                </Button>
              </div>
              <div className="relative w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium">$</span>
                <Input
                  id="total"
                  type="text"
                  value={formatCurrency(data.total || '0')}
                  onChange={(e) => handleChange('total', e.target.value)}
                  disabled={autoCalculate}
                  className="pl-7 text-right font-semibold text-lg tabular-nums border-gray-300 bg-gray-50"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          {/* Contingency section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Contingency Tracking</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contingency" className="text-sm font-medium text-gray-700">
                  Project Contingency
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="contingency"
                    type="text"
                    value={data.contingency || ''}
                    onChange={(e) => handleChange('contingency', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contingency-used" className="text-sm font-medium text-gray-700">
                  Contingency Used
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="contingency-used"
                    type="text"
                    value={data.contingencyUsed || ''}
                    onChange={(e) => handleChange('contingencyUsed', e.target.value)}
                    className="pl-7 text-right font-medium tabular-nums border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Visual progress indicator */}
            {(data.contingency && parseCurrency(data.contingency) > 0) && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage</span>
                  <span className="font-medium text-gray-900">
                    {calculateContingencyPercentage()}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      calculateContingencyPercentage() > 80 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : calculateContingencyPercentage() > 60 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{width: `${Math.min(calculateContingencyPercentage(), 100)}%`}} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}