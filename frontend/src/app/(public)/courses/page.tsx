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
  GraduationCap,
  Globe,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
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

// Mock Courses Data
const coursesData = [
  {
    id: 1,
    title: "IELTS Academic Course",
    description: "Comprehensive preparation for IELTS Academic exam",
    fee: "LKR 45,000",
    migrationPaths: ["UK", "Australia", "Canada"],
    requirements: "Basic English",
    category: "Language",
    duration: "3 months",
    level: "Intermediate",
    provider: "British Council",
    image: "/images/course-1.jpg",
  },
  {
    id: 2,
    title: "JLPT N5 Japanese",
    description: "Japanese language proficiency test preparation",
    fee: "LKR 55,000",
    migrationPaths: ["Japan SSW"],
    requirements: "None",
    category: "Language",
    duration: "4 months",
    level: "Beginner",
    provider: "Japan Foundation",
    image: "/images/course-2.jpg",
  },
  {
    id: 3,
    title: "Caregiver Training",
    description: "Professional caregiver certification for international work",
    fee: "LKR 120,000",
    migrationPaths: ["Japan", "Germany"],
    requirements: "O/L or A/L",
    category: "Healthcare",
    duration: "6 months",
    level: "Professional",
    provider: "Healthcare Academy",
    image: "/images/course-3.jpg",
  },
  {
    id: 4,
    title: "PTE Academic Course",
    description: "Pearson Test of English preparation",
    fee: "LKR 48,000",
    migrationPaths: ["Australia", "New Zealand", "UK"],
    requirements: "Basic English",
    category: "Language",
    duration: "2 months",
    level: "Intermediate",
    provider: "Pearson",
    image: "/images/course-4.jpg",
  },
  {
    id: 5,
    title: "TOEFL iBT Preparation",
    description: "Test of English as a Foreign Language",
    fee: "LKR 52,000",
    migrationPaths: ["USA", "Canada"],
    requirements: "Intermediate English",
    category: "Language",
    duration: "3 months",
    level: "Intermediate",
    provider: "ETS",
    image: "/images/course-5.jpg",
  },
  {
    id: 6,
    title: "JLPT N4 Japanese",
    description: "Intermediate Japanese language course",
    fee: "LKR 65,000",
    migrationPaths: ["Japan SSW", "Japan Engineer"],
    requirements: "JLPT N5 or equivalent",
    category: "Language",
    duration: "5 months",
    level: "Intermediate",
    provider: "Japan Foundation",
    image: "/images/course-6.jpg",
  },
  {
    id: 7,
    title: "Nursing Assistant",
    description: "Certified nursing assistant training",
    fee: "LKR 95,000",
    migrationPaths: ["UK", "Germany", "UAE"],
    requirements: "Science O/L or A/L",
    category: "Healthcare",
    duration: "4 months",
    level: "Professional",
    provider: "HealthTrain",
    image: "/images/course-7.jpg",
  },
  {
    id: 8,
    title: "Construction Safety",
    description: "Safety certification for construction workers",
    fee: "LKR 35,000",
    migrationPaths: ["UAE", "Qatar", "Saudi Arabia"],
    requirements: "Basic literacy",
    category: "Vocational",
    duration: "2 weeks",
    level: "Beginner",
    provider: "Safety First",
    image: "/images/course-8.jpg",
  },
  {
    id: 9,
    title: "Welding Certification",
    description: "International welding certification",
    fee: "LKR 85,000",
    migrationPaths: ["Australia", "Canada", "Germany"],
    requirements: "Technical background",
    category: "Vocational",
    duration: "3 months",
    level: "Intermediate",
    provider: "WeldTech",
    image: "/images/course-9.jpg",
  },
  {
    id: 10,
    title: "German Language A1",
    description: "Basic German for work and study",
    fee: "LKR 42,000",
    migrationPaths: ["Germany", "Austria"],
    requirements: "None",
    category: "Language",
    duration: "2 months",
    level: "Beginner",
    provider: "Goethe Institute",
    image: "/images/course-10.jpg",
  },
  {
    id: 11,
    title: "German Language B1",
    description: "Intermediate German for work",
    fee: "LKR 68,000",
    migrationPaths: ["Germany", "Austria", "Switzerland"],
    requirements: "German A2",
    category: "Language",
    duration: "4 months",
    level: "Intermediate",
    provider: "Goethe Institute",
    image: "/images/course-11.jpg",
  },
  {
    id: 12,
    title: "Electrician License",
    description: "International electrician certification",
    fee: "LKR 110,000",
    migrationPaths: ["Australia", "Canada", "UK"],
    requirements: "Electrical background",
    category: "Vocational",
    duration: "6 months",
    level: "Professional",
    provider: "ElectroSkills",
    image: "/images/course-12.jpg",
  },
  {
    id: 13,
    title: "Hospitality Management",
    description: "Hotel and restaurant management course",
    fee: "LKR 78,000",
    migrationPaths: ["Dubai", "Singapore", "Maldives"],
    requirements: "O/L or A/L",
    category: "Hospitality",
    duration: "4 months",
    level: "Intermediate",
    provider: "Hospitality Institute",
    image: "/images/course-13.jpg",
  },
  {
    id: 14,
    title: "Commercial Cooking",
    description: "Professional chef training",
    fee: "LKR 92,000",
    migrationPaths: ["UK", "Australia", "Canada"],
    requirements: "Interest in cooking",
    category: "Hospitality",
    duration: "5 months",
    level: "Intermediate",
    provider: "Culinary Arts",
    image: "/images/course-14.jpg",
  },
  {
    id: 15,
    title: "IT Support Specialist",
    description: "CompTIA A+ certification",
    fee: "LKR 135,000",
    migrationPaths: ["Global"],
    requirements: "Basic computer knowledge",
    category: "IT",
    duration: "6 months",
    level: "Beginner",
    provider: "TechSkills",
    image: "/images/course-15.jpg",
  },
  {
    id: 16,
    title: "Digital Marketing",
    description: "Google and Meta certifications",
    fee: "LKR 88,000",
    migrationPaths: ["Remote work", "Global"],
    requirements: "Basic marketing knowledge",
    category: "IT",
    duration: "4 months",
    level: "Intermediate",
    provider: "Digital Academy",
    image: "/images/course-16.jpg",
  },
  {
    id: 17,
    title: "Scaffolding Safety",
    description: "Scaffolding erection and safety",
    fee: "LKR 48,000",
    migrationPaths: ["UAE", "Qatar", "Saudi Arabia"],
    requirements: "Physical fitness",
    category: "Vocational",
    duration: "3 weeks",
    level: "Beginner",
    provider: "Construction Safety",
    image: "/images/course-17.jpg",
  },
  {
    id: 18,
    title: "HVAC Technician",
    description: "Heating, ventilation, and AC training",
    fee: "LKR 105,000",
    migrationPaths: ["Canada", "USA", "UAE"],
    requirements: "Technical background",
    category: "Vocational",
    duration: "5 months",
    level: "Intermediate",
    provider: "HVAC Institute",
    image: "/images/course-18.jpg",
  },
];

// Course Categories
const courseCategories = [
  "All Categories",
  "Language",
  "Healthcare",
  "Vocational",
  "Hospitality",
  "IT",
];

// Migration Paths
const migrationPaths = [
  "All Destinations",
  "UK",
  "Australia",
  "Canada",
  "Japan",
  "Germany",
  "UAE",
  "Qatar",
  "USA",
  "Singapore",
  "Global",
];

// Requirements Levels
const requirementLevels = [
  "All Requirements",
  "None",
  "Basic English",
  "O/L or A/L",
  "Intermediate English",
  "Technical background",
  "Science O/L or A/L",
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

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    destination: "",
    requirement: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // State for expand/collapse all filters
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Ref for the courses container to scroll to top
  const coursesContainerRef = useRef<HTMLDivElement>(null);

  const coursesPerPage = 15; // 3x5 grid = 15 items per page

  // Filter courses based on filters
  const filteredCourses = coursesData.filter((course) => {
    // Filter by search
    if (
      filters.search &&
      !course.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.category &&
      filters.category !== "All Categories" &&
      course.category !== filters.category
    ) {
      return false;
    }

    // Filter by destination
    if (filters.destination && filters.destination !== "All Destinations") {
      if (
        !course.migrationPaths.some((path) =>
          path.includes(filters.destination),
        )
      ) {
        return false;
      }
    }

    // Filter by requirement
    if (filters.requirement && filters.requirement !== "All Requirements") {
      if (!course.requirements.includes(filters.requirement)) {
        return false;
      }
    }

    return true;
  });

  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  // Get current courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      destination: "",
      requirement: "",
    });
    setCurrentPage(1);
  };

  // Smooth scroll to top function
  const scrollToTop = () => {
    // Scroll the main window to top
    window.scrollTo({
      top: 144,
      behavior: "smooth",
    });

    // Also try to scroll the courses container if it exists
    if (coursesContainerRef.current) {
      coursesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  const goToPage = (page: number) => {
    const newPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(newPage);
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
      {/* <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="pt-8 pb-4 mx-4 sm:mx-6 lg:mx-8 border-b"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          ගොඩයන
          <span className="text-primary"> Courses</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Equip yourself with the right skills and languages to succeed in your
          global migration journey.
        </p>
      </motion.div> */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-blue-400 via-blue-700 to-blue-900 rounded-b-lg text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90 ">
          <span className="font-fm-gamunu text-[40px] md:text-5xl">ගොඩයන </span>
          <span className="text-background/90"> Courses</span>
        </h1>
        <p className="text-background/80 relative">
          Equip yourself with the right skills and languages to succeed in your
          global migration journey.
        </p>
      </motion.div>

      {/* Mobile Filter Button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="lg:hidden bg-background/80 backdrop-blur-md sticky top-16 pt-2 pb-3 z-20 border-b mx-4"
      >
        <div className="bg-background px-4 sm:px-6 lg:px-8">
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

                  {/* Search Filter - Always Visible */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">
                      Search Courses
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Course name..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <motion.button
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="w-full mb-2 flex items-center justify-end rounded-lg gap-2 transition-colors text-sm text-muted-foreground hover:text-primary cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-medium">
                      {filtersExpanded ? "Collapse Filters" : "Expand Filters"}
                    </span>
                    <motion.div
                      animate={{ rotate: filtersExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Collapsible Filter Sections */}
                  <AnimatePresence>
                    {filtersExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Category Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
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
                              {courseCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Destination Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
                            Migration Path
                          </label>
                          <Select
                            value={filters.destination}
                            onValueChange={(value) =>
                              handleFilterChange("destination", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {migrationPaths.map((dest) => (
                                <SelectItem key={dest} value={dest}>
                                  {dest}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Requirements Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
                            Requirements
                          </label>
                          <Select
                            value={filters.requirement}
                            onValueChange={(value) =>
                              handleFilterChange("requirement", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              {requirementLevels.map((req) => (
                                <SelectItem key={req} value={req}>
                                  {req}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Apply Filters Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-6"
                        >
                          <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            onClick={handleApplyFilters}
                          >
                            Apply Filters
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Show Apply Filters button even when collapsed if filters are applied */}
                  {!filtersExpanded &&
                    (filters.category ||
                      filters.destination ||
                      filters.requirement) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Active filters:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {filters.category &&
                              filters.category !== "All Categories" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.category}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("category", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                            {filters.destination &&
                              filters.destination !== "All Destinations" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.destination}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("destination", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                            {filters.requirement &&
                              filters.requirement !== "All Requirements" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.requirement}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("requirement", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                          </div>
                        </div>
                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          onClick={handleApplyFilters}
                        >
                          Apply Filters
                        </Button>
                      </motion.div>
                    )}
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
                className="lg:hidden w-full sticky top-31 z-20"
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

                  {/* Search Filter - Always Visible */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">
                      Search Courses
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Course name..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Expand/Collapse Button for Mobile */}
                  <motion.button
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="w-full mb-4 flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-medium">
                      {filtersExpanded ? "Collapse Filters" : "Expand Filters"}
                    </span>
                    <motion.div
                      animate={{ rotate: filtersExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Collapsible Filter Sections for Mobile */}
                  <AnimatePresence>
                    {filtersExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Category Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
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
                              {courseCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Destination Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
                            Migration Path
                          </label>
                          <Select
                            value={filters.destination}
                            onValueChange={(value) =>
                              handleFilterChange("destination", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {migrationPaths.map((dest) => (
                                <SelectItem key={dest} value={dest}>
                                  {dest}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Requirements Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
                            Requirements
                          </label>
                          <Select
                            value={filters.requirement}
                            onValueChange={(value) =>
                              handleFilterChange("requirement", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              {requirementLevels.map((req) => (
                                <SelectItem key={req} value={req}>
                                  {req}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Apply Filters Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-6"
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Show Apply Filters button even when collapsed if filters are applied */}
                  {!filtersExpanded &&
                    (filters.category ||
                      filters.destination ||
                      filters.requirement) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Active filters:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {filters.category &&
                              filters.category !== "All Categories" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.category}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("category", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                            {filters.destination &&
                              filters.destination !== "All Destinations" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.destination}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("destination", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                            {filters.requirement &&
                              filters.requirement !== "All Requirements" && (
                                <Badge variant="secondary" className="text-xs">
                                  {filters.requirement}
                                  <button
                                    onClick={() =>
                                      handleFilterChange("requirement", "")
                                    }
                                    className="ml-1 hover:text-primary"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                          </div>
                        </div>
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
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Courses Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* HIDE PART Div - Keeping as is */}
            <div className="bg-background text-background h-20 w-full z-10 top-0 fixed hidden lg:block">
              HIDE PART
            </div>

            {/* Results Count and Pagination Info */}
            <div className="pb-2 hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:sticky lg:top-20 bg-background pt-3 z-10 border-b">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Showing {totalCourses > 0 ? indexOfFirstCourse + 1 : 0}-
                {Math.min(indexOfLastCourse, totalCourses)} of {totalCourses}{" "}
                courses
              </motion.div>

              {/* Page Navigation */}
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

            {/* Scrollable Courses Container */}
            <div
              ref={coursesContainerRef}
              className="flex-1 overflow-y-auto p-2"
            >
              {currentCourses.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      className="h-full"
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden pt-0 group">
                        {/* Course Header with Icon */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                            >
                              <GraduationCap className="h-6 w-6 text-primary" />
                            </motion.div>
                            <div>
                              <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {course.provider}
                              </p>
                            </div>
                          </div>
                        </div>

                        <CardContent className="px-5 flex flex-col h-full">
                          {/* Top Section - Takes available space */}
                          <div className="flex-1">
                            {/* Course Fee */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                Course Fee
                              </span>
                              <span className="text-xl font-bold text-primary">
                                {course.fee}
                              </span>
                            </div>

                            {/* Migration Paths */}
                            <div className="mb-4">
                              <span className="text-sm text-muted-foreground block mb-2">
                                Migration Path
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {course.migrationPaths.map((path, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-secondary/20 text-secondary-foreground border-secondary/30"
                                  >
                                    <Globe className="h-3 w-3 mr-1" />
                                    {path}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Requirements */}
                            <div className="mb-4">
                              <span className="text-sm text-muted-foreground block mb-2">
                                Requirements
                              </span>
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {course.requirements}
                                </span>
                              </div>
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{course.level}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section - Always at bottom */}
                          <div className="mt-auto">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link href={`/courses/${course.id}`}>
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group">
                                  <span>Enroll Now</span>
                                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </Link>
                            </motion.div>
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
                  <GraduationCap className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No courses found matching your criteria.
                  </p>
                </motion.div>
              )}

              {/* Bottom Pagination for Mobile */}
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
