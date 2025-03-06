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
  Code,
  Eye,
  Menu,
  X,
  Copy,
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
import JSZip from "jszip";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditorLoader from "./EditorLoader";
import { Label } from "@/components/ui/label";

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
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "split">(
    "split"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setViewMode("editor"); // Default to editor on mobile
      }
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (loggedIn_name != params.username) {
      redirect("/");
    }
  }, [loggedIn_name, params]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!params.project_name) return; // Prevent fetching if project_name is missing

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/projects?pname=${encodeURIComponent(
            params.project_name as string
          )}`
        );
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
        setProjectName(data.project.project_name || "");
        setProjectDescription(data.project.project_description || "");
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    return <EditorLoader />;
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
          javascript: fileContents.js || "", // Use correct field name
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

  const copyToClipboard = (link: string, type: "website" | "code"): void => {
    navigator.clipboard.writeText(link);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000); // Reset message after 2s
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

  const handleViewInNewTab = () => {
    window.open(`${window.location.pathname}/view`, "_blank");
  };

  const handleNavigateToDashboard = () => {
    router.push(`/${params.username}`);
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
          newProjectDescription: projectDescription,
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

  const toggleViewMode = (mode: "editor" | "preview" | "split") => {
    setViewMode(mode);
    if (isMobileView && mode === "preview") {
      setIsSidebarOpen(false);
    }
  };

  // Mobile Menu
  const MobileMenu = () => (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-90 z-50 ${
        isMobileMenuOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-white font-semibold">{projectName}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm font-medium">Files</h3>
              <div className="space-y-2">
                {(["html", "css", "js"] as const).map((type) => (
                  <Button
                    key={`mobile-file-${type}`}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                      activeFile === type && "bg-gray-700 text-white"
                    )}
                    onClick={() => {
                      setActiveFile(type);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {getFileIcon(type)}
                    <span>
                      {type === "html"
                        ? "index.html"
                        : type === "css"
                        ? "styles.css"
                        : "scripts.js"}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm font-medium">View Mode</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                    viewMode === "editor" && "bg-gray-700 text-white"
                  )}
                  onClick={() => {
                    toggleViewMode("editor");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Code className="h-4 w-4" />
                  <span>Editor Only</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                    viewMode === "preview" && "bg-gray-700 text-white"
                  )}
                  onClick={() => {
                    toggleViewMode("preview");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Only</span>
                </Button>
                {!isMobileView && (
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                      viewMode === "split" && "bg-gray-700 text-white"
                    )}
                    onClick={() => {
                      toggleViewMode("split");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                    <span>Split View</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-gray-300 text-sm font-medium">Actions</h3>
              <div className="space-y-2">
                {/* Save Button */}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    handleSaveChanges();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Project</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    handleShareCode();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Share className="h-4 w-4" />
                  <span>Share Project</span>
                </Button>

                {/* Download Button */}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    handleDownloadFile();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Files</span>
                </Button>

                {/* View in New Tab Button */}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    handleViewInNewTab();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>View in New Tab</span>
                </Button>

                {/* Dashboard Button */}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    handleNavigateToDashboard();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <StepBack className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex flex-col md:flex-row bg-gray-100 text-black">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Sidebar - Hidden on mobile unless opened */}
        <div
          className={cn(
            "bg-gray-800 border-r border-gray-700 transition-all duration-300 hidden md:flex md:flex-col",
            isSidebarOpen ? "md:w-44 lg:w-48" : "md:w-14",
            isMobileView &&
              isSidebarOpen &&
              "!fixed inset-y-0 left-0 z-40 flex flex-col w-64"
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

              {/* View Mode Buttons - Only visible when sidebar is open */}
              <div
                className={cn(
                  "pt-4 mt-4 border-t border-gray-700",
                  !isSidebarOpen && "hidden"
                )}
              >
                <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  View Mode
                </h2>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                      viewMode === "editor" && "bg-gray-700 text-white"
                    )}
                    onClick={() => toggleViewMode("editor")}
                  >
                    <Code className="h-4 w-4" />
                    <span>Editor</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                      viewMode === "preview" && "bg-gray-700 text-white"
                    )}
                    onClick={() => toggleViewMode("preview")}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700",
                      viewMode === "split" && "bg-gray-700 text-white"
                    )}
                    onClick={() => toggleViewMode("split")}
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                    <span>Split</span>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="h-14 border-b border-gray-700 bg-gray-800 flex items-center justify-between px-2 md:px-4">
            <div className="flex items-center">
              {/* Hamburger menu - mobile only */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-300 hover:text-white md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Sidebar toggle - desktop only */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-300 hover:text-white hidden md:flex"
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

              {/* View mode buttons - Mobile only */}
              <div className="flex items-center ml-2 md:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 text-gray-300",
                        viewMode === "editor" && "text-purple-400"
                      )}
                      onClick={() => toggleViewMode("editor")}
                    >
                      <Code className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Editor View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 text-gray-300",
                        viewMode === "preview" && "text-purple-400"
                      )}
                      onClick={() => toggleViewMode("preview")}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Preview View</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Middle - Project name on desktop */}
            <div className="hidden md:block">
              <h2 className="text-white font-medium truncate max-w-[200px]">
                {projectName}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile dropdown for actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {/* Save Project */}
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    onClick={handleSaveChanges}
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Project</span>
                  </DropdownMenuItem>

                  {/* Share Project */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-700">
                        <Share className="h-4 w-4" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Project</DialogTitle>
                        <DialogDescription>
                          Share your project with teammates or make it public.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {/* Download Files */}
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    onClick={handleDownloadFile}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Files</span>
                  </DropdownMenuItem>

                  {/* View in New Tab */}
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    onClick={handleViewInNewTab}
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>View in New Tab</span>
                  </DropdownMenuItem>

                  {/* Dashboard */}
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    onClick={handleNavigateToDashboard}
                  >
                    <StepBack className="h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop action buttons */}
              <div className="hidden md:flex items-center gap-1">
                {/* Save Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSaveChanges}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-300 hover:text-green-500"
                    >
                      <Save className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Project</TooltipContent>
                </Tooltip>

                {/* Share Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-300 hover:text-blue-500"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-gray-900 text-white border border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-100">
                        Share Link
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Anyone with these links can view your website or its
                        source code.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Website-only Link */}
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="website-link" className="sr-only">
                          Website Link
                        </Label>
                        <Input
                          id="website-link"
                          value={`https://codeshare.space/${params.username}/${params.project_name}/view`}
                          readOnly
                          className="bg-gray-800 text-gray-300 border-gray-700"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="px-3 bg-gray-700 hover:bg-gray-600"
                        onClick={() => copyToClipboard(`https://codeshare.space/${params.username}/${params.project_name}/view`, "website")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copied === "website" && (
                      <p className="text-green-400 text-sm mt-1">
                        Copied website link!
                      </p>
                    )}

                    {/* Website + Code Link */}
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="code-link" className="sr-only">
                          Website & Code Link
                        </Label>
                        <Input
                          id="code-link"
                          value={`https://codeshare.space/${params.username}/${params.project_name}/view`}
                          readOnly
                          className="bg-gray-800 text-gray-300 border-gray-700"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="px-3 bg-gray-700 hover:bg-gray-600"
                        onClick={() => copyToClipboard(`https://codeshare.space/${params.username}/${params.project_name}/view`, "code")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copied === "code" && (
                      <p className="text-green-400 text-sm mt-1">
                        Copied website & code link!
                      </p>
                    )}

                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-gray-700 hover:bg-gray-600 text-white"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Download Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDownloadFile}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-300 hover:text-red-500"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download Files</TooltipContent>
                </Tooltip>

                {/* View in New Tab Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleViewInNewTab}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-300 hover:text-green-500"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View in New Tab</TooltipContent>
                </Tooltip>

                {/* Dashboard Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleNavigateToDashboard}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-300 hover:text-yellow-500"
                    >
                      <StepBack className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Return to Dashboard</TooltipContent>
                </Tooltip>

                {/* Settings Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-300 hover:text-purple-500"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Project Settings</TooltipContent>
                    </Tooltip>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 text-white border border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Project Settings</DialogTitle>
                      <DialogDescription>
                        Update your project details
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="projectName" className="text-sm">
                          Project Name
                        </label>
                        <Input
                          id="projectName"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="projectDescription" className="text-sm">
                          Description
                        </label>
                        <Input
                          id="projectDescription"
                          value={projectDescription}
                          onChange={(e) =>
                            setProjectDescription(e.target.value)
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleProjectDetailSave}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Editor and Preview Area */}
          <div className="flex-1 overflow-hidden">
            {viewMode === "split" ? (
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-0 h-full"
              >
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div className="h-full">
                    <Editor
                      height="100%"
                      defaultLanguage={fileTypeConfig[activeFile].language}
                      language={fileTypeConfig[activeFile].language}
                      theme="vs-dark"
                      value={fileContents[activeFile]}
                      onChange={handleCodeChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        tabSize: 2,
                      }}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div className="h-full bg-white">
                    <iframe
                      srcDoc={combinedCode}
                      title="preview"
                      className="w-full h-full border-none"
                      sandbox="allow-scripts"
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : viewMode === "editor" ? (
              <div className="h-full">
                <Editor
                  height="100%"
                  defaultLanguage={fileTypeConfig[activeFile].language}
                  language={fileTypeConfig[activeFile].language}
                  theme="vs-dark"
                  value={fileContents[activeFile]}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    tabSize: 2,
                  }}
                />
              </div>
            ) : (
              <div className="h-full bg-white">
                <iframe
                  srcDoc={combinedCode}
                  title="preview"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorClient;
