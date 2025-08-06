import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already signed in
  const user = await currentUser();
  if (user) {
    redirect('/subscription/setup');
  }

  return <>{children}</>;
}