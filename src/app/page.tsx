import React from "react";
import {
  Code2,
  Share2,
  Globe,
  Sparkles,
  Laptop,
  Eye,
  Share,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Share Your First
            <span className="text-purple-400 inline-block hover:scale-105 transition-transform duration-300">
              {"     "}
              Web Projects
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The simplest way for beginner developers to showcase their HTML,
            CSS, and JavaScript projects without needing to know hosting or Git.
          </p>
          <Button
            className="mt-8 bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-300 text-lg py-6 px-8"
          >
            Start Creating
          </Button>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Code2,
                title: "1. Code",
                desc: "Use our built-in editor to write HTML, CSS, and JavaScript. See your changes in real-time.",
              },
              {
                Icon: Share2,
                title: "2. Share",
                desc: "Get a unique link to your project that you can share anywhere on social media.",
              },
              {
                Icon: Globe,
                title: "3. Showcase",
                desc: "Build your portfolio and show your learning journey to the world.",
              },
            ].map(({ Icon, title, desc }, index) => (
              <div
                key={index}
                className="text-center space-y-4 hover:scale-105 transition-all duration-300"
              >
                <div className="bg-purple-400/10 rounded-full p-4 w-16 h-16 mx-auto hover:bg-purple-400/20 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Built for Beginners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Laptop,
                title: "No Setup Required",
                desc: "Start coding right away with our online editor. No installations or configurations needed.",
              },
              {
                icon: Eye,
                title: "Real-time Preview",
                desc: "See your changes instantly as you code. Perfect for learning and experimenting.",
              },
              {
                icon: Share,
                title: "Easy Sharing",
                desc: "Share your projects on Twitter, LinkedIn, or anywhere else with a single click.",
              },
              {
                icon: GraduationCap,
                title: "Learn in Public",
                desc: "Document your progress and get feedback from the developer community.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:-translate-y-1 transition-transform duration-300"
              >
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <feature.icon className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-purple-400/10 rounded-2xl p-12 hover:bg-purple-400/20 transition-colors duration-300">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join other beginners who are learning and building in public.
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-300 text-lg py-6 px-8"
          >
            Sign in with Google to Begin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
