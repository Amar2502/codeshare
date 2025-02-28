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

  const param = await params;

  // Ensure params exist and have required fields
  if (!param?.username || !param?.project_name) {
    return <div>Error: Parameters missing</div>;
  }

  const { username, project_name } = param;

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
