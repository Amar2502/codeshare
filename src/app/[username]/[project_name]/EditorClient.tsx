"use client";

import { useState } from "react";
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

type FileType = "html" | "css" | "js";

// Define nav items for better organization and reusability
const navItems = [
  { icon: Save, label: "Save Project", group: "left" },
  { icon: Share, label: "Share Project", group: "left" },
  { icon: Copy, label: "Copy Code", group: "right" },
  { icon: Download, label: "Download Files", group: "right" },
  { icon: PlayCircle, label: "Run Project", group: "right" },
  { icon: Settings, label: "Settings", group: "right" },
] as const;

const defaultHTML = `<!DOCTYPE html>
<html>
  <body>
    <h1>Welcome to My Website</h1>
    <p>Start editing to see your changes!</p>
  </body>
</html>`;

const defaultCSS = `body {
  margin: 0;
  background: #000;
  color: #fff;
}`;

const defaultJS = `console.log('Website loaded!')`;

export default function EditorClient() {
  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleCodeChange = (value: string | undefined) => {
    switch (activeFile) {
      case "html":
        setHtml(value || "");
        break;
      case "css":
        setCss(value || "");
        break;
      case "js":
        setJs(value || "");
        break;
    }
  };

  const getLanguage = (type: FileType) => {
    const languages = {
      html: "html",
      css: "css",
      js: "javascript",
    };
    return languages[type];
  };

  const getCurrentCode = () => {
    const codeMap = {
      html,
      css,
      js,
    };
    return codeMap[activeFile];
  };

  const getFileIcon = (type: FileType) => {
    const icons = {
      html: <FileText className="w-4 h-4" />,
      css: <FileJson className="w-4 h-4" />,
      js: <FileCode className="w-4 h-4" />,
    };
    return icons[type];
  };

  const combinedCode = `
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

  const renderNavItem = (item: (typeof navItems)[number], index: number) => (
    <Tooltip key={`nav-${item.label}`}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-purple-400 hover:text-purple-300"
        >
          <item.icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{item.label}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-screen flex bg-black">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-zinc-950 border-r border-purple-900/20 transition-all duration-300 flex flex-col",
            isSidebarOpen ? "w-64" : "w-14"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-purple-900/20 flex items-center gap-3">
            <Code className="h-6 w-6 text-purple-400" />
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              <h1 className="font-semibold text-white">WebEditor</h1>
              <p className="text-xs text-purple-400">Code Editor</p>
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
                          {`index.${type}`}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    {!isSidebarOpen && (
                      <TooltipContent>{`index.${type}`}</TooltipContent>
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
              {navItems
                .filter((item) => item.group === "left")
                .map(renderNavItem)}
            </div>

            <div className="flex items-center gap-2">
              {navItems
                .filter((item) => item.group === "right")
                .map(renderNavItem)}
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
                      language={getLanguage(activeFile)}
                      theme="vs-dark"
                      value={getCurrentCode()}
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

              <ResizableHandle className="bg-purple-900/20 hover:bg-purple-700/20" />

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
}
