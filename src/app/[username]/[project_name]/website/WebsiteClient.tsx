"use client";

import React, { useEffect, useMemo, useState } from "react";
import LoadingEditor from "../EditorLoading";
import { useParams } from "next/navigation";

// type Project = {
//   project_name: string;
//   project_description: string;
//   files: {
//     html: string;
//     css: string;
//     javascript: string;
//   };
// };

// const fileTypeConfig = {
//   html: { language: "html" },
//   css: { language: "css" },
//   js: { language: "javascript" },
// };

// type ShareClientProps = {
//   user_name: string;
//   project_name: string;
// };

type File = {
  html: string;
  css: string;
  javascript: string;
};

const WebsiteClient = () => {
  // const [userProject, setUserProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContents, setFileContents] = useState<File>({
    html: "",
    css: "",
    javascript: "",
  });

  const params = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/shareproject?user_name=${params.username}&project_name=${encodeURIComponent(
            params.project_name as string
          )}`
        );

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch project details");
        }

        // setUserProject(data.project);
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
                ${html.replace(/<!DOCTYPE html>|<\/?html>|<\/?body>/g, "")}
                <script>${javascript}</script>
              </body>
            </html>
          `;
  }, [fileContents]);

  if (isLoading) {
    return <LoadingEditor />;
  }

  console.log(combinedCode);

  return (
    <>
      <div className="h-screen w-screen relative">
        <iframe
          title="preview"
          srcDoc={combinedCode}
          className="w-full h-full"
          sandbox="allow-scripts"
        />

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
    </>
  );
};

export default WebsiteClient;
