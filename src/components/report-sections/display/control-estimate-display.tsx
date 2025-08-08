import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface ControlEstimateDisplayProps {
  data: {
    professionalFees?: string | null;
    constructionCosts?: string | null;
    offsiteUtilities?: string | null;
    ffe?: string | null;
    insuranceFinancing?: string | null;
    total?: string | null;
    contingency?: string | null;
    contingencyUsed?: string | null;
  };
}

export function ControlEstimateDisplay({ data }: ControlEstimateDisplayProps) {
  // Parse currency string to number
  const parseCurrency = (value: string | null | undefined): number => {
    if (!value) return 0;
    return parseFloat(String(value).replace(/[^0-9.-]/g, '') || '0');
  };

  // Format number with thousand separators
  const formatCurrency = (value: string | null | undefined): string => {
    if (!value) return '0';
    const num = parseCurrency(value);
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Calculate contingency percentage
  const calculateContingencyPercentage = (): number => {
    const used = parseCurrency(data.contingencyUsed);
    const total = parseCurrency(data.contingency);
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  // Determine contingency status
  const getContingencyStatus = () => {
    const percentage = calculateContingencyPercentage();
    if (percentage > 80) return { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle };
    if (percentage > 60) return { color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp };
  };

  const hasData = data.professionalFees || data.constructionCosts || data.offsiteUtilities || 
                  data.ffe || data.insuranceFinancing || data.total || data.contingency;

  if (!hasData) {
    return null;
  }

  const contingencyStatus = getContingencyStatus();

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
          {data.contingency && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${contingencyStatus.bg}`}>
              <contingencyStatus.icon className={`w-4 h-4 ${contingencyStatus.color}`} />
              <span className={`text-sm font-medium ${contingencyStatus.color}`}>
                {calculateContingencyPercentage()}% Contingency Used
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-8 py-6">
        <div className="space-y-1">
          {/* Main line items */}
          <div className="space-y-0">
            {data.professionalFees && (
              <div className="flex justify-between py-3 hover:bg-gray-50/50 -mx-4 px-4 rounded transition-all duration-200">
                <span className="text-gray-700 font-light">Professional Fees</span>
                <span className="font-medium text-gray-900 tabular-nums">${formatCurrency(data.professionalFees)}</span>
              </div>
            )}
            {data.constructionCosts && (
              <div className="flex justify-between py-3 hover:bg-gray-50/50 -mx-4 px-4 rounded transition-all duration-200">
                <span className="text-gray-700 font-light">Construction Costs</span>
                <span className="font-medium text-gray-900 tabular-nums">${formatCurrency(data.constructionCosts)}</span>
              </div>
            )}
            {data.offsiteUtilities && (
              <div className="flex justify-between py-3 hover:bg-gray-50/50 -mx-4 px-4 rounded transition-all duration-200">
                <span className="text-gray-700 font-light">Offsite Utilities</span>
                <span className="font-medium text-gray-900 tabular-nums">${formatCurrency(data.offsiteUtilities)}</span>
              </div>
            )}
            {data.ffe && (
              <div className="flex justify-between py-3 hover:bg-gray-50/50 -mx-4 px-4 rounded transition-all duration-200">
                <span className="text-gray-700 font-light">FFE</span>
                <span className="font-medium text-gray-900 tabular-nums">${formatCurrency(data.ffe)}</span>
              </div>
            )}
            {data.insuranceFinancing && (
              <div className="flex justify-between py-3 hover:bg-gray-50/50 -mx-4 px-4 rounded transition-all duration-200">
                <span className="text-gray-700 font-light">Insurance & Financing</span>
                <span className="font-medium text-gray-900 tabular-nums">${formatCurrency(data.insuranceFinancing)}</span>
              </div>
            )}
          </div>
          
          {/* Total row */}
          {data.total && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between py-3 -mx-4 px-4">
                <span className="text-gray-900 font-medium text-lg">Total</span>
                <span className="font-semibold text-gray-900 text-xl tabular-nums">${formatCurrency(data.total)}</span>
              </div>
            </div>
          )}
          
          {/* Contingency section */}
          {(data.contingency || data.contingencyUsed) && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-700 font-light">Project Contingency</p>
                    <p className="text-sm text-gray-500 mt-1">Original allocation</p>
                  </div>
                  <span className="font-medium text-gray-900 text-lg tabular-nums">${formatCurrency(data.contingency)}</span>
                </div>
                
                {/* Progress bar for contingency usage */}
                {data.contingencyUsed && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount Used</span>
                      <span className="font-medium text-gray-900 tabular-nums">
                        ${formatCurrency(data.contingencyUsed)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          calculateContingencyPercentage() > 80 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : calculateContingencyPercentage() > 60 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                        }`}
                        style={{width: `${Math.min(calculateContingencyPercentage(), 100)}%`}} 
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {100 - calculateContingencyPercentage()}% remaining
                      </span>
                      <span className={`font-medium ${
                        calculateContingencyPercentage() > 80 
                          ? 'text-red-600' 
                          : calculateContingencyPercentage() > 60 
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        ${formatCurrency((parseCurrency(data.contingency) - parseCurrency(data.contingencyUsed)).toString())} available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}