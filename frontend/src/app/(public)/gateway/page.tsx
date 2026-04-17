"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function GatewayPage() {
  const [userBackground, setUserBackground] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleGetRecommendations = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRecommendations([
        "IT Support Specialist - Germany",
        "Junior Developer - Netherlands",
        "IT Consultant - Sweden",
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-violet-500 via-violet-700 to-violet-800 rounded-b-lg text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90">
          ගොඩයන
          <span className="text-secondary"> Gateway</span>
        </h1>
        <p className="text-background/80 relative">
          Your premium structured migration portal. Start your journey with a
          professional eligibility assessment.
        </p>
      </motion.div>

      {/* MAIN 2-COLUMN SECTION */}
      <section className="py-10 px-10 mx-auto">
        <div className="max-w-6xl px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* STEPS */}
              <div className="bg-card border rounded-xl p-5">
                <h3 className="font-semibold mb-4">Gateway</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Eligibility Assessment
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Financial Planning
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Document Checklist
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Progress Tracking
                  </div>
                </div>
              </div>

              {/* AI CARD */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">AI Career Advisor</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  Tell us your background and get career suggestions.
                </p>

                <Textarea
                  value={userBackground}
                  onChange={(e) => setUserBackground(e.target.value)}
                  placeholder="Your education, skills, experience..."
                  className="mb-3"
                />

                <Button
                  onClick={handleGetRecommendations}
                  disabled={!userBackground || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Analyzing..." : "Get Recommendations"}
                </Button>

                {/* RESULTS */}
                {recommendations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-muted/40 p-2 rounded-md text-sm"
                      >
                        {rec}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm mb-1 block">Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>

                  <div>
                    <label className="text-sm mb-1 block">Age</label>
                    <Input type="number" placeholder="25" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm mb-1 block">
                    Highest Education
                  </label>
                  <Input placeholder="A/L Completed" />
                </div>

                <Button className="w-full">Continue to Assessment</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
