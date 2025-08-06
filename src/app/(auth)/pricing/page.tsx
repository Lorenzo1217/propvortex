import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers } from "@/config/pricing";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12">
      {/* Logo */}
      <div className="mb-12">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-2xl">PropVortex</span>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Start with a 30-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {pricingTiers.map((tier) => {
          const isUnlimited = tier.name === "Unlimited";
          const planParam = tier.name.toLowerCase();
          
          return (
            <Card 
              key={tier.name} 
              className={cn(
                "relative flex flex-col",
                isUnlimited && "border-blue-600 border-2"
              )}
            >
              {isUnlimited && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-blue-600">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="mt-2">
                  {tier.projectLimit ? `Up to ${tier.projectLimit} projects` : 'Unlimited projects'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6">
                <Button 
                  asChild 
                  className={cn(
                    "w-full",
                    isUnlimited ? "bg-blue-600 hover:bg-blue-700" : ""
                  )}
                  variant={isUnlimited ? "default" : "outline"}
                >
                  <Link href={`/signup?plan=${planParam}`}>
                    Start 30-Day Free Trial
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Footer Links */}
      <p className="mt-12 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}