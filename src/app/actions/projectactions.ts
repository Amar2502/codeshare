"use server"

import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";

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

        return { success: true, message: "Project added successfully", redirect_url: `/${user.name}/${formData.get("pname")}` };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false };
    }
};

export default createNewProject
