"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Share } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signIn } from "next-auth/react";

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

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="bg-backgroundcolor rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-backgroundcolor border-b border-gray-800">
        <div className="flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>

        {/* Share Button with Modal */}
        <AlertDialog>
          <AlertDialogTrigger className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all">
            <Share className="h-5 w-5" />
            <span>Share</span>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-backgroundcolor text-text rounded-lg shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign up to share your project</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondarycolor hover:bg-opacity-90 text-gray-300 hover:text-text">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSignIn}
                className="bg-accentcolor hover:bg-opacity-90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          className="w-full h-full transition-transform duration-300 hover:scale-[1.01]"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default TryNowEditor;
