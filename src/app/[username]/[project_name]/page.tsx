"use server";

import { auth } from "@/auth";
import EditorClient from "./EditorClient";
import { redirect } from "next/navigation";
import { NotLoggedInError } from "../NotLogged";

// Correct PageProps type definition
type PageProps = {
  params: {
    username: string;
    project_name: string;
  };
};

// Remove async from params since they're already resolved by Next.js
export default async function EditorPage({ params }: PageProps) {
  // No need to await params - Next.js provides them synchronously
  const { username, project_name } = params;

  // Check for missing parameters
  if (!username || !project_name) {
    return <div>Error: Parameters missing</div>;
  }

  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const loggedInUsername = session.user.name;

  if (username !== loggedInUsername) {
    return <NotLoggedInError />;
  }

  return <EditorClient user_name={username} project_name={project_name} />;
}