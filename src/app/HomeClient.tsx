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
  Check,
  Shield,
  Folder,
  Layout,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import TryNowEditor from "./trynoweditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const [hoverButton, setHoverButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number>();

  console.log(hoverButton);
  

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const faqs = [
    {
      question: "What is CodeShare?",
      answer:
        "CodeShare is a platform that allows developers to build, preview, and share web projects without the need for hosting or deployment knowledge. It's perfect for beginners, educators, and professionals who want to quickly showcase their HTML, CSS, and JavaScript projects.",
    },
    {
      question: "Do I need to know Git to use CodeShare?",
      answer:
        "Not at all! One of the main benefits of CodeShare is that you don't need any knowledge of Git or version control. We handle all the technical aspects of saving and sharing your code, so you can focus on creating.",
    },
    {
      question: "How do I share my projects with others?",
      answer:
        "Once you've created a project, CodeShare automatically generates a unique URL that you can share with anyone. Recipients can view your code and see the live preview without needing an account themselves.",
    },
    {
      question: "Is CodeShare free to use?",
      answer:
        "Yes! CodeShare is completely free to use.",
    },
    {
      question: "What programming languages does CodeShare support?",
      answer:
        "Currently, CodeShare supports HTML, CSS, and JavaScript. We're planning to add support for more languages and frameworks in the future based on user feedback.",
    },
  ];

  const projects = [
    {
      title: "Portfolio Template",
      description: "A responsive portfolio website with dark mode",
      image: "/placeholder-portfolio.png",
      sharelink: "https://codeshare.space/amar/Portfolio_Template/website",
    },
    {
      title: "Todo App",
      description: "Interactive task manager with local storage",
      image: "/placeholder-todo.png",
      sharelink: "https://codeshare.space/amar/Todo_App/website",
    },
    {
      title: "Landing Page",
      description: "Modern landing page with animations",
      image: "/placeholder-landing.png",
      sharelink: "https://codeshare.space/amar/Landing_Page/website",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  const imageVariants = {
    hidden: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0D0F21] to-[#141631] text-[#F8FAFC]">
        {/* Navbar */}
        <nav className="container mx-auto px-4 pt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-[#7C3AED]" />
            <span className="text-2xl font-bold">
              Code<span className="text-[#A78BFA]">Share</span>
            </span>
          </div>
        </nav>

        {/* Hero Section - Darkest (Level 1) */}
        <main className="container mx-auto px-4 pt-10 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <motion.h1
                className="text-5xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Code, Preview, <span className="text-[#A78BFA]">Share.</span>
              </motion.h1>

              <motion.p
                className="text-xl text-[#E2E8F0]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The simplest way for beginner developers to showcase their HTML,
                CSS, and JavaScript projects without needing to know hosting or
                Git.
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-[#4ADE80]" />
                  <span>No deployment or hosting knowledge required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-[#4ADE80]" />
                  <span>Instant sharing with a simple URL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-[#4ADE80]" />
                  <span>Live previews as you code</span>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 px-8 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
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
                    className="border border-[#A78BFA] hover:border-[#C4B5FD] text-[#E2E8F0] hover:text-white py-3 px-8 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
                  >
                    <Monitor className="h-5 w-5" />
                    <span>Try Now</span>
                  </button>

                  {/* Modal */}
                  {isOpen && (
                    <div className="fixed inset-0 bg-[#0D0F21] bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#141631] text-white p-2 rounded-lg shadow-lg w-[90vw] max-w-5xl h-50vh flex flex-col relative"
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
              <div className="bg-[#141631] rounded-xl overflow-hidden shadow-2xl border border-[#1F2143]">
                <div className="bg-[#0D0F21] p-3 flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-[#94A3B8] text-sm flex-1 text-center">
                    index.html
                  </div>
                </div>

                <div className="grid grid-cols-2 h-80">
                  <div className="bg-[#0D0F21] p-4 font-mono text-sm text-[#A78BFA] overflow-hidden border-r border-[#1F2143]">
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

        {/* Example Projects Section - Medium Dark (Level 2) */}
        <section id="projects" className="bg-[#181C41] py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Explore <span className="text-[#A78BFA]">Projects</span>
            </motion.h2>

            <motion.p
              className="text-xl text-[#CBD5E1] text-center max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Check out what other developers have created and shared
            </motion.p>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-[#141631] rounded-xl overflow-hidden shadow-xl border border-[#1F2143] h-full flex flex-col"
                  variants={projectVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredProject(index)}
                  onHoverEnd={() => setHoveredProject(-1)}
                >
                  <div className="h-48 overflow-hidden relative">
                    <motion.div
                      variants={imageVariants}
                      animate={hoveredProject === index ? "hover" : "hidden"}
                      className="h-full w-full"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141631] to-transparent opacity-60"></div>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute top-3 right-3 bg-[#7C3AED] text-white p-1 px-2 rounded-full text-xs font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={hoveredProject === index ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      Live Demo
                    </motion.div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-[#A1AFCF] mb-4 flex-1">{project.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <Link href={`${project.sharelink}`} passHref>
                        <motion.div
                          className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium flex items-center group"
                          whileHover={{ x: 5 }}
                        >
                          View Project 
                          <ExternalLink className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={hoveredProject === index ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section - Lighter (Level 3) */}
        <section id="features" className="bg-gradient-to-b from-[#0D0F21] to-[#141631] text-[#F8FAFC] py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Why Choose <span className="text-[#A78BFA]">CodeShare</span>?
            </motion.h2>

            <motion.p
              className="text-xl text-[#CBD5E1] text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Building and sharing web projects has never been easier
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
  {[
    {
      icon: <Code className="h-8 w-8 text-[#A78BFA]" />,
      title: "Live Preview",
      description:
        "See your changes in real-time as you code with our instant preview feature.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-[#A78BFA]" />,
      title: "Instant Sharing",
      description:
        "Share your projects with a simple link. No hosting or deployment needed.",
    },
    {
      icon: <Database className="h-8 w-8 text-[#A78BFA]" />,
      title: "No Git Required",
      description:
        "Skip the version control complexities. We handle everything for you.",
    },
    {
      icon: <Layout className="h-8 w-8 text-[#A78BFA]" />,
      title: "Easy-to-Use Interface",
      description:
        "A simple and intuitive interface designed for beginner and experienced developers alike.",
    },
    {
      icon: <Folder className="h-8 w-8 text-[#A78BFA]" />,
      title: "Folder & File Management",
      description:
        "Organize your projects efficiently with an intuitive folder and file structure.",
    },
    {
      icon: <Shield className="h-8 w-8 text-[#A78BFA]" />,
      title: "Secure Storage",
      description:
        "Your projects are securely stored and backed up regularly.",
    },
  ].map((feature, index) => (
    <motion.div
      key={index}
      className="bg-[#181C41] p-6 rounded-xl border border-[#242856] hover:border-[#A78BFA] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="bg-[#141631] inline-block p-4 rounded-lg mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-[#CBD5E1]">{feature.description}</p>
    </motion.div>
  ))}
</div>


          </div>
        </section>

        {/* How It Works Section - Even Lighter (Level 4) */}
        <section className="bg-[#242960] py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              How <span className="text-[#A78BFA]">It Works</span>
            </motion.h2>

            <motion.p
              className="text-xl text-[#DDE2F1] text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Get started in just three simple steps
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description:
                    "Create your free account using your Google Credentials.",
                },
                {
                  step: "02",
                  title: "Build Your Project",
                  description:
                    "Use our intuitive code editor to create your HTML, CSS, and JavaScript project.",
                },
                {
                  step: "03",
                  title: "Share Instantly",
                  description:
                    "Get a shareable link immediately. No deployment or hosting required.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-8xl font-bold text-[#0D0F21] absolute -top-14 left-0 opacity-30">
                    {step.step}
                  </div>
                  <div className="bg-[#1E2250] p-8 rounded-xl relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-[#DDE2F1]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Lightest (Level 5) */}
        <section id="faq" className="bg-gradient-to-b from-[#0D0F21] to-[#141631] text-[#F8FAFC] py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Frequently Asked{" "}
              <span className="text-[#C4B5FD]">Questions</span>
            </motion.h2>

            <motion.p
              className="text-xl text-[#DDE2F1] text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Everything you need to know about CodeShare
            </motion.p>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border border-[#242960] rounded-lg bg-[#242960] px-4">
                      <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-[#DDE2F1] pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section - Gradient accent */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            className="bg-gradient-to-tr from-[#3637a6] to-[#3c1c87] rounded-2xl p-10 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to start creating?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Just one click and you can start building your web project right
                away.
              </p>

              <motion.button
                className="bg-white text-[#4C1D95] py-3 px-10 rounded-lg font-medium text-lg inline-flex items-center space-x-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
              >
                <Play className="h-5 w-5" />
                <span>Start Creating</span>
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0D0F21] py-6 border-t border-[#1F2143]">
          <div className="container mx-auto px-4 text-center text-[#A1AFCF]">
            <p>© {new Date().getFullYear()} CodeShare. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}