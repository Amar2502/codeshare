"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";

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

  const params = useParams<{ username: string; project_name: string }>();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/shareproject?user_name=${params.username}&project_name=${encodeURIComponent(
            params.project_name
          )}`
        );

        const data = await res.json();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-gray-800 p-4">
        <div className="flex flex-col space-y-4">
          {["html", "css", "javascript"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded text-white ${
                activeTab === tab ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab(tab as keyof FileContents)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </ResizablePanel>

      {/* Code Editor Panel */}
      <ResizablePanel defaultSize={40} minSize={30} maxSize={60} className="bg-gray-900">
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
      <ResizablePanel defaultSize={45} minSize={30} maxSize={60} className="relative">
        <iframe
          title="preview"
          srcDoc={combinedCode}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodeClient;
