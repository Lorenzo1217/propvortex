import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { BrandProvider } from "@/components/providers/brand-provider";
import { db } from "@/lib/db";
import { Building2 } from "lucide-react";
import PropVortexFooter from "@/components/propvortex-footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  // Get user's company for branding
  let company = null;
  if (userId) {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { companyRelation: true }
    });
    company = user?.companyRelation;
  }

  return (
    <BrandProvider company={company || null} isClient={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <nav className="bg-white border-b header-brand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  {company?.logoUrl ? (
                    <img 
                      src={company.logoUrl} 
                      alt={company.name} 
                      className="h-8 w-auto max-w-[150px]"
                    />
                  ) : (
                    <>
                      <Building2 className="h-8 w-8 brand-accent" />
                      <span className="font-bold text-xl hidden sm:block brand-primary">
                        {company?.name || "PropVortex"}
                      </span>
                    </>
                  )}
                </Link>
                
                <DashboardNav />
              </div>
              
              <div className="flex items-center space-x-4">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
        
        {/* PropVortex Footer */}
        <PropVortexFooter />
      </div>
    </BrandProvider>
  );
}