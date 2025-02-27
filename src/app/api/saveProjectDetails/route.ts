import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

type ProjectUpdateRequest = {
  project_name: string;
  newProjectName: string;
  newProjectDescription: string;
};

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      project_name,
      newProjectName,
      newProjectDescription,
    }: ProjectUpdateRequest = await req.json();

    if (!project_name || !newProjectName || !newProjectDescription) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find project by initial name
    const projectIndex = user.projects.findIndex(
      (p: { project_name: string }) => p.project_name === project_name
    );

    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update project name and description
    user.projects[projectIndex].project_name = newProjectName;
    user.projects[projectIndex].project_description = newProjectDescription;

    // Save the updated user document
    await user.save();

    return NextResponse.json(
      { message: "Project details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
