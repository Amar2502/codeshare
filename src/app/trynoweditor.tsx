"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Share } from "lucide-react";

const TryNowEditor = () => {
  const [code, setCode] = useState<string>(`<!DOCTYPE html>
<html>
  <head>
    <title>My Project</title>
    <style>
      body {
        font-family: sans-serif;
        background: linear-gradient(45deg, #845EC2, #D65DB1);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }
      .card {
        background: rgba(255,255,255,0.1);
        padding: 2rem;
        border-radius: 1rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Hello, World!</h1>
      <p>My awesome website</p>
    </div>
  </body>
</html>`);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        {/* Header with Window Buttons */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* Share Button */}
          <Tooltip key="nav-ShareProject">
            <TooltipTrigger asChild>
              <Button
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

        {/* Code Editor and Live Preview */}
        <div className="grid md:grid-cols-2 h-[80vh]">
          {/* Code Editor */}
      <Editor
        height="100%"
        language="html"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          padding: { top: 16 },
          scrollbar: { verticalScrollbarSize: 8 },
        }}
      />

          {/* Live Preview */}
          <iframe
            title="preview"
            srcDoc={code}
            className="w-full h-full"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TryNowEditor;
