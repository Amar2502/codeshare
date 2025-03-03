// "use client";

// import { useEffect, useState, useMemo } from "react";
// import Editor from "@monaco-editor/react";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { cn } from "@/lib/utils";
// import {
//   FileText,
//   FileJson,
//   FileCode,
//   PanelLeftClose,
//   PanelLeftOpen,
//   Save,
//   Share,
//   Settings,
//   Download,
//   PlayCircle,
//   StepBack,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { toast } from "sonner";
// import LoadingEditor from "./EditorLoading";
// import JSZip from "jszip";
// import { redirect, useParams, useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// type FileType = "html" | "css" | "js";

// type Project = {
//   project_name: string;
//   project_description: string;
//   files: {
//     html: string;
//     css: string;
//     javascript: string;
//   };
// };

// type EditorClientProps = {
//   loggedIn_name: string;
// };

// // Map file types to languages and icons
// const fileTypeConfig = {
//   html: { language: "html", icon: FileText },
//   css: { language: "css", icon: FileJson },
//   js: { language: "javascript", icon: FileCode },
// };

// const EditorClient = ({ loggedIn_name }: EditorClientProps) => {
//   const [userProject, setUserProject] = useState<Project | null>(null);
//   const [activeFile, setActiveFile] = useState<FileType>("html");
//   const [fileContents, setFileContents] = useState<Record<FileType, string>>({
//     html: "",
//     css: "",
//     js: "",
//   });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [projectName, setProjectName] = useState(
//     userProject?.project_name || ""
//   );
//   const [projectDescription, setProjectDescription] = useState(
//     userProject?.project_description || ""
//   );

//   const router = useRouter();
//   const params = useParams();

//   useEffect(() => {
//     if(loggedIn_name!=params.username) {
//       redirect("/")
//     }
//   }, [loggedIn_name, params])

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       if (!params.project_name) return; // Prevent fetching if project_name is missing
  
//       try {
//         setIsLoading(true);
//         const res = await fetch(`/api/projects?pname=${encodeURIComponent(params.project_name as string)}`);
//         const data = await res.json();
  
//         if (!res.ok) {
//           throw new Error(data.error || "Failed to fetch project details");
//         }
  
//         setUserProject(data.project);
//         setFileContents({
//           html: data.project.files.html || "",
//           css: data.project.files.css || "",
//           js: data.project.files.javascript || "",
//         });
//       } catch (error) {
//         console.error("Error fetching project:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchProjectDetails();
//   }, [params.project_name]); // Ensure it runs when project_name changes
  

//   const handleCodeChange = (value: string | undefined) => {
//     setFileContents((prev) => ({
//       ...prev,
//       [activeFile]: value || "",
//     }));
//   };

//   const combinedCode = useMemo(() => {
//     const { html, css, js } = fileContents;
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>${css}</style>
//         </head>
//         <body>
//           ${html.replace(/<!DOCTYPE html>|<\/?html>|<\/?body>/g, "")}
//           <script>${js}</script>
//         </body>
//       </html>
//     `;
//   }, [fileContents]);

//   const getFileIcon = (type: FileType) => {
//     const Icon = fileTypeConfig[type].icon;
//     return <Icon className="w-4 h-4" />;
//   };

//   if (isLoading) {
//     return <LoadingEditor />;
//   }

//   const handleSaveChanges = async () => {
//     try {
//       if (!params.project_name) {
//         console.error("Error: Project name is missing");
//         return;
//       }

//       const res = await fetch("/api/saveproject", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           project_name: decodeURIComponent(params.project_name as string),
//           html: fileContents.html || "", // Ensure it's not undefined
//           css: fileContents.css || "",
//           javascript: fileContents.js || fileContents.js || "", // Use correct field name
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error(
//           "Server Error:",
//           data.error || "Failed to update project"
//         );
//         return;
//       }

//       console.log("Project updated successfully:", data);
//       toast("Changes saved successfully", {
//         style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//       });
//       return data;
//     } catch (error) {
//       console.error("Error updating project:", error);
//     }
//   };

//   const handleShareCode = async () => {
//     const currentUrl = window.location.href;
//     const copyURL = currentUrl + "/" + "website";
//     navigator.clipboard.writeText(copyURL);
//     toast(`Share link copied successfully ${copyURL} `, {
//       style: { backgroundColor: "#29b3f2", color: "#1A1325" },
//     });
//   };

//   const handleDownloadFile = async () => {
//     const zip = new JSZip();

//     zip.file("index.html", fileContents.html);
//     zip.file("styles.css", fileContents.css);
//     zip.file("script.js", fileContents.js);

//     const blob = await zip.generateAsync({ type: "blob" });

//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "project.zip";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(link.href);

//     toast("File is being downloaded", {
//       style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//     });
//   };

//   const handleProjectDetailSave = async () => {
//     try {
//       const res = await fetch("/api/saveProjectDetails", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           project_name: decodeURIComponent(params.project_name as string),
//           newProjectName: projectName,
//           newProjectDescription: projectName,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error(
//           "Server Error:",
//           data.error || "Failed to update project"
//         );
//         return;
//       }
//       toast("Details changed successfully", {
//         style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//       });
//       router.replace(`/${params.username}/${projectName}`);
//       return data;
//     } catch (error) {
//       console.error("Error updating Details:", error);
//     }
//   };

//   return (
//     <TooltipProvider delayDuration={0}>
//       <div className="h-screen flex bg-gray-100 text-black">
//         {/* Sidebar */}
//         <div
//           className={cn(
//             "bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col",
//             isSidebarOpen ? "w-44" : "w-14"
//           )}
//         >
//           {/* Sidebar Header */}
//           <div className="p-4 border-b border-gray-700 flex items-center gap-3">
//             <div
//               className={cn(
//                 "transition-all duration-300 overflow-hidden",
//                 !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
//               )}
//             >
//               <h1 className="font-semibold text-white">
//                 {userProject?.project_name}
//               </h1>
//               <p className="text-xs text-gray-400 truncate overflow-hidden whitespace-nowrap">
//                 {userProject?.project_description}
//               </p>
//             </div>
//           </div>

//           {/* Sidebar Files List */}
//           <ScrollArea className="h-[calc(100vh-5rem)]">
//             <div className="p-2 space-y-2">
//               <h2
//                 className={cn(
//                   "text-xs font-semibold text-gray-300 uppercase tracking-wider transition-all duration-300",
//                   !isSidebarOpen ? "opacity-0 w-0 h-0" : "opacity-100 w-auto"
//                 )}
//               >
//                 Files
//               </h2>
//               <div className="space-y-1">
//                 {(["html", "css", "js"] as const).map((type) => (
//                   <Tooltip key={`file-${type}`}>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className={cn(
//                           "flex items-center justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300",
//                           isSidebarOpen ? "w-full px-4" : "w-12 justify-center",
//                           activeFile === type && "bg-gray-700 text-white"
//                         )}
//                         onClick={() => setActiveFile(type)}
//                       >
//                         {getFileIcon(type)}
//                         <span
//                           className={cn(
//                             "transition-all duration-300 overflow-hidden",
//                             !isSidebarOpen
//                               ? "opacity-0 w-0"
//                               : "opacity-100 w-auto"
//                           )}
//                         >
//                           {type === "html"
//                             ? "index.html"
//                             : type === "css"
//                             ? "styles.css"
//                             : type === "js"
//                             ? "scripts.js"
//                             : "unknown"}
//                         </span>
//                       </Button>
//                     </TooltipTrigger>
//                     {!isSidebarOpen && <TooltipContent>{type}</TooltipContent>}
//                   </Tooltip>
//                 ))}
//               </div>
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Top Navigation Bar */}
//           <div className="h-14 border-b border-gray-700 bg-gray-800 flex items-center justify-between px-4">
//             <div className="flex items-center">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-9 w-9 text-gray-300 hover:text-purple-800"
//                     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                   >
//                     {isSidebarOpen ? (
//                       <PanelLeftClose className="h-5 w-5" />
//                     ) : (
//                       <PanelLeftOpen className="h-5 w-5" />
//                     )}
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Toggle Sidebar</TooltipContent>
//               </Tooltip>
//             </div>
//             <div className="flex items-center gap-2">
//               {[
//                 {
//                   icon: Save,
//                   action: handleSaveChanges,
//                   label: "Save Project",
//                   hover: "hover:text-green-500",
//                 },
//                 {
//                   icon: Share,
//                   action: handleShareCode,
//                   label: "Share Project",
//                   hover: "hover:text-blue-500",
//                 },
//                 {
//                   icon: Download,
//                   action: handleDownloadFile,
//                   label: "Download Files",
//                   hover: "hover:text-red-500",
//                 },
//                 {
//                   icon: PlayCircle,
//                   action: () =>
//                     window.open(`${window.location.pathname}/view`, "_blank"),
//                   label: "View in New Tab",
//                   hover: "hover:text-green-500",
//                 },
//                 {
//                   icon: StepBack,
//                   action: () => router.push(`/${params.username}`),
//                   label: "Dashboard",
//                   hover: "hover:text-blue-500",
//                 },
//               ].map(({ icon: Icon, action, label, hover }) => (
//                 <Tooltip key={`nav-${label}`}>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={action}
//                       variant="ghost"
//                       size="icon"
//                       className={`h-9 w-9 text-gray-300 ${hover}`}
//                     >
//                       <Icon className="h-5 w-5" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>{label}</TooltipContent>
//                 </Tooltip>
//               ))}
//             </div>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-9 w-9 text-gray-300 hover:text-white"
//                 >
//                   <Settings className="h-5 w-5" />
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md bg-gray-900 text-white border border-gray-700">
//                 <DialogHeader>
//                   <DialogTitle className="text-lg font-semibold">
//                     Edit Project Details
//                   </DialogTitle>
//                   <DialogDescription className="text-gray-400">
//                     Update your project name and description.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-300">
//                       Project Name
//                     </label>
//                     <Input
//                       className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-gray-500"
//                       value={projectName}
//                       onChange={(e) => setProjectName(e.target.value)}
//                       placeholder="Enter project name"
//                       required={true}
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-300">
//                       Project Description
//                     </label>
//                     <textarea
//                       className="mt-1 w-full h-24 bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:ring-gray-500"
//                       value={projectDescription}
//                       onChange={(e) => setProjectDescription(e.target.value)}
//                       placeholder="Enter project description"
//                       required={true}
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter className="flex justify-end space-x-2">
//                   <Button className="border-gray-600 text-gray-300 hover:text-white">
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-gray-700 hover:bg-blue-500 text-white"
//                     onClick={handleProjectDetailSave}
//                   >
//                     Change
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Editor and Preview */}
//           <div className="flex-1">
//             <ResizablePanelGroup direction="horizontal">
//               <ResizablePanel defaultSize={55}>
//                 <div className="h-[calc(100vh-3.5rem)] relative bg-gray-200">
//                   <div className="absolute inset-0">
//                     <Editor
//                       height="100%"
//                       language={fileTypeConfig[activeFile].language}
//                       theme="vs-dark"
//                       value={fileContents[activeFile]}
//                       onChange={handleCodeChange}
//                       options={{
//                         minimap: { enabled: false },
//                         fontSize: 14,
//                         wordWrap: "on",
//                         padding: { top: 16 },
//                         scrollbar: { verticalScrollbarSize: 8 },
//                       }}
//                     />
//                   </div>
//                 </div>
//               </ResizablePanel>
//               <ResizableHandle className="bg-gray-700 w-px" />
//               <ResizablePanel defaultSize={45}>
//                 <div className="h-[calc(100vh-3.5rem)] bg-white">
//                   <iframe
//                     title="preview"
//                     srcDoc={combinedCode}
//                     className="w-full h-full"
//                     sandbox="allow-scripts"
//                   />
//                 </div>
//               </ResizablePanel>
//             </ResizablePanelGroup>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default EditorClient;


// "use client";

// import { useEffect, useState, useMemo } from "react";
// import Editor from "@monaco-editor/react";
// import {
//   FileText,
//   FileJson,
//   FileCode,
//   PanelLeftClose,
//   PanelLeftOpen,
//   Save,
//   Share,
//   Settings,
//   Download,
//   PlayCircle,
//   StepBack,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { toast } from "sonner";
// import LoadingEditor from "./EditorLoading";
// import JSZip from "jszip";
// import { redirect, useParams, useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

// type FileType = "html" | "css" | "js";

// type Project = {
//   project_name: string;
//   project_description: string;
//   files: {
//     html: string;
//     css: string;
//     javascript: string;
//   };
// };

// type EditorClientProps = {
//   loggedIn_name: string;
// };

// const fileTypeConfig = {
//   html: { language: "html", icon: FileText },
//   css: { language: "css", icon: FileJson },
//   js: { language: "javascript", icon: FileCode },
// };

// const EditorClient = ({ loggedIn_name }: EditorClientProps) => {
//   const [userProject, setUserProject] = useState<Project | null>(null);
//   const [activeFile, setActiveFile] = useState<FileType>("html");
//   const [fileContents, setFileContents] = useState<Record<FileType, string>>({
//     html: "",
//     css: "",
//     js: "",
//   });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [projectName, setProjectName] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");
//   const [showPreview, setShowPreview] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   const router = useRouter();
//   const params = useParams();

//   // Handle responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setIsSidebarOpen(!mobile); // Sidebar open by default on desktop, closed on mobile
//       setShowPreview(!mobile); // Preview visible by default on desktop, hidden on mobile
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Authentication check
//   useEffect(() => {
//     if (loggedIn_name !== params.username) redirect("/");
//   }, [loggedIn_name, params]);

//   // Fetch project details
//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       if (!params.project_name) return;
//       try {
//         setIsLoading(true);
//         const res = await fetch(
//           `/api/projects?pname=${encodeURIComponent(params.project_name as string)}`
//         );
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to fetch project");

//         setUserProject(data.project);
//         setFileContents({
//           html: data.project.files.html || "",
//           css: data.project.files.css || "",
//           js: data.project.files.javascript || "",
//         });
//         setProjectName(data.project.project_name);
//         setProjectDescription(data.project.project_description);
//       } catch (error) {
//         console.error("Error fetching project:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProjectDetails();
//   }, [params.project_name]);

//   const handleCodeChange = (value: string | undefined) => {
//     setFileContents((prev) => ({
//       ...prev,
//       [activeFile]: value || "",
//     }));
//   };

//   const combinedCode = useMemo(() => {
//     const { html, css, js } = fileContents;
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>${css}</style>
//         </head>
//         <body>
//           ${html.replace(/<!DOCTYPE html>|<\/?html>|<\/?body>/g, "")}
//           <script>${js}</script>
//         </body>
//       </html>
//     `;
//   }, [fileContents]);

//   const getFileIcon = (type: FileType) => {
//     const Icon = fileTypeConfig[type].icon;
//     return <Icon className="w-4 h-4" />;
//   };

//   const handleSaveChanges = async () => {
//     try {
//       if (!params.project_name) return;
//       const res = await fetch("/api/saveproject", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           project_name: decodeURIComponent(params.project_name as string),
//           html: fileContents.html || "",
//           css: fileContents.css || "",
//           javascript: fileContents.js || "",
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to update project");
//       toast("Changes saved successfully", {
//         style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//       });
//     } catch (error) {
//       console.error("Error updating project:", error);
//     }
//   };

//   const handleShareCode = async () => {
//     const currentUrl = window.location.href + "/website";
//     navigator.clipboard.writeText(currentUrl);
//     toast(`Share link copied: ${currentUrl}`, {
//       style: { backgroundColor: "#29b3f2", color: "#1A1325" },
//     });
//   };

//   const handleDownloadFile = async () => {
//     const zip = new JSZip();
//     zip.file("index.html", fileContents.html);
//     zip.file("styles.css", fileContents.css);
//     zip.file("script.js", fileContents.js);
//     const blob = await zip.generateAsync({ type: "blob" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "project.zip";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
//     toast("File downloaded", {
//       style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//     });
//   };

//   const handleProjectDetailSave = async () => {
//     try {
//       const res = await fetch("/api/saveProjectDetails", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           project_name: decodeURIComponent(params.project_name as string),
//           newProjectName: projectName,
//           newProjectDescription: projectDescription,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to update project");
//       toast("Details updated successfully", {
//         style: { backgroundColor: "#8DF19E", color: "#1A1325" },
//       });
//       router.replace(`/${params.username}/${projectName}`);
//     } catch (error) {
//       console.error("Error updating details:", error);
//     }
//   };

//   if (isLoading) return <LoadingEditor />;

//   return (
//     <TooltipProvider delayDuration={0}>
//       <div className="min-h-screen flex flex-col bg-gray-100 text-black">
//         {/* Top Navigation */}
//         <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2 sm:px-4 z-10">
//           <div className="flex items-center gap-2">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-gray-300 hover:text-purple-800"
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 >
//                   {isSidebarOpen ? (
//                     <PanelLeftClose className="h-5 w-5" />
//                   ) : (
//                     <PanelLeftOpen className="h-5 w-5" />
//                   )}
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Toggle Sidebar</TooltipContent>
//             </Tooltip>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-gray-300 hover:text-purple-800"
//                   onClick={() => setShowPreview(!showPreview)}
//                 >
//                   {showPreview ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 {showPreview ? "Hide Preview" : "Show Preview"}
//               </TooltipContent>
//             </Tooltip>
//           </div>
//           <div className="flex items-center gap-1 sm:gap-2">
//             {[
//               { icon: Save, action: handleSaveChanges, label: "Save", hover: "hover:text-green-500" },
//               { icon: Share, action: handleShareCode, label: "Share", hover: "hover:text-blue-500" },
//               { icon: Download, action: handleDownloadFile, label: "Download", hover: "hover:text-red-500" },
//               { icon: PlayCircle, action: () => window.open(`${window.location.pathname}/view`, "_blank"), label: "View", hover: "hover:text-green-500" },
//               { icon: StepBack, action: () => router.push(`/${params.username}`), label: "Dashboard", hover: "hover:text-blue-500" },
//             ].map(({ icon: Icon, action, label, hover }) => (
//               <Tooltip key={`nav-${label}`}>
//                 <TooltipTrigger asChild>
//                   <Button
//                     onClick={action}
//                     variant="ghost"
//                     size="icon"
//                     className={`h-9 w-9 text-gray-300 ${hover}`}
//                   >
//                     <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>{label}</TooltipContent>
//               </Tooltip>
//             ))}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
//                   <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md bg-gray-900 text-white border border-gray-700">
//                 <DialogHeader>
//                   <DialogTitle className="text-lg font-semibold">Edit Project Details</DialogTitle>
//                   <DialogDescription className="text-gray-400">
//                     Update your project name and description.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-300">Project Name</label>
//                     <Input
//                       className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-gray-500"
//                       value={projectName}
//                       onChange={(e) => setProjectName(e.target.value)}
//                       placeholder="Enter project name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-300">Project Description</label>
//                     <textarea
//                       className="mt-1 w-full h-24 bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:ring-gray-500"
//                       value={projectDescription}
//                       onChange={(e) => setProjectDescription(e.target.value)}
//                       placeholder="Enter project description"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter className="flex justify-end space-x-2">
//                   <Button className="border-gray-600 text-gray-300 hover:text-white">
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-gray-700 hover:bg-blue-500 text-white"
//                     onClick={handleProjectDetailSave}
//                   >
//                     Save
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col md:flex-row">
//           {/* Sidebar */}
//           <div
//             className={cn(
//               "bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col absolute md:relative z-20",
//               isSidebarOpen ? "w-64 md:w-48" : "w-0 md:w-14",
//               !isSidebarOpen && "overflow-hidden"
//             )}
//           >
//             <div className="p-4 border-b border-gray-700 flex items-center gap-3">
//               {isSidebarOpen && (
//                 <div className="w-full">
//                   <h1 className="font-semibold text-white truncate">{userProject?.project_name}</h1>
//                   <p className="text-xs text-gray-400 truncate">{userProject?.project_description}</p>
//                 </div>
//               )}
//             </div>
//             {isSidebarOpen && (
//               <ScrollArea className="flex-1">
//                 <div className="p-2 space-y-2">
//                   <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Files</h2>
//                   <div className="space-y-1">
//                     {(["html", "css", "js"] as const).map((type) => (
//                       <Tooltip key={`file-${type}`}>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             className={cn(
//                               "w-full flex items-center justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-700",
//                               activeFile === type && "bg-gray-700 text-white"
//                             )}
//                             onClick={() => setActiveFile(type)}
//                           >
//                             {getFileIcon(type)}
//                             <span>
//                               {type === "html" ? "index.html" : type === "css" ? "styles.css" : "scripts.js"}
//                             </span>
//                           </Button>
//                         </TooltipTrigger>
//                         {!isSidebarOpen && <TooltipContent>{type}</TooltipContent>}
//                       </Tooltip>
//                     ))}
//                   </div>
//                 </div>
//               </ScrollArea>
//             )}
//           </div>

//           {/* Editor and Preview */}
//           <div className="flex-1 flex flex-col">
//             <div className="flex-1 flex flex-col md:flex-row">
//               {showPreview ? (
//                 <div className="flex-1 bg-white h-[50vh] md:h-full">
//                   <iframe
//                     title="preview"
//                     srcDoc={combinedCode}
//                     className="w-full h-full"
//                     sandbox="allow-scripts"
//                   />
//                 </div>
//               ) : (
//                 <div className="flex-1 h-[calc(100vh-3.5rem)] md:h-full">
//                   <Editor
//                     height="100%"
//                     language={fileTypeConfig[activeFile].language}
//                     theme="vs-dark"
//                     value={fileContents[activeFile]}
//                     onChange={handleCodeChange}
//                     options={{
//                       minimap: { enabled: !isMobile },
//                       fontSize: isMobile ? 12 : 14,
//                       wordWrap: "on",
//                       padding: { top: 16 },
//                       scrollbar: { verticalScrollbarSize: 8 },
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default EditorClient;

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "split">("split");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

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

  // Common action buttons
  const actionButtons = [
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
      action: () => window.open(`${window.location.pathname}/view`, "_blank"),
      label: "View in New Tab",
      hover: "hover:text-green-500",
    },
    {
      icon: StepBack,
      action: () => router.push(`/${params.username}`),
      label: "Dashboard",
      hover: "hover:text-blue-500",
    },
  ];

  // Mobile Menu
  const MobileMenu = () => (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-90 z-50 ${isMobileMenuOpen ? "block" : "hidden"}`}>
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
                {actionButtons.map(({ icon: Icon, action, label }) => (
                  <Button
                    key={`mobile-action-${label}`}
                    variant="ghost"
                    className="flex items-center justify-start gap-3 w-full text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      action();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Button>
                ))}
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
            isMobileView && isSidebarOpen && "!fixed inset-y-0 left-0 z-40 flex flex-col w-64"
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
              <div className={cn("pt-4 mt-4 border-t border-gray-700", !isSidebarOpen && "hidden")}>
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
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {actionButtons.map(({ icon: Icon, action, label }) => (
                    <DropdownMenuItem
                      key={`dropdown-${label}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                      onClick={action}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop action buttons */}
              <div className="hidden md:flex items-center gap-1">
                {actionButtons.map(({ icon: Icon, action, label, hover }) => (
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

              {/* Settings Dialog Trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-300 hover:text-white hidden md:flex"
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
          </div>

          {/* Editor and Preview */}
          <div className="flex-1">
            {viewMode === "split" && !isMobileView ? (
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
            ) : (
              <div className="h-[calc(100vh-3.5rem)]">
                {viewMode === "editor" ? (
                  <div className="h-full relative bg-gray-200">
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
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-white">
                    <iframe
                      title="preview"
                      srcDoc={combinedCode}
                      className="w-full h-full"
                      sandbox="allow-scripts"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorClient;