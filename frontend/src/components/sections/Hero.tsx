"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useTheme } from "next-themes";

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
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("keyword", searchQuery.trim());
    }

    if (searchLocation && searchLocation !== "all") {
      params.set("location", searchLocation);
    }

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : "/jobs";

    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative pt-24 md:pt-20 xl:pt-24 min-h-[calc(100vh-100px)] md:h-[calc(100vh)] overflow-y-hidden overflow-x-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={"/images/bg_dark.PNG"}
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-blue-500/40 dark:bg-blue-950/50" />
      </div>

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

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-8 max-w-[100vw] overflow-x-hidden overflow-y-hidden h-full items-center justify-center flex">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="gap-8 md:gap-12 h-full"
        >
          {/* Left Column - Content */}
          <div className="px-2 sm:px-0 flex flex-col justify-between h-[calc(100vh-80px)] text-center">
            {/* NEW Badge */}
            <div>
              <motion.div variants={itemVariants}>
                <Badge
                  variant="secondary"
                  className="bg-blue-100/30 dark:bg-blue-950 text-white dark:text-primary border border-blue-200 dark:border-blue-900 px-3 sm:px-4 py-1.5 sm:py-2 mt-3 sm:mt-4 text-[8px] sm:text-[10px] xl:text-[14px] xl:py-3 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                >
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-100/80 dark:bg-primary rounded-full mr-1 shrink-0"></span>
                  <span className="truncate">
                    NEW: OVERSEAS OPPORTUNITIES IN 15+ COUNTRIES
                  </span>
                </Badge>
              </motion.div>
            </div>

            {/* Main Heading */}
            <div>
              <motion.h1
                className="text-7xl sm:text-5xl md:text-6xl lg:text-[90px] xl:text-9xl text-center font-bold font-sinhala md:pl-8 pt-12 md:pt-0"
                style={{ lineHeight: "0.5", letterSpacing: "0.01em" }}
              >
                <span className="inline-block text-white font-fm-gamunu">
                  ජීවිතේම
                </span>{" "}
                <br />
                <span className="text-secondary relative whitespace-nowrap">
                  <span className="inline-block font-fm-gamunu text-8xl md:text-9xl xl:text-[12rem]">
                    ගොඩයන්න
                  </span>
                </span>
                <br />
              </motion.h1>
              <div className="text-center text-lg xl:text-2xl md:pl-8 text-white/80">
                Powering Careers. Connecting Talent.
              </div>
            </div>

            {/* Description */}
            <div>
              {/* Search Form */}
              <motion.div variants={itemVariants} className="px-2 sm:px-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-card/80 border rounded-lg p-2 sm:p-1 flex flex-col sm:flex-row gap-2 shadow-sm w-full"
                >
                  <div className="flex-1 w-full">
                    <Input
                      type="text"
                      placeholder="Job title or keywords"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-sm sm:text-base xl:text-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="w-full sm:w-48 cursor-pointer">
                    <Select
                      value={searchLocation}
                      onValueChange={setSearchLocation}
                    >
                      <SelectTrigger className="w-full text-sm sm:text-base xl:text-xl">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent className="xl:text-lg">
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="colombo">Colombo</SelectItem>
                        <SelectItem value="kandy">Kandy</SelectItem>
                        <SelectItem value="galle">Galle</SelectItem>
                        <SelectItem value="overseas">Overseas</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 w-full sm:w-auto cursor-pointer text-sm sm:text-base xl:text-xl xl:py-4"
                      onClick={handleSearch}
                    >
                      Search Jobs
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <div>
              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center md:justify-center md:gap-16 sm:gap-6 text-xs sm:text-sm xl:text-lg text-muted-foreground px-2 sm:px-0 pb-4 pt-6 xl:pb-8 md:pt-0"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-1 sm:gap-2 cursor-default"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white/80 shrink-0" />
                  </motion.div>
                  <span className="whitespace-nowrap text-white/80">
                    Verified Companies
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-1 sm:gap-2 cursor-default"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-white/80" />
                  </motion.div>
                  <span className="whitespace-nowrap text-white/80">
                    Daily Updates
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
