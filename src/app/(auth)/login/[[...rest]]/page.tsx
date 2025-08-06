// src/app/(auth)/login/[[...rest]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Check if user is already signed in
  const user = await currentUser();
  if (user) {
    redirect('/subscription/setup');
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-2xl">PropVortex</span>
        </Link>
      </div>
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-gray-600 text-center">Sign in to your builder account</p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
      
      <p className="mt-6 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
          Start your free trial
        </Link>
      </p>
    </div>
  );
}