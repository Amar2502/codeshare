"use client";

import { useEffect, useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  FileText,
  FileJson,
  FileCode,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Share,
  Settings,
  Download,
  PlayCircle,
  StepBack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import LoadingEditor from "./EditorLoading";
import JSZip from "jszip";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type FileType = "html" | "css" | "js";

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  };
};

type EditorClientProps = {
  loggedIn_name: string;
};

// Map file types to languages and icons
const fileTypeConfig = {
  html: { language: "html", icon: FileText },
  css: { language: "css", icon: FileJson },
  js: { language: "javascript", icon: FileCode },
};

const EditorClient = ({ loggedIn_name }: EditorClientProps) => {
  const [userProject, setUserProject] = useState<Project | null>(null);
  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [fileContents, setFileContents] = useState<Record<FileType, string>>({
    html: "",
    css: "",
    js: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projectName, setProjectName] = useState(
    userProject?.project_name || ""
  );
  const [projectDescription, setProjectDescription] = useState(
    userProject?.project_description || ""
  );

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if(loggedIn_name!=params.username) {
      redirect("/")
    }
  }, [loggedIn_name, params])

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!params.project_name) return; // Prevent fetching if project_name is missing
  
      try {
        setIsLoading(true);
        const res = await fetch(`/api/projects?pname=${encodeURIComponent(params.project_name as string)}`);
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch project details");
        }
  
        setUserProject(data.project);
        setFileContents({
          html: data.project.files.html || "",
          css: data.project.files.css || "",
          js: data.project.files.javascript || "",
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProjectDetails();
  }, [params.project_name]); // Ensure it runs when project_name changes
  

  const handleCodeChange = (value: string | undefined) => {
    setFileContents((prev) => ({
      ...prev,
      [activeFile]: value || "",
    }));
  };

  const combinedCode = useMemo(() => {
    const { html, css, js } = fileContents;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html.replace(/<!DOCTYPE html>|<\/?html>|<\/?body>/g, "")}
          <script>${js}</script>
        </body>
      </html>
    `;
  }, [fileContents]);

  const getFileIcon = (type: FileType) => {
    const Icon = fileTypeConfig[type].icon;
    return <Icon className="w-4 h-4" />;
  };

  if (isLoading) {
    return <LoadingEditor />;
  }

  const handleSaveChanges = async () => {
    try {
      if (!params.project_name) {
        console.error("Error: Project name is missing");
        return;
      }

      const res = await fetch("/api/saveproject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: decodeURIComponent(params.project_name as string),
          html: fileContents.html || "", // Ensure it's not undefined
          css: fileContents.css || "",
          javascript: fileContents.js || fileContents.js || "", // Use correct field name
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Server Error:",
          data.error || "Failed to update project"
        );
        return;
      }

      console.log("Project updated successfully:", data);
      toast("Changes saved successfully", {
        style: { backgroundColor: "#8DF19E", color: "#1A1325" },
      });
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleShareCode = async () => {
    const currentUrl = window.location.href;
    const copyURL = currentUrl + "/" + "website";
    navigator.clipboard.writeText(copyURL);
    toast(`Share link copied successfully ${copyURL} `, {
      style: { backgroundColor: "#29b3f2", color: "#1A1325" },
    });
  };

  const handleDownloadFile = async () => {
    const zip = new JSZip();

    zip.file("index.html", fileContents.html);
    zip.file("styles.css", fileContents.css);
    zip.file("script.js", fileContents.js);

    const blob = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "project.zip";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

    toast("File is being downloaded", {
      style: { backgroundColor: "#8DF19E", color: "#1A1325" },
    });
  };

  const handleProjectDetailSave = async () => {
    try {
      const res = await fetch("/api/saveProjectDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: decodeURIComponent(params.project_name as string),
          newProjectName: projectName,
          newProjectDescription: projectName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Server Error:",
          data.error || "Failed to update project"
        );
        return;
      }
      toast("Details changed successfully", {
        style: { backgroundColor: "#8DF19E", color: "#1A1325" },
      });
      router.replace(`/${params.username}/${projectName}`);
      return data;
    } catch (error) {
      console.error("Error updating Details:", error);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex bg-gray-100 text-black">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col",
            isSidebarOpen ? "w-44" : "w-14"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex items-center gap-3">
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              <h1 className="font-semibold text-white">
                {userProject?.project_name}
              </h1>
              <p className="text-xs text-gray-400 truncate overflow-hidden whitespace-nowrap">
                {userProject?.project_description}
              </p>
            </div>
          </div>

          {/* Sidebar Files List */}
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-2 space-y-2">
              <h2
                className={cn(
                  "text-xs font-semibold text-gray-300 uppercase tracking-wider transition-all duration-300",
                  !isSidebarOpen ? "opacity-0 w-0 h-0" : "opacity-100 w-auto"
                )}
              >
                Files
              </h2>
              <div className="space-y-1">
                {(["html", "css", "js"] as const).map((type) => (
                  <Tooltip key={`file-${type}`}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300",
                          isSidebarOpen ? "w-full px-4" : "w-12 justify-center",
                          activeFile === type && "bg-gray-700 text-white"
                        )}
                        onClick={() => setActiveFile(type)}
                      >
                        {getFileIcon(type)}
                        <span
                          className={cn(
                            "transition-all duration-300 overflow-hidden",
                            !isSidebarOpen
                              ? "opacity-0 w-0"
                              : "opacity-100 w-auto"
                          )}
                        >
                          {type === "html"
                            ? "index.html"
                            : type === "css"
                            ? "styles.css"
                            : type === "js"
                            ? "scripts.js"
                            : "unknown"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    {!isSidebarOpen && <TooltipContent>{type}</TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="h-14 border-b border-gray-700 bg-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-300 hover:text-purple-800"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    {isSidebarOpen ? (
                      <PanelLeftClose className="h-5 w-5" />
                    ) : (
                      <PanelLeftOpen className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Sidebar</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              {[
                {
                  icon: Save,
                  action: handleSaveChanges,
                  label: "Save Project",
                  hover: "hover:text-green-500",
                },
                {
                  icon: Share,
                  action: handleShareCode,
                  label: "Share Project",
                  hover: "hover:text-blue-500",
                },
                {
                  icon: Download,
                  action: handleDownloadFile,
                  label: "Download Files",
                  hover: "hover:text-red-500",
                },
                {
                  icon: PlayCircle,
                  action: () =>
                    window.open(`${window.location.pathname}/view`, "_blank"),
                  label: "View in New Tab",
                  hover: "hover:text-green-500",
                },
                {
                  icon: StepBack,
                  action: () => router.push(`/${params.username}`),
                  label: "Dashboard",
                  hover: "hover:text-blue-500",
                },
              ].map(({ icon: Icon, action, label, hover }) => (
                <Tooltip key={`nav-${label}`}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={action}
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 text-gray-300 ${hover}`}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-300 hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gray-900 text-white border border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Edit Project Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Update your project name and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Project Name
                    </label>
                    <Input
                      className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-gray-500"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      required={true}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Project Description
                    </label>
                    <textarea
                      className="mt-1 w-full h-24 bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:ring-gray-500"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      required={true}
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button className="border-gray-600 text-gray-300 hover:text-white">
                    Cancel
                  </Button>
                  <Button
                    className="bg-gray-700 hover:bg-blue-500 text-white"
                    onClick={handleProjectDetailSave}
                  >
                    Change
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Editor and Preview */}
          <div className="flex-1">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={55}>
                <div className="h-[calc(100vh-3.5rem)] relative bg-gray-200">
                  <div className="absolute inset-0">
                    <Editor
                      height="100%"
                      language={fileTypeConfig[activeFile].language}
                      theme="vs-dark"
                      value={fileContents[activeFile]}
                      onChange={handleCodeChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        padding: { top: 16 },
                        scrollbar: { verticalScrollbarSize: 8 },
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle className="bg-gray-700 w-px" />
              <ResizablePanel defaultSize={45}>
                <div className="h-[calc(100vh-3.5rem)] bg-white">
                  <iframe
                    title="preview"
                    srcDoc={combinedCode}
                    className="w-full h-full"
                    sandbox="allow-scripts"
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorClient;
