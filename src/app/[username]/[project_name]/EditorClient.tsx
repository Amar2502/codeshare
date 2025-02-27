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
  Code,
  FileText,
  FileJson,
  FileCode,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Share,
  Settings,
  Download,
  Copy,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"
import LoadingEditor from "./EditorLoading";
import JSZip from "jszip";
import { useRouter } from "next/navigation";

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
  user_name: string;
  project_name: string;
};

// Map file types to languages and icons
const fileTypeConfig = {
  html: { language: "html", icon: FileText },
  css: { language: "css", icon: FileJson },
  js: { language: "javascript", icon: FileCode },
};

const EditorClient = ({ user_name, project_name }: EditorClientProps) => {
  const [userProject, setUserProject] = useState<Project | null>(null);
  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [fileContents, setFileContents] = useState<Record<FileType, string>>({
    html: "",
    css: "",
    js: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/projects/${project_name}`);
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
  }, [project_name]);

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
      if (!project_name) {
        console.error("Error: Project name is missing");
        return;
      }

      const res = await fetch("/api/saveproject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: decodeURIComponent(project_name),
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
        style: { backgroundColor: "#8DF19E", color: "#1A1325" } 
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
      style: { backgroundColor: "#8DF19E", color: "#1A1325" } 
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex bg-black">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-zinc-950 border-r border-purple-900/20 transition-all duration-300 flex flex-col",
            isSidebarOpen ? "w-44" : "w-14"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-purple-900/20 flex items-center gap-3">
            {/* <Code className="h-6 w-6 text-purple-400" /> */}
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              <h1 className="font-semibold text-white">
                {userProject?.project_name}
              </h1>
              <p className="text-xs text-purple-400 truncate overflow-hidden whitespace-nowrap">
                {userProject?.project_description}
              </p>
            </div>
          </div>

          {/* Sidebar Files List */}
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-2 space-y-2">
              <h2
                className={cn(
                  "text-xs font-semibold text-purple-300/70 uppercase tracking-wider transition-all duration-300",
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
                          "flex items-center justify-start gap-3 text-purple-100/70 hover:text-purple-100 hover:bg-purple-500/10 transition-all duration-300",
                          isSidebarOpen ? "w-full px-4" : "w-12 justify-center",
                          activeFile === type &&
                            "bg-purple-500/20 text-purple-100"
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
                    {!isSidebarOpen && (
                      <TooltipContent>
                        {type === "html"
                          ? "index.html"
                          : type === "css"
                          ? "styles.css"
                          : type === "js"
                          ? "scripts.js"
                          : "unknown"}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="h-14 border-b border-purple-900/20 bg-zinc-950 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
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
              <Separator
                orientation="vertical"
                className="h-6 bg-purple-900/20"
              />
              <Tooltip key={`nav-SaveProject`}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSaveChanges}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Project</TooltipContent>
              </Tooltip>
              <Tooltip key={`nav-ShareProject`}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShareCode}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Project</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip key={`nav-DownloadFiles`}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadFile}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Files</TooltipContent>
              </Tooltip>
              <Tooltip key="nav-RunProject">
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      window.open(`${window.location.pathname}/view`, "_blank");
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <PlayCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View in New Tab</TooltipContent>
              </Tooltip>

              <Tooltip key={`nav-Dashboard`}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      router.push(`/${user_name}`);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <StepBack className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip key={`nav-Settings`}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-purple-400 hover:text-purple-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <Separator
                orientation="vertical"
                className="h-6 bg-purple-900/20"
              />
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="flex-1">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={55}>
                <div className="h-[calc(100vh-3.5rem)] relative bg-zinc-950">
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
                        scrollbar: {
                          verticalScrollbarSize: 8,
                        },
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-text hover:bg-text-700/20 w-px" />

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
