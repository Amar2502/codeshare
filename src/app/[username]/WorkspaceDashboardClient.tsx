// app/dashboard/WorkspaceDashboardClient.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  Trash2,
  Share,
  Globe,
  Code,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import createNewProject from "../actions/projectactions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  };
};

interface WorkspaceDashboardClientProps {
  profileimage: string;
  projects: Project[];
  username: string;
}

const WorkspaceDashboardClient: React.FC<WorkspaceDashboardClientProps> = ({
  profileimage,
  projects,
  username,
}) => {
  const router = useRouter();
  const params = useParams();

  if(params.username!=username) {
    router.replace(`/${username}`)
  }

  const handleDeleteProject = async (project_name: string) => {
    try {
      if (!project_name) {
        console.error("Error: Project name is missing");
        return;
      }

      const res = await fetch("/api/deleteproject", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Server Error:",
          data.error || "Failed to delete project"
        );
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return projects.length > 0 ? (
    <div className="flex h-screen bg-[#0D0F21]">
      <div className="flex-1 overflow-auto">
        <div className="bg-[#16182D] px-6 py-3 shadow-lg border-b border-[#232741]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Code className="h-8 w-8 text-[#A78BFA]" />
              <span className="text-2xl font-bold">
                Code<span className="text-[#A78BFA]">Share</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger className="bg-[#7b5dd8] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#8B5CF6] transition-colors shadow-md cursor-pointer">
                  <Plus size={20} />
                  New Project
                </DialogTrigger>
                <DialogContent className="bg-[#16182D] border border-[#232741] text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Create a New Project
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Please provide the project name and description.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    action={async (formData) => {
                      const response = await createNewProject(formData);
                      redirect(`${response.redirect_url}`);
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Project Name
                        </label>
                        <Input
                          placeholder="Enter project name"
                          className="mt-2 bg-[#232741] border-[#2C314E] text-white"
                          name="pname"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Project Description
                        </label>
                        <textarea
                          placeholder="Enter project description"
                          className="mt-2 p-2 rounded-md w-full min-h-16 bg-[#232741] border-[#2C314E] text-white outline-none"
                          name="pdesc"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="bg-[#6c53b7] text-white px-6 py-2 rounded-md hover:bg-[#8B5CF6] transition-colors">
                        Create Project
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <Image
                      className="rounded-full border-2 border-[#A78BFA] hover:border-[#8B5CF6] transition-colors"
                      src={profileimage}
                      alt="Profile Image"
                      width={40}
                      height={40}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 cursor-pointer"
                >
                  {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Change Profile Details
                </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Link
                key={project.project_name || index}
                href={`/${username}/${project.project_name}`}
              >
                <div className="bg-[#292c4d] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-[#232741] hover:border-[#A78BFA] group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">
                      <Globe
                        size={24}
                        className="text-[#A78BFA] group-hover:text-[#8B5CF6] transition-colors"
                      />
                    </span>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-gray-400 hover:text-gray-200 focus:outline-none">
                          <MoreVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#232741] border-[#2C314E]">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.project_name);
                            }}
                            className="flex items-center gap-2 text-red-300 hover:text-red-200 hover:bg-red-900 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 hover:bg-blue-900 transition-colors cursor-pointer"
                          >
                            <Share size={16} />
                            Share Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-[#A78BFA] transition-colors">
                    {project.project_name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 truncate overflow-hidden whitespace-nowrap">
                    {project.project_description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Last modified: Date
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-backgroundcolor flex items-center justify-center h-screen text-center text-gray-300 px-4">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col justify-center items-center">
        <h2 className="text-4xl font-extrabold text-white">
          No Projects Found
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          Kickstart your journey by creating your first project!
        </p>
        <Dialog>
          <DialogTrigger className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-3 hover:opacity-90 transition-all duration-300 shadow-lg cursor-pointer">
            <Plus size={22} />
            <span className="text-lg font-medium">New Project</span>
          </DialogTrigger>
          <DialogContent className="bg-[#16182D] border border-[#232741] text-white rounded-lg shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">
                Create a New Project
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Please provide the project name and description.
              </DialogDescription>
            </DialogHeader>
            <form
              action={async (formData) => {
                const response = await createNewProject(formData);
                redirect(`${response.redirect_url}`);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Project Name
                </label>
                <Input
                  placeholder="Enter project name"
                  className="mt-2 bg-[#232741] border border-[#2C314E] text-white rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-600"
                  name="pname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Project Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  className="mt-2 p-3 rounded-lg w-full min-h-[80px] bg-[#232741] border border-[#2C314E] text-white outline-none focus:ring-2 focus:ring-purple-600"
                  name="pdesc"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300">
                  Create Project
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkspaceDashboardClient;
