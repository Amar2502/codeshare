"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  },
}

const createNewProject = async (formData: FormData) => {
  try {
    await dbConnect(); // Ensure database connection

    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const email = session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const newProject = {
      project_name: formData.get("pname"),
      project_description: formData.get("pdesc"),
    };

    user.projects.push(newProject);
    await user.save();

    return {
      success: true,
      message: "Project added successfully",
      redirect_url: `/${user.name}/${formData.get("pname")}`,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false };
  }
};

const getProjectDetails = async (pname: string) => {
  try {
    await dbConnect(); // Ensure database connection

    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const email = session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const userProjects: typeof user.projects = Array.isArray(user.projects)
      ? user.projects
      : [];

    
    const project = userProjects.find((p: Project) => p.project_name === pname);

    if (!project) {
      throw new Error("Project not found");
    }

    return { success: true, project };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return { success: false };
  }
};

export default createNewProject;
