import React from "react";
import { Plus, MoreVertical, Trash2, Share, Globe } from "lucide-react";
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
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const WorkspaceDashboard:React.FC = async () => {

  const session = await auth();
    console.log("..........", session);
    const name = session?.user?.name
  
    if(!name) redirect(`/`)

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 overflow-auto">
        <div className="bg-gray-800 p-6 shadow-lg border-b border-gray-700">
          <div className="flex justify-between items-center h-3">
            <h2 className="text-2xl font-bold text-gray-100">Welcome</h2>
            <Dialog>
              <DialogTrigger className="bg-purple-500 text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md cursor-pointer">
                <Plus size={20} />
                New Project
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">
                    Create a New Project
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Please provide the project name and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Project Name
                    </label>
                    <Input
                      placeholder="Enter project name"
                      className="mt-2 bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Project Description
                    </label>
                    <textarea
                      placeholder="Enter project description"
                      className="mt-2 p-2 rounded-md w-full min-h-16 bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="bg-purple-500 text-gray-100 px-6 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Create Project
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-black-900/20 hover:shadow-2xl transition-all duration-200 p-6 border border-gray-800 hover:border-purple-400 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">
                  <Globe size={24} className="text-purple-400" />
                </span>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-gray-300 hover:text-gray-250 focus:outline-none">
                      <MoreVertical size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-800">
                      <DropdownMenuItem className="flex items-center bg-red-900 text-red-200 hover:text-red-700 cursor-pointer">
                        <Trash2 size={16} />
                        Delete Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center mt-2 bg-blue-900 text-blue-200 hover:text-blue-700 cursor-pointer">
                        <Share size={16} />
                        Share Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">
                Project Name
              </h3>
              <p className="text-sm text-gray-300 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                Project Description
              </p>
              <div className="text-sm text-gray-300">Last modified: Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDashboard;