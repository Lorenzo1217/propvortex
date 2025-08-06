'use client';

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function PaymentButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full" 
      size="lg" 
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Continue to Payment'
      )}
    </Button>
  );
}