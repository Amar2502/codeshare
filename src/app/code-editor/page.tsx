"use client";

import { useState, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Code,
  Share,
  FileText,
  FileJson,
  FileCode,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const defaultHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>My Web Project</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
    <p>Start editing to see your changes!</p>
  </body>
</html>`;

const defaultCSS = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f0f0f0;
}

h1 {
  color: #333;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}`;

const defaultJS = `// Your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded!')
})`;

type FileType = "html" | "css" | "js";

async function App() {

  const [activeFile, setActiveFile] = useState<FileType>("html");
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showShareNotification, setShowShareNotification] = useState(false);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
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
    },
    [activeFile]
  );

  const getLanguage = (type: FileType) => {
    switch (type) {
      case "html":
        return "html";
      case "css":
        return "css";
      case "js":
        return "javascript";
    }
  };

  const getCurrentCode = () => {
    switch (activeFile) {
      case "html":
        return html;
      case "css":
        return css;
      case "js":
        return js;
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "html":
        return <FileText className="w-4 h-4" />;
      case "css":
        return <FileJson className="w-4 h-4" />;
      case "js":
        return <FileCode className="w-4 h-4" />;
    }
  };

  const combinedCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html.replace(/<!DOCTYPE html>|<\/?html>|<\/?body>|<\/?head>/g, "")}
        <script>${js}</script>
      </body>
    </html>
  `;

  const handleShare = useCallback(() => {
    const projectData = {
      html,
      css,
      js,
    };
    const encoded = btoa(JSON.stringify(projectData));
    const url = `${window.location.origin}?project=${encoded}`;
    navigator.clipboard.writeText(url);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 3000);
  }, [html, css, js]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedProject = params.get("project");
    if (sharedProject) {
      try {
        const decoded = JSON.parse(atob(sharedProject));
        setHtml(decoded.html);
        setCss(decoded.css);
        setJs(decoded.js);
      } catch (e) {
        console.error("Invalid shared project");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 h-14 flex items-center px-4">
        <div className="flex items-center gap-2 flex-1">
          <Code className="w-6 h-6 text-purple-400 animate-pulse" />
          <div>
            <h1 className="text-lg font-semibold text-white">WebEditor</h1>
            <p className="text-xs text-purple-400">
              HTML, CSS, and JavaScript Editor
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 text-sm font-medium"
          >
            <Share className="w-4 h-4" />
            Share Project
          </button>
        </div>
      </nav>

      <div className="h-[calc(100vh-3.5rem)] flex">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-[15%] min-w-[200px] max-w-[300px]" : "w-12"
          } bg-black/30 backdrop-blur-lg text-gray-300 relative`}
        >
          <div
            className={`p-4 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
              Files
            </h2>
            <ul className="space-y-1">
              {(["html", "css", "js"] as FileType[]).map((type) => (
                <li key={type}>
                  <button
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${
                      activeFile === type
                        ? "bg-purple-600/20 text-purple-100 shadow-lg shadow-purple-500/10"
                        : "hover:bg-purple-500/10 text-gray-300 hover:shadow-md hover:shadow-purple-500/5"
                    }`}
                    onClick={() => setActiveFile(type)}
                  >
                    {getFileIcon(type)}
                    {`index.${type}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-black/40 p-1.5 rounded-full border border-white/10 text-purple-400 hover:text-purple-300 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 z-10"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 right-0 h-9 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center px-4">
                <span className="text-sm text-purple-200/60">
                  {`index.${activeFile}`}
                </span>
              </div>
              <div className="pt-9 h-full">
                <Editor
                  height="100%"
                  defaultLanguage={getLanguage(activeFile)}
                  language={getLanguage(activeFile)}
                  theme="vs-dark"
                  value={getCurrentCode()}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    padding: { top: 16 },
                    smoothScrolling: true,
                    // cursorSmoothCaretAnimation: true,
                  }}
                />
              </div>
            </div>
            <div className="w-[40%] relative">
              <div className="absolute top-0 left-0 right-0 h-9 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center px-4">
                <span className="text-sm text-blue-200/60">Preview</span>
              </div>
              <div className="pt-9 h-full bg-white">
                <iframe
                  title="preview"
                  srcDoc={combinedCode}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
