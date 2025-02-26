"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Play,
  Share2,
  Database,
  ExternalLink,
  Monitor,
  X,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import TryNowEditor from "./trynoweditor";

export default function HomePage() {
  const [hoverButton, setHoverButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        {/* Navbar */}
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">
              Code<span className="text-blue-400">Share</span>
            </span>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-4 pt-16 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <motion.h1
                className="text-5xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Code, Preview, <span className="text-blue-400">Share.</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The simplest way for beginner developers to showcase their HTML,
                CSS, and JavaScript projects without needing to know hosting or
                Git.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoverButton(true)}
                  onHoverEnd={() => setHoverButton(false)}
                  onClick={handleSignIn}
                >
                  <Play className="h-5 w-5" />
                  <span>Start Creating</span>
                </motion.button>

                <div>
                  {/* Button to Open Modal */}
                  <button
                    onClick={() => setIsOpen(true)}
                    className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white py-3 px-8 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
                  >
                    <Monitor className="h-5 w-5" />
                    <span>Try Now</span>
                  </button>

                  {/* Modal */}
                  {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gray-900 text-white p-2 rounded-lg shadow-lg w-[90vw] max-w-5xl h-50vh flex flex-col relative"
                      >
                        <button
                          onClick={() => setIsOpen(false)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        >
                          <X className="h-6 w-6" />
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Try Now</h2>
                        <div className="flex-1 overflow-auto">
                          <TryNowEditor />
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Content - Editor Preview */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="bg-gray-900 p-3 flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-gray-400 text-sm flex-1 text-center">
                    index.html
                  </div>
                </div>

                <div className="grid grid-cols-2 h-80">
                  <div className="bg-gray-950 p-4 font-mono text-sm text-blue-300 overflow-hidden border-r border-gray-700">
                    <pre>
                      {`<!DOCTYPE html>
<html>
  <head>
    <title>My Project</title>
    <style>
      body {
        font-family: sans-serif;
        background: linear-gradient(
          45deg, #845EC2, #D65DB1
        );
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
</html>`}
                    </pre>
                  </div>
                  <div className="bg-gradient-to-br from-purple-800 to-pink-600 flex items-center justify-center">
                    <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-md shadow-lg">
                      <h1 className="text-2xl font-bold mb-2">Hello, World!</h1>
                      <p className="text-white text-opacity-90">
                        My awesome website
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Example Projects Section */}
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Explore <span className="text-blue-400">Projects</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Check out what other developers have created and shared
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Portfolio Template",
                  description: "A responsive portfolio website with dark mode",
                  image: "/placeholder-portfolio.png",
                  sharelink:
                    "http://localhost:3000/amar/Portfolio_Template/website",
                },
                {
                  title: "Todo App",
                  description: "Interactive task manager with local storage",
                  image: "/placeholder-todo.png",
                  sharelink: "http://localhost:3000/amar/Todo_App/website",
                },
                {
                  title: "Landing Page",
                  description: "Modern landing page with animations",
                  image: "/placeholder-landing.png",
                  sharelink: "http://localhost:3000/amar/Landing_Page/website",
                },
              ].map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="h-48 bg-gray-700 relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <Link href={`${project.sharelink}`} passHref>
                      <motion.div
                        className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        View Project <ExternalLink className="h-4 w-4 ml-1" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-950 py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Why Choose <span className="text-blue-400">CodeShare</span>?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code className="h-8 w-8 text-blue-400" />,
                  title: "Live Preview",
                  description:
                    "See your changes in real-time as you code with our instant preview feature.",
                },
                {
                  icon: <Share2 className="h-8 w-8 text-blue-400" />,
                  title: "Instant Sharing",
                  description:
                    "Share your projects with a simple link. No hosting or deployment needed.",
                },
                {
                  icon: <Database className="h-8 w-8 text-blue-400" />,
                  title: "No Git Required",
                  description:
                    "Skip the version control complexities. We handle everything for you.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="bg-gray-700 inline-block p-4 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Just one click and you can start building your web project right
              away.
            </p>

            <motion.button
              className="bg-white text-blue-700 py-3 px-10 rounded-lg font-medium text-lg inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
            >
              <Play className="h-5 w-5" />
              <span>Start Creating</span>
            </motion.button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CodeShare. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
