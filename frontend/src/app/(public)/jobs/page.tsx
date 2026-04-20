"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants, Variant } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Globe,
  Home,
  Bookmark,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

// Mock Jobs Data (expanded to 20 items for demonstration)
const jobsData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp Ltd",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 150,000 - 200,000",
    posted: "2 days ago",
    category: "IT & Software",
    experience: "3-5 years",
    isOverseas: false,
    logo: "/images/company-1.jpg",
  },
  {
    id: 2,
    title: "Construction Worker",
    company: "Build Masters",
    location: "Dubai, UAE",
    type: "Contract",
    salary: "AED 2,500 - 3,500",
    posted: "1 day ago",
    category: "Construction",
    experience: "2-4 years",
    isOverseas: true,
    logo: "/images/company-2.jpg",
  },
  {
    id: 3,
    title: "Registered Nurse",
    company: "Healthcare International",
    location: "London, UK",
    type: "Full-time",
    salary: "£28,000 - 35,000",
    posted: "3 days ago",
    category: "Healthcare",
    experience: "2-5 years",
    isOverseas: true,
    logo: "/images/company-3.jpg",
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Global Brands Ltd",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 200,000 - 250,000",
    posted: "5 days ago",
    category: "Marketing",
    experience: "5-7 years",
    isOverseas: false,
    logo: "/images/company-4.jpg",
  },
  {
    id: 5,
    title: "Electrician",
    company: "Power Solutions",
    location: "Qatar",
    type: "Contract",
    salary: "QAR 3,000 - 4,000",
    posted: "2 days ago",
    category: "Construction",
    experience: "3-5 years",
    isOverseas: true,
    logo: "/images/company-5.jpg",
  },
  {
    id: 6,
    title: "Accountant",
    company: "Finance Hub",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 120,000 - 150,000",
    posted: "1 week ago",
    category: "Finance",
    experience: "2-4 years",
    isOverseas: false,
    logo: "/images/company-6.jpg",
  },
  {
    id: 7,
    title: "Software Developer",
    company: "Innovate Solutions",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 180,000 - 220,000",
    posted: "3 days ago",
    category: "IT & Software",
    experience: "2-4 years",
    isOverseas: false,
    logo: "/images/company-7.jpg",
  },
  {
    id: 8,
    title: "Civil Engineer",
    company: "BuildCon",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "AED 8,000 - 10,000",
    posted: "4 days ago",
    category: "Engineering",
    experience: "5-8 years",
    isOverseas: true,
    logo: "/images/company-8.jpg",
  },
  {
    id: 9,
    title: "Sales Executive",
    company: "Retail International",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 80,000 - 100,000",
    posted: "2 days ago",
    category: "Sales",
    experience: "1-3 years",
    isOverseas: false,
    logo: "/images/company-9.jpg",
  },
  {
    id: 10,
    title: "Graphic Designer",
    company: "Creative Studio",
    location: "Kandy, Sri Lanka",
    type: "Remote",
    salary: "LKR 90,000 - 120,000",
    posted: "1 week ago",
    category: "Design",
    experience: "2-4 years",
    isOverseas: false,
    logo: "/images/company-10.jpg",
  },
  {
    id: 11,
    title: "HR Manager",
    company: "People First",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 180,000 - 220,000",
    posted: "3 days ago",
    category: "HR",
    experience: "5-7 years",
    isOverseas: false,
    logo: "/images/company-11.jpg",
  },
  {
    id: 12,
    title: "Waiter/Waitress",
    company: "Luxury Hotels",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "AED 2,000 - 2,500",
    posted: "2 days ago",
    category: "Hospitality",
    experience: "1-2 years",
    isOverseas: true,
    logo: "/images/company-12.jpg",
  },
  {
    id: 13,
    title: "Data Analyst",
    company: "DataWorks",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 130,000 - 160,000",
    posted: "4 days ago",
    category: "IT & Software",
    experience: "2-4 years",
    isOverseas: false,
    logo: "/images/company-13.jpg",
  },
  {
    id: 14,
    title: "Project Manager",
    company: "Global Projects",
    location: "Singapore",
    type: "Full-time",
    salary: "SGD 4,000 - 5,500",
    posted: "1 week ago",
    category: "Management",
    experience: "5-8 years",
    isOverseas: true,
    logo: "/images/company-14.jpg",
  },
  {
    id: 15,
    title: "Chef",
    company: "Fine Dining",
    location: "London, UK",
    type: "Full-time",
    salary: "£24,000 - 28,000",
    posted: "3 days ago",
    category: "Hospitality",
    experience: "3-5 years",
    isOverseas: true,
    logo: "/images/company-15.jpg",
  },
  {
    id: 16,
    title: "Driver",
    company: "Transport Co",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 60,000 - 70,000",
    posted: "2 days ago",
    category: "Transport",
    experience: "2-4 years",
    isOverseas: false,
    logo: "/images/company-16.jpg",
  },
  {
    id: 17,
    title: "Security Guard",
    company: "Secure Solutions",
    location: "Qatar",
    type: "Contract",
    salary: "QAR 2,000 - 2,500",
    posted: "5 days ago",
    category: "Security",
    experience: "1-3 years",
    isOverseas: true,
    logo: "/images/company-17.jpg",
  },
  {
    id: 18,
    title: "Teacher",
    company: "International School",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 100,000 - 130,000",
    posted: "1 week ago",
    category: "Education",
    experience: "3-5 years",
    isOverseas: false,
    logo: "/images/company-18.jpg",
  },
  {
    id: 19,
    title: "Pharmacist",
    company: "HealthPlus",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "AED 8,000 - 10,000",
    posted: "3 days ago",
    category: "Healthcare",
    experience: "3-5 years",
    isOverseas: true,
    logo: "/images/company-19.jpg",
  },
  {
    id: 20,
    title: "Customer Service",
    company: "Call Center",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "LKR 70,000 - 85,000",
    posted: "2 days ago",
    category: "Customer Service",
    experience: "1-2 years",
    isOverseas: false,
    logo: "/images/company-20.jpg",
  },
];

// Job Categories
const categories = [
  "IT & Software",
  "Healthcare",
  "Construction",
  "Marketing",
  "Finance",
  "Education",
  "Hospitality",
  "Engineering",
  "Sales",
  "Design",
  "HR",
  "Management",
  "Transport",
  "Security",
  "Customer Service",
];

// Employment Types
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Freelance",
];

// Experience Levels
const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (5-8 years)",
  "Expert (8+ years)",
];

// Locations
const locations = [
  "Colombo, Sri Lanka",
  "Kandy, Sri Lanka",
  "Galle, Sri Lanka",
  "Dubai, UAE",
  "London, UK",
  "Qatar",
  "Singapore",
  "Australia",
];

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

const slideInLeft: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const slideInRight: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const buttonTapAnimation: Variant = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

const buttonHoverAnimation: Variant = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

type JobType = "all" | "local" | "overseas";

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobType, setJobType] = useState<JobType>("all");
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    experience: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Ref for the jobs container to scroll to top
  const jobsContainerRef = useRef<HTMLDivElement>(null);

  const jobsPerPage = 10;

  // Filter jobs based on type and filters
  const filteredJobs = jobsData.filter((job) => {
    // Filter by job type (all/local/overseas)
    if (jobType === "local" && job.isOverseas) return false;
    if (jobType === "overseas" && !job.isOverseas) return false;

    // Filter by keyword
    if (
      filters.keyword &&
      !job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
      !job.company.toLowerCase().includes(filters.keyword.toLowerCase())
    ) {
      return false;
    }

    // Filter by location
    if (filters.location && job.location !== filters.location) return false;

    // Filter by category
    if (filters.category && job.category !== filters.category) return false;

    // Filter by employment type
    if (filters.type && job.type !== filters.type) return false;

    // Filter by experience
    if (filters.experience) {
      // Simple mapping - in real app you'd have more sophisticated logic
      const expMap: { [key: string]: string[] } = {
        "Entry Level (0-2 years)": ["0-2 years", "1-2 years", "1-3 years"],
        "Mid Level (3-5 years)": ["2-4 years", "3-5 years"],
        "Senior Level (5-8 years)": ["5-7 years", "5-8 years"],
        "Expert (8+ years)": ["8+ years"],
      };
      if (
        !expMap[filters.experience]?.some((e) => job.experience.includes(e))
      ) {
        return false;
      }
    }

    return true;
  });

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      experience: "",
    });
    setCurrentPage(1);
  };

  const handleJobTypeChange = (type: JobType) => {
    setJobType(type);
    setCurrentPage(1);
    scrollToTop();
  };

  // Smooth scroll to top function
  const scrollToTop = () => {
    // Scroll the main window to top
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });

    // Also try to scroll the jobs container if it exists
    if (jobsContainerRef.current) {
      jobsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    // Small delay to ensure state update before scroll
    setTimeout(scrollToTop, 100);
  };

  const goToPage = (page: number) => {
    const newPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(newPage);
    // Small delay to ensure state update before scroll
    setTimeout(scrollToTop, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-blue-400 via-blue-700 to-blue-900 rounded-b-lg text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90 ">
          <span className="font-fm-gamunu text-[40px] md:text-[40px] md:text-5xl">ගොඩයන </span>
          Jobs
        </h1>
        <p className="text-background/80 relative">
          Find your dream career locally or globally.
        </p>
      </motion.div>

      {/* Mobile Filter Button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="lg:hidden bg-background/80 backdrop-blur-md sticky top-16 pt-2 pb-3 z-20 border-b mx-4"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="px-1 pb-2"
        >
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => handleJobTypeChange("all")}
              className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                jobType === "all"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                All
              </span>
              {jobType === "all" && (
                <motion.div
                  layoutId="jobTypeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => handleJobTypeChange("local")}
              className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                jobType === "local"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Local
              </span>
              {jobType === "local" && (
                <motion.div
                  layoutId="jobTypeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => handleJobTypeChange("overseas")}
              className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                jobType === "overseas"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Overseas
              </span>
              {jobType === "overseas" && (
                <motion.div
                  layoutId="jobTypeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>
        <div className="lg:hidden bg-background">
          <motion.div>
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <motion.div
                animate={{ rotate: showMobileFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="h-4 w-4" />
              </motion.div>
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 pt-2 md:pt-0 px-4 sm:px-6 lg:px-8 pb-8 min-h-0">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Filters Sidebar - Desktop */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="hidden lg:w-80 lg:block pt-4"
          >
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-card border rounded-xl py-3 px-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearFilters();
                          scrollToTop();
                        }}
                        className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        Clear All
                      </Button>
                    </motion.div>
                  </div>

                  {/* Keyword Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title..."
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
                        }
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) =>
                        handleFilterChange("location", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employment Type Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Employment Type
                    </label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) =>
                        handleFilterChange("type", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Experience Level
                    </label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) =>
                        handleFilterChange("experience", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((exp) => (
                          <SelectItem key={exp} value={exp}>
                            {exp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Apply Filters Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      onClick={handleApplyFilters}
                    >
                      Apply Filters
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Filters Sidebar - Mobile */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden w-full sticky top-40 z-20"
              >
                <div className="bg-card border rounded-xl py-3 px-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearFilters();
                          scrollToTop();
                        }}
                        className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        Clear All
                      </Button>
                    </motion.div>
                  </div>

                  {/* Keyword Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title..."
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
                        }
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) =>
                        handleFilterChange("location", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employment Type Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Employment Type
                    </label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) =>
                        handleFilterChange("type", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level Filter */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">
                      Experience Level
                    </label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) =>
                        handleFilterChange("experience", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((exp) => (
                          <SelectItem key={exp} value={exp}>
                            {exp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Apply Filters Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      onClick={() => {
                        handleApplyFilters();
                        setShowMobileFilters(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs List - Independent Scroll */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Results Count and Pagination Info - Sticky within jobs column */}
            <div className="pb-2 hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:sticky lg:top-20 bg-background pt-3 z-10 border-b">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="px-4 sm:px-6 lg:px-8"
              >
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleJobTypeChange("all")}
                    className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                      jobType === "all"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      All Jobs
                    </span>
                    {jobType === "all" && (
                      <motion.div
                        layoutId="jobTypeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => handleJobTypeChange("local")}
                    className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                      jobType === "local"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Local Jobs
                    </span>
                    {jobType === "local" && (
                      <motion.div
                        layoutId="jobTypeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => handleJobTypeChange("overseas")}
                    className={`relative px-4 py-1 text-sm font-medium transition-colors cursor-pointer ${
                      jobType === "overseas"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Overseas Jobs
                    </span>
                    {jobType === "overseas" && (
                      <motion.div
                        layoutId="jobTypeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Showing {totalJobs > 0 ? indexOfFirstJob + 1 : 0}-
                {Math.min(indexOfLastJob, totalJobs)} of {totalJobs} jobs
              </motion.div>

              {/* Page Navigation with Animations */}
              {totalPages > 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <motion.span
                    key={currentPage}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm"
                  >
                    Page {currentPage} of {totalPages}
                  </motion.span>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* HIDE PART Div - Keeping as is */}
            <div className="bg-background text-background h-20 w-full z-10 top-0 fixed hidden lg:block">
              HIDE PART
            </div>

            {/* Scrollable Jobs Container */}
            <div
              ref={jobsContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-4 px-2 py-2"
            >
              {currentJobs.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {currentJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 py-2">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Company Logo Placeholder */}
                            <motion.div
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                              className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                            >
                              <Briefcase className="h-8 w-8 text-primary" />
                            </motion.div>

                            {/* Job Details */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                  <Link href={`/jobs/${job.id}`}>
                                    {job.title}
                                  </Link>
                                </h3>
                                {job.isOverseas && (
                                  <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="bg-secondary/20 text-secondary-foreground border-secondary/30 w-fit"
                                    >
                                      Overseas
                                    </Badge>
                                  </motion.div>
                                )}
                              </div>

                              <p className="text-muted-foreground mb-3">
                                {job.company}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Briefcase className="h-4 w-4 text-primary shrink-0" />
                                  <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-4 w-4 text-primary shrink-0" />
                                  <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-primary shrink-0" />
                                  <span>{job.posted}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Briefcase className="h-4 w-4 text-primary shrink-0" />
                                  <span>{job.category}</span>
                                </div>
                              </div>

                              {/* Action Buttons Section */}
                              <div className="flex sm:flex-row gap-3 items-stretch md:items-end justify-end pt-4">
                                {/* Bookmark/Save Button */}
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="md:self-start"
                                >
                                  <Button
                                    className="cursor-pointer text-primary bg-background"
                                    onClick={() => {
                                      // Add your save/bookmark logic here
                                      console.log("Saved job:", job.id);
                                    }}
                                  >
                                    <Bookmark className="h-6 w-6" />
                                  </Button>
                                </motion.div>

                                {/* Apply Button - Right on md+, full width on mobile */}
                                <motion.div
                                  className="flex-1 md:flex-initial"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Link
                                    href={`/jobs/${job.id}/apply`}
                                    className="block"
                                  >
                                    <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer px-8 group">
                                      View & Apply
                                      <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                  </Link>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    No jobs found matching your criteria.
                  </p>
                </motion.div>
              )}

              {/* Bottom Pagination for Mobile with Animations */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 mt-8 mb-4 lg:hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <motion.span
                    key={currentPage}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm"
                  >
                    Page {currentPage} of {totalPages}
                  </motion.span>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
