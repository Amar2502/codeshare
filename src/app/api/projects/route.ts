import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { auth } from "@/auth";
import User from "@/models/user";

type Project = {
  project_name: string,
  project_description: string,
  files: {
    html: string,
    css: string,
    javascript: string
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Extract pname from the query string: /api/projects?pname=MyProject
    const pname = request.nextUrl.searchParams.get("pname");

    if (!pname) {
      return NextResponse.json({ success: false, error: "Project name is required" }, { status: 400 });
    }

    const userProjects = Array.isArray(user.projects) ? user.projects : [];
    const project = userProjects.find((p: Project) => p.project_name === pname);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
