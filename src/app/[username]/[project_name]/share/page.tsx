"use server"

import ShareClient from "./ShareClient";

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

  const pname = decodeURIComponent(project_name)

  return <ShareClient  project_name={pname}/>
}
