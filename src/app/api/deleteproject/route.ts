import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

type ProjectUpdateRequest = {
  project_name: string;
  html?: string;
  css?: string;
  javascript?: string;
};

type Project = {
  project_name: string,
  project_description: string,
  files: {
    html: string,
    css: string,
    javascript: string
  }
}
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_name }: ProjectUpdateRequest = await req.json();

    console.log(project_name);
    

    if (!project_name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    await dbConnect();

    // Find the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find project by name
    const projectIndex = user.projects.findIndex((p: Project) => p.project_name === project_name);

    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    user.projects.splice(projectIndex, 1);

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: `Project - ${project_name} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
