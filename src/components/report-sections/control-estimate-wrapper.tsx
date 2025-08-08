'use client';

import { useState, useRef, useEffect } from 'react';
import { ControlEstimate } from './control-estimate';

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

interface ControlEstimateWrapperProps {
  initialData?: ControlEstimateData;
  formId: string;
}

export function ControlEstimateWrapper({ initialData, formId }: ControlEstimateWrapperProps) {
  const [data, setData] = useState<ControlEstimateData>(initialData || {});
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Add hidden inputs on mount and when form submits
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    const handleSubmit = (e: Event) => {
      // Remove existing hidden inputs
      form.querySelectorAll('input[name^="ce"]').forEach(input => input.remove());
      
      // Add new hidden inputs with current data
      Object.entries(dataRef.current).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        // Special handling for FFE field
        const fieldName = key === 'ffe' ? 'ceFFE' : `ce${key.charAt(0).toUpperCase() + key.slice(1)}`;
        input.name = fieldName;
        input.value = value || '';
        form.appendChild(input);
      });
    };

    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }, [formId]);

  return (
    <ControlEstimate
      isEditing={true}
      initialData={initialData}
      onChange={setData}
    />
  );
}