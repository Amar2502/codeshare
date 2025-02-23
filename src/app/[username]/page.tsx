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
  const username = session.user.name || "";
  const projects = (session.user as any).projects || [];

  return (
    <WorkspaceDashboardClient 
      profileimage={profileimage}
      projects={projects}
      username={username}
    />
  );
}