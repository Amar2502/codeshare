import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceDashboardClient from "./WorkspaceDashboardClient";
// import { NotLoggedInError } from "./NotLogged";

type Project = {
  project_name: string,
  project_description: string,
  files: {
    html: string,
    css: string,
    javascript: string
  }
}

type SessionUser = {
    name: string;
    id: string;
    projects: Project[]
}


export default async function WorkspaceDashboardPage() {

  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const profileimage = session.user.image || "/default-avatar.png";
  const user_name = session.user.name || "";
  const projects = ((session.user as unknown) as SessionUser).projects || [];

  return (
    <WorkspaceDashboardClient 
      profileimage={profileimage}
      projects={projects}
      username={user_name}
    />
  );
}
