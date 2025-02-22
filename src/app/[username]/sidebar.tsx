"use client"; // ✅ Add this line

import React, { useState } from "react";
import { Settings, FolderOpen, User, Folders } from "lucide-react";
import Link from "next/link";

const SideBar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("files");

  return (
    <div className="h-full">
      {/* Sidebar */}
      <div className="w-64 shadow-xl h-full border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="text-2xl font-bold text-white flex items-center gap-4">
            <User size={20} /> Profile
          </div>
        </div>

        <nav className="px-4 py-4">
          {[
            {
              icon: Folders,
              label: "My Files",
              section: "files",
              link: "/dashboard",
            },
            {
              icon: Settings,
              label: "Settings",
              section: "settings",
              link: "/dashboard/settings",
            },
          ].map(({ icon: Icon, label, section, link }) => (
            <Link key={section} href={link}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 cursor-pointer ${
                  activeSection === section
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
