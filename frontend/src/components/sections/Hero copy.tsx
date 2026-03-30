"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Globe,
  CheckCircle,
  TrendingUp,
  PlaneTakeoff,
} from "lucide-react";
import type { Variants } from "framer-motion";
import Image from "next/image";

// Animation variants
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
  hidden: { y: 20, opacity: 0 },
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

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const floatingVariants2: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      delay: 0.5,
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

export function Hero() {
  return (
    <section className="relative pt-0 md:pt-0 min-h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] overflow-y-hidden overflow-x-hidden w-full">
      {/* Background decorative elements with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl hidden md:block"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl hidden md:block"
        />
        {/* Mobile background blurs - smaller */}
        <div className="absolute top-10 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl md:hidden" />
        <div className="absolute bottom-10 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl md:hidden" />
      </motion.div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-8 max-w-[100vw] overflow-x-hidden overflow-y-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Left Column - Content */}
          <div className="space-y-4 md:space-y-6 px-2 sm:px-0 flex-col items-center md:items-start text-center md:text-left">
            {/* NEW Badge */}
            <motion.div variants={itemVariants}>
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-950 text-primary border border-blue-200 dark:border-blue-900 px-3 sm:px-4 py-1.5 sm:py-2 mt-3 sm:mt-4 text-[8px] sm:text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
              >
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1 shrink-0"></span>
                <span className="truncate">
                  NEW: OVERSEAS OPPORTUNITIES IN 15+ COUNTRIES
                </span>
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              //variants={itemVariants}
              className="text-6xl sm:text-5xl md:text-6xl lg:text-[80px] text-center md:text-left font-bold font-sinhala md:pl-8 pb-6 mb-0 md:mb-8 md:pb-12 mt-6 sm:mt-6"
              style={{ lineHeight: "0.85", letterSpacing: "0.04em" }}
            >
              <motion.span
                // animate={{
                //   y: [0, -10, 0],
                //   scale: [1, 1.05, 1],
                // }}
                // transition={{
                //   duration: 2,
                //   repeat: Infinity,
                //   repeatType: "reverse",
                //   ease: "easeInOut",
                //   delay: 0,
                // }}
                className="inline-block"
              >
                ජීවිතේම
              </motion.span>{" "}
              <br />
              <span className="text-primary relative whitespace-nowrap">
                <motion.span
                  // animate={{
                  //   y: [0, -12, 0],
                  //   scale: [1, 1.08, 1],
                  // }}
                  // transition={{
                  //   duration: 2.2,
                  //   repeat: Infinity,
                  //   repeatType: "reverse",
                  //   ease: "easeInOut",
                  //   delay: 0.2,
                  // }}
                  className="inline-block"
                >
                  ගොඩයන්න
                </motion.span>
                <motion.svg
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 left-0 w-full h-6 sm:h-8 md:h-10 text-primary/20"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,10 50,5 T100,5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </motion.svg>
              </span>
              <br />
            </motion.h1>

            {/* Mobile Image - Shown only below lg breakpoint */}
            <div className="lg:hidden w-full px-4">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative circles */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
                />

                {/* Image placeholder with animation */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border border-primary/20 flex items-center justify-center backdrop-blur-sm overflow-hidden"
                >
                  <Image
                    src="/images/hero.jpg"
                    alt="Hero"
                    fill
                    className="object-cover rounded-3xl"
                    sizes="(max-width: 868px) 100vw, 50vw"
                    priority
                  />
                </motion.div>

                {/* Floating stats - Repositioned for mobile */}
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute -left-4 top-16 bg-card border rounded-lg shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">
                        Active Vacancies
                      </span>
                      <span className="text-lg font-bold text-center">
                        2,450+
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={floatingVariants2}
                  initial="initial"
                  animate="animate"
                  className="absolute -right-4 bottom-16 bg-card border rounded-lg shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <PlaneTakeoff className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">
                        Overseas Jobs
                      </span>
                      <span className="text-lg font-bold text-center">
                        840+
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-md text-muted-foreground max-w-lg px-4 sm:px-0 text-center md:text-left -mt-8 md:mt-0"
            >
              The premier platform connecting Sri Lankan talent with top local
              companies and global employers. Your career journey starts here.
            </motion.p>

            {/* Stats */}
            {/* <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-8 pt-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-2xl font-bold"
                  >
                    2,450+
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    Active Vacancies
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"
                >
                  <Globe className="h-5 w-5 text-secondary-foreground" />
                </motion.div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-2xl font-bold"
                  >
                    840+
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    Overseas Jobs
                  </div>
                </div>
              </motion.div>
            </motion.div> */}

            {/* Search Form */}
            <motion.div
              variants={itemVariants}
              className="md:pt-4 sm:pt-6 px-2 sm:px-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-card border rounded-lg p-2 sm:p-1 flex flex-col sm:flex-row gap-2 shadow-sm w-full"
              >
                <div className="flex-1 w-full">
                  <Input
                    type="text"
                    placeholder="Job title or keywords"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-sm sm:text-base"
                  />
                </div>
                <div className="w-full sm:w-48 cursor-pointer">
                  <Select>
                    <SelectTrigger className="w-full text-sm sm:text-base">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colombo">Local</SelectItem>
                      <SelectItem value="overseas">Overseas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 w-full sm:w-auto cursor-pointer text-sm sm:text-base">
                    Search Jobs
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 md:pt-2 pb-4 md:pb-2 text-xs sm:text-sm text-muted-foreground px-2 sm:px-0"
            >
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-1 sm:gap-2 cursor-default"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                </motion.div>
                <span className="whitespace-nowrap">Verified Companies</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-1 sm:gap-2 cursor-default"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                </motion.div>
                <span className="whitespace-nowrap">Daily Updates</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Visual/Image - Hidden on mobile, shown on lg */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block -mt-4"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
              />

              {/* Image placeholder with animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-10 rounded-3xl flex items-center justify-center"
              >
                {/* Animated overlay with your specified animation */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl border border-primary/20"
                >
                  {/* Image */}
                  <Image
                    src="/images/hero.jpg"
                    alt="Hero"
                    fill
                    className="object-cover rounded-3xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Floating stats */}
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                className="absolute -left-2 top-16 bg-card border rounded-lg shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  {/* Icon with muted background */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>

                  {/* Content centered vertically */}
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-sm text-muted-foreground">
                      Active Vacancies
                    </span>
                    <span className="text-lg sm:text-2xl font-bold text-center">
                      2,450+
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={floatingVariants2}
                initial="initial"
                animate="animate"
                className="absolute -right-6 sm:-right-10 bottom-16 sm:bottom-20 bg-card border rounded-lg shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  {/* Icon with muted background */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <PlaneTakeoff className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>

                  {/* Content centered vertically */}
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-sm text-muted-foreground">
                      Overseas Jobs
                    </span>
                    <span className="text-lg sm:text-2xl font-bold text-center">
                      840+
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
