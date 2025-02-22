"use client"

import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteIcon, ExternalLink, File, Menu, SaveAll } from "lucide-react";
import { Extension } from "@codemirror/state";

// Define types for file content
type FileType = "html" | "css" | "javascript";

interface FileContent {
  content: string;
  type: FileType;
}

interface Files {
  [key: string]: FileContent;
}

// Define props interface (empty for now, but extensible)
interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeFile, setActiveFile] = useState<string>("index.html");
  const [files, setFiles] = useState<Files>({
    "index.html": { content: "<h1>Hello, World!</h1>", type: "html" },
    "styles.css": { content: "*{ background-color: black } h1 { color: white; }", type: "css" },
    "script.js": {
      content: "console.log('Hello, World!');",
      type: "javascript",
    },
  });

  const getFileExtension = (filename: string): Extension[] => {
    if (filename.endsWith(".html")) return [html()];
    if (filename.endsWith(".css")) return [css()];
    if (filename.endsWith(".js")) return [javascript()];
    return [];
  };

  const generatePreview = (): string => {
    const htmlContent = files["index.html"]?.content || "";
    const cssContent = files["styles.css"]?.content || "";
    const jsContent = files["script.js"]?.content || "";
    return `
      <html>
      <head>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
        <script>${jsContent}</script>
      </body>
      </html>
    `;
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileContentChange = (value: string, filename: string): void => {
    setFiles((prev) => ({
      ...prev,
      [filename]: {
        ...prev[filename],
        content: value,
      },
    }));
  };

  const handleSaveAll = (): void => {
    console.log("files saved");
  };

  const handleClear = (): void => {
    const clearedFiles: Files = Object.keys(files).reduce(
      (acc, filename) => ({
        ...acc,
        [filename]: { ...files[filename], content: "" },
      }),
      {}
    );
    setFiles(clearedFiles);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="h-12 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Welcome</h1>
        <div className="flex space-x-4 items-center">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="transition-opacity duration-200 hover:opacity-80"
            >
              DashBoard
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
            isSidebarOpen ? "w-48" : "w-12 items-center justify-center"
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-gray-700">
            {isSidebarOpen && (
              <span className="text-sm font-medium">Explorer</span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-700 rounded-md"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(files).map(([filename]) => (
              <div
                key={filename}
                className={`flex items-center cursor-pointer px-3 py-2 mb-1 rounded-md group ${
                  activeFile === filename
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveFile(filename)}
              >
                <File />
                {isSidebarOpen && (
                  <span className="ml-3 truncate">{filename}</span>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="h-12 border-t border-gray-700 flex items-center justify-evenly px-2">
            {isSidebarOpen && (
              <>
                <button
                  className="p-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md flex items-center justify-center"
                  onClick={handleSaveAll}
                >
                  <SaveAll size={16} /> Save All
                </button>
                <button
                  className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-md flex items-center justify-center"
                  onClick={handleClear}
                >
                  <DeleteIcon size={16} />
                  <span className="ml-2 text-sm">Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg"
          >
            <ResizablePanel defaultSize={50} minSize={0}>
              <div className="h-full">
                <CodeMirror
                  extensions={getFileExtension(activeFile)}
                  value={files[activeFile]?.content}
                  onChange={(value) =>
                    handleFileContentChange(value, activeFile)
                  }
                  theme={dracula}
                  className="border border-gray-700 rounded"
                />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="opacity-40 hover:opacity-90 transition-opacity duration-300"
            />

            <ResizablePanel defaultSize={50} minSize={0}>
              <div className="h-full bg-white">
                <iframe
                  title="Preview"
                  className="w-full h-full border-none"
                  srcDoc={generatePreview()}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      {/* Footer */}
      <div className="h-12 bg-gray-800 flex items-center px-4 border-t border-gray-700">
        <div className="flex space-x-4">
          <button
            className="p-2 flex items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            onClick={() => {
              const newWindow = window.open("", "_blank");
              if (newWindow) {
                newWindow.document.write(generatePreview());
              }
            }}
          >
            <ExternalLink size={16} />
            <span className="ml-2">Open Preview in New Tab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;