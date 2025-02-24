"use server"

import { getProjectDetails } from "@/app/actions/projectactions";
import EditorClient from "./EditorClient";

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

  // Ensure params are awaited before use
  const { username, project_name } = await params; 

  if (!username || !project_name) {
    return <div>Error: Parameters not found</div>;
  }

  console.log(username, project_name);
  
  // const response = await getProjectDetails(project_name);  
  // const projectDetails = response.project;
  // console.log(projectDetails)

  // if (!projectDetails) {
  //   return <div>Project not found</div>;
  // }

  // return <EditorClient />
  return <EditorClient name={username} project={project_name}/>
  // return <h1>Hello World</h1>;
}
