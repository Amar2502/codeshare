"use client";

import React, { useEffect, useMemo, useState } from "react";
import LoadingEditor from "../EditorLoading";

type Project = {
  project_name: string;
  project_description: string;
  files: {
    html: string;
    css: string;
    javascript: string;
  };
};

const fileTypeConfig = {
  html: { language: "html" },
  css: { language: "css" },
  js: { language: "javascript" },
};

type ShareClientProps = {
  project_name: string;
};

type File = {
  html: string;
  css: string;
  javascript: string;
};

const ShareClient = ({ project_name }: ShareClientProps) => {
  const [userProject, setUserProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContents, setFileContents] = useState<File>({
    html: "",
    css: "",
    javascript: "",
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/projects/${project_name}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch project details");
        }

        setUserProject(data.project);
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
  }, [project_name]);

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
      <div className="h-screen w-screen">
        <iframe
          title="preview"
          srcDoc={combinedCode}
          className="w-full h-full"
          sandbox="allow-scripts"
        />
      </div>
    </>
  );
  
}

export default ShareClient;
