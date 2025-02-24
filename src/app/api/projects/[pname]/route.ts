import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { auth } from "@/auth";
import User from "@/models/user";

type ProjectUpdateRequest = {
  project_name: string;
  html?: string;
  css?: string;
  javascript?: string;
};

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  };
};

export async function GET(req: Request, { params }: { params: { pname: string } }) {
  try {
    await dbConnect(); // Ensure database connection

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userProjects = Array.isArray(user.projects) ? user.projects : [];
    const project = userProjects.find((p: any) => p.project_name === params.pname);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}