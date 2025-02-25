import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  };
};

export async function GET(req: Request) {
  try {
    // Extract query parameters from URL
    const url = new URL(req.url);
    const user_name = url.searchParams.get("user_name");
    const project_name = url.searchParams.get("project_name");

    console.log("server", user_name, project_name);
    

    if (!user_name || !project_name) {
      return NextResponse.json(
        { error: "Project name and User name are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user
    const user = await User.findOne({ name: user_name });

    console.log(user);
    

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find project by name
    const project = user.projects.find(
      (p: Project) => p.project_name === project_name
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
