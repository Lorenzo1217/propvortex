'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface ControlEstimateSafeProps {
  formId?: string;
}

export function ControlEstimateSafe({ formId }: ControlEstimateSafeProps) {
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
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Control Estimate feature temporarily disabled for maintenance</p>
        </div>
      </CardContent>
    </Card>
  );
}