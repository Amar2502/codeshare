"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomePage from "./HomeClient";

export default async function EditorPage() {
  const session = await auth();

  if (session?.user) {
    redirect(`/${session.user.name}`);
  }
  return <HomePage />;
  // return <h1>Hello World</h1>;
}
