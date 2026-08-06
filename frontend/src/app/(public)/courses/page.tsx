"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Eye,
  Users,
  Building2,
  Bookmark,
  Share2,
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
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import toast from "react-hot-toast";
import {
  publicCourseEndpoints,
  PublicCourseParams,
  CourseListResponse,
} from "@/lib/api/endpoints/public/publicCourseEndpoints";
import {
  courseCategories,
  migrationPaths,
  requirementLevels,
} from "@/types/course";
import {
  formatCourseCategory,
  formatCourseLevel,
  formatMigrationPath,
  formatRequirementLevel,
  getMigrationPathColor,
} from "@/lib/utils/courseUtils";
import { useSavedCourses } from "@/lib/hooks/useSavedCourses";
import { useAppliedCourses } from "@/lib/hooks/useAppliedCourses";
import { SquareAvatar } from "@/components/ui/SquareAvatar";
import { formatPrice } from "@/lib/utils/priceUtils";
import { useVisitedCourses } from "@/lib/hooks/useVisitedCourses";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 1, y: -30 },
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

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    destination: "",
    requirement: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [courses, setCourses] = useState<CourseListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const coursesContainerRef = useRef<HTMLDivElement>(null);
  const coursesPerPage = 15; // 3x5 grid

  // Saved courses hook
  const { savedCourseIds, toggleSaveCourse, isToggling } = useSavedCourses();

  // Applied courses hook
  const { appliedCourseIds } = useAppliedCourses();

  // Visited courses hook
  const { isCourseVisited } = useVisitedCourses();

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: PublicCourseParams = {
        page: currentPage - 1,
        size: coursesPerPage,
      };

      if (filters.search) {
        params.keyword = filters.search;
      }

      if (filters.category && filters.category !== "All Categories") {
        params.category = filters.category;
      }

      if (filters.destination && filters.destination !== "All Destinations") {
        params.migrationPath = filters.destination;
      }

      if (filters.requirement && filters.requirement !== "All Requirements") {
        params.requirementLevel = filters.requirement;
      }

      const response = await publicCourseEndpoints.getPublicCourses(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCourses(apiResponse.data.content || []);
        setTotalItems(apiResponse.data.totalElements || 0);
        setTotalPages(apiResponse.data.totalPages || 0);
      } else {
        setError(apiResponse.message || "Failed to load courses");
        toast.error(apiResponse.message || "Failed to load courses");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load courses";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, coursesPerPage]);

  // Fetch courses when filters or page changes
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });

    if (coursesContainerRef.current) {
      coursesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleShare = (courseId: string) => {
    navigator.clipboard.writeText(window.location.href + `/${courseId}`);
    toast.success("Link copied to clipboard");
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

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      (filters.category && filters.category !== "All Categories") ||
      (filters.destination && filters.destination !== "All Destinations") ||
      (filters.requirement && filters.requirement !== "All Requirements")
    );
  };

  // Handle save/unsave for a specific course
  const handleToggleSave = async (courseId: string, currentStatus: boolean) => {
    await toggleSaveCourse(courseId, currentStatus);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90">
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
        <div className="px-1 pb-2">
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
                  <div className="mb-3">
                    <label className="text-sm font-medium mb-1 block">
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
                    className="w-full flex items-center justify-end rounded-lg gap-2 transition-colors text-sm text-muted-foreground hover:text-primary cursor-pointer"
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
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {courseCategories.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Destination Filter */}
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {migrationPaths.map((migrationPath) => (
                                <SelectItem
                                  key={migrationPath.value}
                                  value={migrationPath.value}
                                >
                                  {migrationPath.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Requirements Filter */}
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {requirementLevels.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
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

                  {/* Show Apply Filters button when collapsed if filters are applied */}
                  {!filtersExpanded && hasActiveFilters() && (
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
                              {courseCategories.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
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
                              {migrationPaths.map((migrationPath) => (
                                <SelectItem
                                  key={migrationPath.value}
                                  value={migrationPath.value}
                                >
                                  {migrationPath.label}
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
                              {requirementLevels.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
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

                  {/* Show Apply Filters button when collapsed if filters are applied */}
                  {!filtersExpanded && hasActiveFilters() && (
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
            {/* Results Count and Pagination Info */}
            <div className="pb-2 hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:sticky lg:top-20 bg-background pt-3 z-10 border-b">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Showing{" "}
                {totalItems > 0 ? (currentPage - 1) * coursesPerPage + 1 : 0}-
                {Math.min(currentPage * coursesPerPage, totalItems)} of{" "}
                {totalItems} courses
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
              className="flex-1 overflow-y-auto pr-2 space-y-4 px-2 py-2"
            >
              {isLoading ? (
                <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                  <SubLoadingScreen
                    message="Loading courses..."
                    fullScreen={false}
                  />
                </div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-red-500">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fetchCourses()}
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : courses.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {courses.map((course) => {
                    const courseId = course.id!;
                    const isSaved = savedCourseIds.includes(courseId);
                    const isApplied = appliedCourseIds.includes(courseId);
                    const visited =
                      isCourseVisited(courseId) || isSaved || isApplied;

                    let flag = "Viewed";
                    if (isSaved) {
                      flag = "Saved";
                    }
                    if (isApplied) {
                      flag = "Enrolled";
                    }

                    return (
                      <motion.div
                        key={course.id}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        className="h-full"
                      >
                        <Card
                          className={`h-full hover:shadow-xl transition-all duration-300 overflow-hidden pt-0 group relative ${visited ? "border-secondary/70 bg-secondary/5" : ""}`}
                        >
                          {/* Course Header with Image/Icon */}
                          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b">
                            <div className="flex items-center gap-3">
                              {/* <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0"
                              > */}
                              {course.logoUrl ? (
                                <SquareAvatar
                                  src={course.logoUrl}
                                  alt={course.companyName || "Company"}
                                  fallback={
                                    course.companyName
                                      ? course.companyName.charAt(0)
                                      : "C"
                                  }
                                  size={48}
                                />
                              ) : (
                                <GraduationCap className="h-6 w-6 text-primary" />
                              )}
                              {/* </motion.div> */}
                              <div className="flex-1 min-w-0">
                                <h3
                                  className={`font-bold group-hover:text-primary transition-colors ${visited ? "text-primary" : ""}`}
                                >
                                  <Link href={`/courses/${course.id}`}>
                                    {course.courseTitle}
                                  </Link>
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {course.companyName || "Provider"}
                                </p>
                              </div>
                              {/* Status Badges */}
                              {/* <div className="flex flex-col gap-1 absolute top-0 right-0">
                                {isApplied && (
                                  <div className="absolute top-0 left-0 rounded-br-full px-4 text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ">
                                    Enrolled
                                  </div>
                                )}
                                {isSaved && !isApplied && (
                                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-4 rounded-bl-full text-[10px]">
                                    Saved
                                  </div>
                                )}
                              </div> */}

                              {/* Status badge */}
                              {visited && (
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-bl-full px-4 text-[10px]">
                                  {flag}
                                </div>
                              )}
                            </div>
                          </div>

                          <CardContent className="px-5 flex flex-col h-full">
                            {/* Top Section - Takes available space */}
                            <div className="flex-1">
                              {/* Course Fee */}
                              <div className="flex items-center justify-center mb-2">
                                <span className="text-sm text-muted-foreground">
                                  {/* Course Fee */}
                                </span>
                                <span className="text-xl font-bold text-primary">
                                  {course.price
                                    ? formatPrice(course.price)
                                    : "Free"}
                                </span>
                              </div>

                              {/* Migration Paths */}
                              {course.migrationPaths &&
                                course.migrationPaths.length > 0 && (
                                  <div className="mb-4">
                                    <span className="text-sm text-muted-foreground block mb-2">
                                      Migration Path
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                      {course.migrationPaths.map(
                                        (path, idx) => (
                                          <Badge
                                            key={idx}
                                            className={getMigrationPathColor(
                                              path,
                                            )}
                                          >
                                            <Globe className="h-3 w-3 mr-1" />
                                            {formatMigrationPath(path)}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Requirements */}
                              {course.requirementLevel && (
                                <div className="mb-4">
                                  <span className="text-sm text-muted-foreground block mb-2">
                                    Requirements
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">
                                      {formatRequirementLevel(
                                        course.requirementLevel,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Additional Details */}
                              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                                {course.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{course.duration}</span>
                                  </div>
                                )}
                                {course.courseLevel && (
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span>
                                      {formatCourseLevel(course.courseLevel)}
                                    </span>
                                  </div>
                                )}
                                {course.enrollType && (
                                  <div className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    <span className="capitalize">
                                      {course.enrollType}
                                    </span>
                                  </div>
                                )}
                                {course.startDate && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      Starts: {formatDate(course.startDate)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bottom Section - Always at bottom */}
                            <div className="mt-auto space-y-2">
                              {/* Stats */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {course.viewCount || 0} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {course.enrollmentCount || 0} enrolled
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex-1"
                                >
                                  <Link href={`/courses/${course.id}`}>
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group">
                                      <span>View & Enroll</span>
                                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                  </Link>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={`cursor-pointer ${isSaved ? "text-primary bg-primary/10" : ""}`}
                                    onClick={() =>
                                      handleToggleSave(courseId, isSaved)
                                    }
                                    disabled={isToggling}
                                  >
                                    <Bookmark
                                      className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`}
                                    />
                                  </Button>
                                </motion.div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleShare(courseId)}
                                  className="cursor-pointer"
                                >
                                  <Share2 size={16} />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
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
