// app/dashboard/WorkspaceDashboardClient.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical, Trash2, Share, Globe, Code } from "lucide-react";
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

  return (
    <div className="flex h-screen bg-backgroundcolor">
      <div className="flex-1 overflow-auto">
        <div className="bg-secondarycolor px-6 py-3 shadow-lg border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-text">
              <Code className="h-8 w-8 text-accentcolor" />
              <span className="text-2xl font-bold">
                Code<span className="text-accentcolor">Share</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger className="bg-purple-500 text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md cursor-pointer">
                  <Plus size={20} />
                  New Project
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-gray-100">
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
                          className="mt-2 bg-gray-800 border-gray-700 text-gray-100"
                          name="pname"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Project Description
                        </label>
                        <textarea
                          placeholder="Enter project description"
                          className="mt-2 p-2 rounded-md w-full min-h-16 bg-gray-800 border-gray-700 text-gray-100 outline-none"
                          name="pdesc"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="bg-purple-500 text-gray-100 px-6 py-2 rounded-md hover:bg-purple-700 transition-colors">
                        Create Project
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <div className="flex items-center">
                <Image
                  className="rounded-full border-2 border-purple-500 hover:border-purple-400 transition-colors"
                  src={profileimage}
                  alt="Profile Image"
                  width={40}
                  height={40}
                  // unoptimized={true}
                />
              </div>
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
                <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-gray-700 hover:border-purple-400 group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">
                      <Globe
                        size={24}
                        className="text-purple-400 group-hover:text-purple-300 transition-colors"
                      />
                    </span>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-gray-400 hover:text-gray-200 focus:outline-none">
                          <MoreVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-700 border-gray-600">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.project_name);
                            }}
                            className="flex items-center gap-2 text-red-200 hover:text-red-100 hover:bg-red-900 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="flex items-center gap-2 text-blue-200 hover:text-blue-100 hover:bg-blue-900 transition-colors cursor-pointer"
                          >
                            <Share size={16} />
                            Share Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-purple-300 transition-colors">
                    {project.project_name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2 truncate overflow-hidden whitespace-nowrap">
                    {project.project_description}
                  </p>
                  <div className="text-xs text-gray-400">
                    Last modified: Date
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDashboardClient;
