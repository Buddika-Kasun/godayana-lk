"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Plane,
  BookOpen,
  Map,
  Compass,
  Users,
  ArrowRight,
} from "lucide-react";
import type { Variants } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Global Jobs",
    description:
      "Verified local and overseas job opportunities with direct employer connections.",
    icon: Briefcase,
    href: "/jobs",
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-500/80",
    delay: 0,
  },
  {
    id: 2,
    title: "Visa Guidance",
    description:
      "Step-by-step documentation help for Student, Work, and Visit visas.",
    icon: Plane,
    href: "/visa",
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-500/90",
    delay: 0.1,
  },
  {
    id: 3,
    title: "Skill Courses",
    description:
      "IELTS, Japanese, and professional training to make you migration-ready.",
    icon: BookOpen,
    href: "/courses",
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-500/90",
    delay: 0.2,
  },
  {
    id: 4,
    title: "Country Guides",
    description:
      "Detailed insights into living costs, salaries, and demand in top countries.",
    icon: Map,
    href: "/gateway",
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-500/80",
    delay: 0.3,
  },
  {
    id: 5,
    title: "Migration Gateway",
    description:
      "Premium assessment and financial planning for your migration journey.",
    icon: Compass,
    href: "/gateway",
    color: "from-indigo-500 to-blue-500",
    textColor: "text-indigo-500/80",
    delay: 0.4,
  },
  {
    id: 6,
    title: "Success Stories",
    description:
      "Real stories from Sri Lankans who transformed their lives abroad.",
    icon: Users,
    href: "/stories",
    color: "from-rose-500 to-red-500",
    textColor: "text-rose-500/80",
    delay: 0.5,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-background-cold overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your Gateway to{" "}
            <span className="text-primary">Global Opportunities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to start your international journey, from job
            search to settlement abroad.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <Link href={feature.href} key={feature.id} className="block">
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="group relative bg-card border rounded-2xl p-6 md:p-6 hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                {/* Gradient Background on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-150`}
                />

                <div className="flex items-center gap-4 pb-4">
                  {/* Icon with fixed size - no margin bottom */}
                  <motion.div
                    className={`w-16 h-16 md:w-16 md:h-16 rounded-xl bg-linear-to-br ${feature.color} bg-opacity-10 flex items-center justify-center relative overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-150 flex-shrink-0`}
                  >
                    {/* Pulsing background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: feature.delay,
                      }}
                      className="absolute inset-0 bg-white/20 blur-xl"
                    />
                    <feature.icon
                      className={`h-8 w-8 md:h-10 md:w-10 relative z-10 transition-colors duration-150 text-background`}
                    />
                  </motion.div>

                  {/* Title - takes remaining space and handles 2 lines */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-xl md:text-2xl md:pr-8 font-bold transition-colors duration-150 leading-tight ${feature.textColor}`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm md:text-base mb-4 leading-6">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150 group/link"
                >
                  <span>Learn More</span>
                  <motion.span
                    animate={{ x: 0 }}
                    className="inline-block ml-2 group-hover/link:translate-x-1 transition-transform duration-150"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </div>

                {/* Decorative corner line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay + 0.5, duration: 0.4 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent origin-left"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors duration-150 font-medium group"
          >
            <span>Explore All Services</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
