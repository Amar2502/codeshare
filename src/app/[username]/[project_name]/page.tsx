"use server"

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

  if (!param) {
    return <div>Error: Parameters not found</div>;
  }

  const session = await auth();
  
    if (!session?.user) {
      redirect('/');
    }

  // Ensure params are awaited before use
  const { username, project_name } = param; 

  const loggedInUsername = session.user.name;
  
    if (username !== loggedInUsername) {
      return <NotLoggedInError/>;
    }

  if (!username || !project_name) {
    return <div>Error: Parameters not found</div>;
  }
  
  // const response = await getProjectDetails(project_name);  
  // const projectDetails = response.project;
  // console.log(projectDetails)

  // if (!projectDetails) {
  //   return <div>Project not found</div>;
  // }

  // return <EditorClient />
  return <EditorClient user_name={username} project_name={project_name}/>
  // return <h1>Hello World</h1>;
}
