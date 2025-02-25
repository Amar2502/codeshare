import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceDashboardClient from "./WorkspaceDashboardClient";
import { NotLoggedInError } from "./NotLogged";

type PageProps = {
  params: {
    username: string;
  };
};

console.log(typeof NotLoggedInError);


export default async function WorkspaceDashboardPage({ params }: PageProps) {

  const param = await params

  const name = await param.username;

  if (!param || !name) {
    return <div>Error: Parameters not found</div>;
  }

  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const loggedInUsername = session.user.name;

  if (name !== loggedInUsername) {
    return <NotLoggedInError />;
  }

  const profileimage = session.user.image || "/default-avatar.png";
  const user_name = session.user.name || "";
  const projects = (session.user as any).projects || [];

  return (
    <WorkspaceDashboardClient 
      profileimage={profileimage}
      projects={projects}
      username={user_name}
    />
  );
}
