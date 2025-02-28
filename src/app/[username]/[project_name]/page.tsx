"use server";

import { auth } from "@/auth";
import EditorClient from "./EditorClient";
import { redirect } from "next/navigation";


export default async function EditorPage() {
  
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const loggedInUsername = session.user.name as string;

  return <EditorClient loggedIn_name={loggedInUsername}  />;
}