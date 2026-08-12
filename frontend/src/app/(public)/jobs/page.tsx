"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants, Variant } from "framer-motion";
import Link from "next/link";
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
  ChevronDown,
  Building2,
  Eye,
  Users,
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
import {
  publicJobEndpoints,
  JobListResponse,
  PublicJobsParams,
} from "@/lib/api/endpoints/public/publicJobEndpoints";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import toast from "react-hot-toast";
import { formatLocation } from "@/lib/utils/locationUtils";
import { formatCategory } from "@/lib/utils/companyUtils";
import { SquareAvatar } from "@/components/ui/SquareAvatar";
import { useVisitedJobs } from "@/lib/hooks/useVisitedJobs";
import { useSavedJobs } from "@/lib/hooks/useSavedJobs";
import { useAppliedJobs } from "@/lib/hooks/useAppliedJobs";
import {
  employmentTypes,
  experienceLevels,
  jobCategories,
  locations,
} from "@/types/job";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 1, y: -20 },
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
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [jobs, setJobs] = useState<JobListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { appliedJobIds } = useAppliedJobs();

  // Visited jobs hook
  const { isJobVisited } = useVisitedJobs();

  // Saved jobs hook - using Redux
  const { savedJobIds, toggleSaveJob, isToggling } = useSavedJobs();

  // Ref for the jobs container to scroll to top
  const jobsContainerRef = useRef<HTMLDivElement>(null);

  const jobsPerPage = 10;

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: PublicJobsParams = {
        page: currentPage - 1,
        size: jobsPerPage,
      };

      if (filters.keyword) {
        params.keyword = filters.keyword;
      }

      if (filters.location && filters.location !== "All Locations") {
        params.location = filters.location;
      }

      if (filters.category && filters.category !== "All Categories") {
        params.category = filters.category;
      }

      if (filters.type && filters.type !== "All Types") {
        params.employmentType = filters.type;
      }

      if (filters.experience && filters.experience !== "All Levels") {
        params.experience = filters.experience;
      }

      if (jobType !== "all") {
        params.type = jobType;
      }

      const response = await publicJobEndpoints.getPublicJobs(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setJobs(apiResponse.data.content || []);
        setTotalItems(apiResponse.data.totalElements || 0);
        setTotalPages(apiResponse.data.totalPages || 0);
      } else {
        setError(apiResponse.message || "Failed to load jobs");
        toast.error(apiResponse.message || "Failed to load jobs");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load jobs";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, jobType, jobsPerPage]);

  // Fetch jobs when filters or page changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, jobType]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });

    if (jobsContainerRef.current) {
      jobsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // const handleShare = (jobId: string) => {
  //   navigator.clipboard.writeText(window.location.href + `/${jobId}`);
  //   toast.success("Link copied to clipboard");
  // };

  const handleShare = (job: JobListResponse) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: job.jobTitle + ` (${job.companyName}) ` + " - Godayana.lk",
        text: "Godayana.lk",
        url: window.location.href + `/${job.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href + `/${job.id}`);
      toast.success("Link copied to clipboard");
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

  const hasActiveFilters = () => {
    return (
      filters.keyword !== "" ||
      (filters.location && filters.location !== "All Locations") ||
      (filters.category && filters.category !== "All Categories") ||
      (filters.type && filters.type !== "All Types") ||
      (filters.experience && filters.experience !== "All Levels")
    );
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `LKR ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    if (min) {
      return `From LKR ${min.toLocaleString()}`;
    }
    if (max) {
      return `Up to LKR ${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const formatPostedDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Handle save/unsave for a specific job
  const handleToggleSave = async (jobId: string, currentStatus: boolean) => {
    await toggleSaveJob(jobId, currentStatus);
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
          <span className="font-fm-gamunu text-[40px] md:text-5xl">ගොඩයන </span>
          Jobs
        </h1>
        <p className="text-background/80 relative">
          Find your dream career locally or globally.
        </p>
      </motion.div>

      {/* Mobile Filter Button - keep as is */}
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

      {/* Main Content Area - Filters Sidebar and Jobs List */}
      <div className="flex-1 pt-2 md:pt-0 px-4 sm:px-6 lg:px-8 pb-8 min-h-0">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Filters Sidebar - Desktop (keep as is) */}
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

                  {/* Keyword Filter - Always Visible */}
                  <div className="mb-3">
                    <label className="text-sm font-medium mb-1 block">
                      Keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title or company..."
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
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
                        {/* Location Filter */}
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {locations.map((level) => (
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
                              {jobCategories.map((level) => (
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

                        {/* Employment Type Filter */}
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {employmentTypes.map((level) => (
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

                        {/* Experience Level Filter */}
                        <div className="mb-3">
                          <label className="text-sm font-medium mb-0 block">
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
                              {experienceLevels.map((level) => (
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
                          {filters.location &&
                            filters.location !== "All Locations" && (
                              <Badge variant="secondary" className="text-xs">
                                {filters.location}
                                <button
                                  onClick={() =>
                                    handleFilterChange("location", "")
                                  }
                                  className="ml-1 hover:text-primary"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            )}
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
                          {filters.type && filters.type !== "All Types" && (
                            <Badge variant="secondary" className="text-xs">
                              {filters.type}
                              <button
                                onClick={() => handleFilterChange("type", "")}
                                className="ml-1 hover:text-primary"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {filters.experience &&
                            filters.experience !== "All Levels" && (
                              <Badge variant="secondary" className="text-xs">
                                {filters.experience}
                                <button
                                  onClick={() =>
                                    handleFilterChange("experience", "")
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

          {/* Filters Sidebar - Mobile (keep as is) */}
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

                  {/* Keyword Filter - Always Visible */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">
                      Keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title or company..."
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
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
                        {/* Location Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
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
                              {locations.map((level) => (
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
                              {jobCategories.map((level) => (
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

                        {/* Employment Type Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
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
                              {employmentTypes.map((level) => (
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

                        {/* Experience Level Filter */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">
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
                              {experienceLevels.map((level) => (
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
                          {filters.location &&
                            filters.location !== "All Locations" && (
                              <Badge variant="secondary" className="text-xs">
                                {filters.location}
                                <button
                                  onClick={() =>
                                    handleFilterChange("location", "")
                                  }
                                  className="ml-1 hover:text-primary"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            )}
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
                          {filters.type && filters.type !== "All Types" && (
                            <Badge variant="secondary" className="text-xs">
                              {filters.type}
                              <button
                                onClick={() => handleFilterChange("type", "")}
                                className="ml-1 hover:text-primary"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {filters.experience &&
                            filters.experience !== "All Levels" && (
                              <Badge variant="secondary" className="text-xs">
                                {filters.experience}
                                <button
                                  onClick={() =>
                                    handleFilterChange("experience", "")
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

          {/* Jobs List */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Results Count and Pagination Info */}
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
                Showing{" "}
                {totalItems > 0 ? (currentPage - 1) * jobsPerPage + 1 : 0}-
                {Math.min(currentPage * jobsPerPage, totalItems)} of{" "}
                {totalItems} jobs
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

            {/* Jobs Container */}
            <div
              ref={jobsContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-4 px-2 py-2"
            >
              {isLoading ? (
                <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                  <SubLoadingScreen
                    message="Loading jobs..."
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
                    onClick={() => fetchJobs()}
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : jobs.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {jobs.map((job) => {
                    const jobId = job.id!;
                    const isSaved = savedJobIds.includes(jobId);
                    const isApplied = appliedJobIds.includes(jobId);
                    const visited = isJobVisited(jobId) || isSaved || isApplied;

                    let flag = "Viewed";
                    if (isSaved) {
                      flag = "Saved";
                    }
                    if (isApplied) {
                      flag = "Applied";
                    }

                    return (
                      <motion.div
                        key={job.id}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.01,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Card
                          className={`relative hover:shadow-lg transition-all duration-300 p-0 ${visited ? "border-primary/70 bg-primary/5" : ""}`}
                        >
                          <CardContent className="px-4 pt-4 pb-2">
                            <div className="flex flex-col gap-4">
                              {/* Company Logo */}
                              <div className="flex gap-4">
                                <motion.div
                                  whileHover={{ rotate: 5, scale: 1.1 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden"
                                >
                                  {job.logoUrl ? (
                                    <SquareAvatar
                                      src={job.logoUrl}
                                      alt={job.companyName || "Company"}
                                      fallback={
                                        job.companyName
                                          ? job.companyName.charAt(0)
                                          : "C"
                                      }
                                      size={64}
                                    />
                                  ) : (
                                    <Building2 className="h-8 w-8 text-primary" />
                                  )}
                                </motion.div>
                                  {/* Status badge */}
                                  {visited && (
                                    <div className="absolute top-0 left-0 rounded-br-full px-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">
                                      {flag}
                                    </div>
                                  )}
                                <div className="flex-1">
                                  <h3
                                    className={`text-xl font-bold hover:text-primary transition-colors ${visited ? "text-primary" : ""}`}
                                  >
                                    <Link href={`/jobs/${job.id}`}>
                                      {job.jobTitle}
                                    </Link>
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {job.companyName}
                                  </p>
                                </div>
                                <div className="hidden md:flex flex-col items-end">
                                  {job.type === "overseas" && (
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
                                  <div className="items-center gap-2 text-lg font-semibold text-primary hidden md:flex">
                                    <span>
                                      {formatSalary(
                                        job.minSalary,
                                        job.maxSalary,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Job Details */}
                              <div className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                                    <span>
                                      {formatLocation(job.location) || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                                    <span>
                                      {job.employmentType
                                        ? job.employmentType
                                            .charAt(0)
                                            .toUpperCase() +
                                          job.employmentType.slice(1)
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                                    <span>
                                      {formatCategory(job.category) || "N/A"}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 pt-2 border-t">
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatPostedDate(job.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      {job.views || 0} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {job.applications || 0} applications
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleShare(job)}
                                      className="cursor-pointer"
                                    >
                                      <Share2 size={16} />
                                    </Button>
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className={`cursor-pointer ${isSaved ? "text-primary bg-primary/10" : ""}`}
                                        onClick={() =>
                                          handleToggleSave(jobId, isSaved)
                                        }
                                        disabled={isToggling}
                                      >
                                        <Bookmark
                                          className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`}
                                        />
                                      </Button>
                                    </motion.div>

                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Link
                                        href={`/jobs/${job.id}`}
                                        className="block"
                                      >
                                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer px-6 group">
                                          View & Apply
                                          <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                      </Link>
                                    </motion.div>
                                  </div>
                                </div>
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
                  <p className="text-muted-foreground">
                    No jobs found matching your criteria.
                  </p>
                </motion.div>
              )}

              {/* Bottom Pagination */}
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
