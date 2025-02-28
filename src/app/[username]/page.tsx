import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceDashboardClient from "./WorkspaceDashboardClient";
// import { NotLoggedInError } from "./NotLogged";

type SessionUser = {
    name: string;
    id: string;
    projects: []
}


export default async function WorkspaceDashboardPage() {

  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const profileimage = session.user.image || "/default-avatar.png";
  const user_name = session.user.name || "";
  const projects = (session.user as SessionUser).projects || [];

  return (
    <WorkspaceDashboardClient 
      profileimage={profileimage}
      projects={projects}
      username={user_name}
    />
  );
}
