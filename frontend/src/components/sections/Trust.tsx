"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Map,
  CheckCircle2,
  Award,
  Calculator,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
} from "lucide-react";

const trustPoints = [
  {
    icon: Eye,
    title: "Transparency",
    description: "No hidden costs or false promises. We provide real data.",
  },
  {
    icon: Map,
    title: "Structured Guidance",
    description: "A clear roadmap from your first inquiry to landing abroad.",
  },
  {
    icon: CheckCircle2,
    title: "Verified Opportunities",
    description: "Every job and course is vetted by our expert team.",
  },
  {
    icon: Award,
    title: "National Level Brand",
    description:
      "Built for Sri Lankans, by experts who understand the local context.",
  },
];

export function Trust() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12">
              Why Sri Lankans Trust{" "}
              <span className="text-primary">Godayana</span>
              <span className="text-secondary">.lk</span>
            </h2>

            {/* Trust Points */}
            <div className="space-y-8 mb-12">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <point.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mission Link */}
            <div className="mb-12">
              <Link
                href="/mission"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
              >
                <span>Learn About Our Mission</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Image with Overlapping Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full pb-16 md:pb-0"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/trust-image.jpg" // Replace with your image
                  alt="Sri Lankans trusting Godayana.lk"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -left-2 md:-left-8 top-16 bg-background/95 backdrop-blur-sm border rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Trusted by</div>
                    <div className="text-xl md:text-2xl font-bold">5000+</div>
                    <div className="text-xs text-muted-foreground">
                      Sri Lankans
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            </div>

            {/* Cost Calculator Card - Hidden on mobile, shown on desktop */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20 hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-900/80 dark:to-gray-900/60 rounded-2xl backdrop-blur-xs" />

                <div className="absolute inset-0 rounded-2xl border border-white/60 dark:border-gray-700/30 shadow-xl" />

                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Calculator className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground">
                        Cost Calculator
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Estimate your total migration cost in LKR including
                        visa, flights, and initial stay.
                      </p>
                      <Link
                        href="/calculator"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
                      >
                        <span>Try Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div> */}

            {/* Trust Badge - Hidden on mobile, shown on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20 hidden md:block"
            >
              {/* Glassmorphism Card */}
              <div className="relative">
                {/* Background with blur */}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/40 dark:from-gray-900/80 dark:to-gray-900/60 rounded-2xl backdrop-blur-xs" />

                {/* Border overlay */}
                <div className="absolute inset-0 rounded-2xl border border-white/60 dark:border-gray-700/30 shadow-xl" />

                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground">
                        Start Your Global Journey Today
                      </h3>
                      {/* <p className="text-muted-foreground text-sm mb-4">
                        Explore opportunities in 15+ countries with our
                        comprehensive guides and expert support.
                      </p> */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          Trusted by 10,000+ Sri Lankans
                        </span> */}
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                          500+ Success Stories
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Cost Calculator Card - Shown below image on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="block md:hidden -mt-24 w-full max-w-md mx-auto"
        >
          {/* Glassmorphism Card */}
          <div className="relative">
            {/* Background with blur */}
            <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/40 dark:from-gray-900/80 dark:to-gray-900/60 rounded-2xl backdrop-blur-xs" />

            {/* Border overlay */}
            {/* <div className="absolute inset-0 rounded-2xl border border-white/60 dark:border-gray-700/30 shadow-xl" /> */}

            {/* Content */}
            {/* <div className="relative p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    Cost Calculator
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Estimate your total migration cost in LKR including visa,
                    flights, and initial stay.
                  </p>
                  <Link
                    href="/calculator"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
                  >
                    <span>Try Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div> */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20 md:hidden"
            >
              {/* Glassmorphism Card */}
              <div className="relative">
                {/* Background with blur */}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/40 dark:from-gray-900/80 dark:to-gray-900/60 rounded-2xl backdrop-blur-xs" />

                {/* Border overlay */}
                <div className="absolute inset-0 rounded-2xl border border-white/60 dark:border-gray-700/30 shadow-xl" />

                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground">
                        Start Your Global Journey Today
                      </h3>
                      {/* <p className="text-muted-foreground text-sm mb-4">
                        Explore opportunities in 15+ countries with our
                        comprehensive guides and expert support.
                      </p> */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          Trusted by 10,000+ Sri Lankans
                        </span> */}
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                          500+ Success Stories
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
