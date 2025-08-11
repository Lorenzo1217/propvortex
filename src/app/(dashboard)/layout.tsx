import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <img 
                  src="/logo2.svg" 
                  alt="PropVortex" 
                  className="h-8 w-8"
                />
                <span className="font-bold text-xl hidden sm:block">PropVortex</span>
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
      <main>{children}</main>
    </div>
  );
}