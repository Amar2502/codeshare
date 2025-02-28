"use server";

import { auth } from "@/auth";
import EditorClient from "./EditorClient";
import { redirect } from "next/navigation";
import { NotLoggedInError } from "../NotLogged";

type PageProps = {
  params: {
    username: string;
    project_name: string;
  };
};

export default async function EditorPage({ params }: PageProps) {
  if (!params) {
    return <div>Error: Parameters not found</div>;
  }

  const { username, project_name } = params; // No need to await

  if (!username || !project_name) {
    return <div>Error: Parameters missing</div>;
  }

  const session = await auth();

  if (!session?.user) {
    redirect('/'); // Ensures Next.js handles redirection properly
  }

  const loggedInUsername = session.user.name;

  if (username !== loggedInUsername) {
    return <NotLoggedInError />;
  }

  return <EditorClient user_name={username} project_name={project_name} />;
}
