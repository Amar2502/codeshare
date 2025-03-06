"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import WebsiteLoader from "../WebsiteLoader";
import JSZip from "jszip";
import { toast } from "sonner";
import { Menu, X, FileText, FileCode, FileJson } from "lucide-react";

interface FileContents {
  html: string;
  css: string;
  javascript: string;
}

const CodeClient: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileContents, setFileContents] = useState<FileContents>({
    html: "",
    css: "",
    javascript: "",
  });
  const [activeTab, setActiveTab] = useState<keyof FileContents>("html");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const params = useParams<{ username: string; project_name: string }>();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/shareproject?user_name=${
            params.username
          }&project_name=${encodeURIComponent(params.project_name)}`
        );

        const data = await res.json();
        console.log(data.project.files);
        

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch project details");
        }

        setFileContents({
          html: data.project.files.html || "",
          css: data.project.files.css || "",
          javascript: data.project.files.javascript || "",
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params.project_name, params.username]);

  const combinedCode = useMemo(() => {
    const { html, css, javascript } = fileContents;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html.replace(/<!DOCTYPE html>|<\/?.*?>/g, "")}
          <script>${javascript}<\/script>
        </body>
      </html>
    `;
  }, [fileContents]);

  const handleDownloadFile = async () => {
    const zip = new JSZip();

    zip.file("index.html", fileContents.html);
    zip.file("styles.css", fileContents.css);
    zip.file("script.js", fileContents.javascript);

    const blob = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "project.zip";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

    toast("Project files downloaded successfully", {
      style: { backgroundColor: "#8DF19E", color: "#1A1325" },
    });
  };

  if (isLoading) {
    return <WebsiteLoader />;
  }

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-60 bg-gray-800 p-4 flex flex-col space-y-4 transition-all">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white flex items-center justify-end pr-2 hover:text-gray-400"
          >
            <X size={20} />
          </button>
          {[
            { name: "html", icon: <FileText size={20} /> },
            { name: "css", icon: <FileCode size={20} /> },
            { name: "javascript", icon: <FileJson size={20} /> },
          ].map(({ name, icon }) => (
            <button
              key={name}
              className={`flex items-center space-x-2 px-4 py-2 rounded text-white transition-all ${
                activeTab === name
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab(name as keyof FileContents)}
            >
              {icon}
              <span>{name.toUpperCase()}</span>
            </button>
          ))}
          <button
            onClick={handleDownloadFile}
            className="mt-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-center"
          >
            Download Files
          </button>
        </div>
      )}

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-white bg-gray-800 p-2 rounded-r absolute top-4 left-0"
        >
          <Menu size={24} />
        </button>
      )}

      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        {/* Code Editor Panel */}
        <ResizablePanel
          defaultSize={50}
          minSize={30}
          maxSize={60}
          className="bg-gray-900"
        >
          <Editor
            height="100%"
            language={activeTab}
            value={fileContents[activeTab]}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
            onChange={(value) =>
              setFileContents((prev) => ({ ...prev, [activeTab]: value || "" }))
            }
          />
        </ResizablePanel>

        {/* Live Preview Panel */}
        <ResizablePanel
          defaultSize={50}
          minSize={30}
          maxSize={60}
          className="relative"
        >
          <iframe
            title="preview"
            srcDoc={combinedCode}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* Floating Ball */}
      <div className="fixed bottom-6 right-6 group">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg cursor-pointer relative transition-all duration-300 hover:scale-110">
          <span className="text-white text-xl font-bold">⚡</span>

          {/* Tooltip (now on the left) */}
          <div className="absolute right-full mr-3 w-max px-3 py-1 text-sm bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Powered by CodeVault
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeClient;
