// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceDashboardClient from "./WorkspaceDashboardClient";

export default async function WorkspaceDashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/');
  }

  const profileimage = session.user.image || "/default-avatar.png";
  const projects = (session.user as any).projects || [];

  return (
    <WorkspaceDashboardClient 
      profileimage={profileimage}
      projects={projects}
    />
  );
}