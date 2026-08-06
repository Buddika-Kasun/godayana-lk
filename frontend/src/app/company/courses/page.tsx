// src/app/company/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  BarChart3,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import courseEndpoints, {
  CompanyCourseItem,
  CompanyCourseParams,
  CourseCountsResponse,
} from "@/lib/api/endpoints/company/companyCourseEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatPrice } from "@/lib/utils/priceUtils";
import { formatLocation } from "@/lib/utils/locationUtils";

// Status mapping: Frontend filter -> Backend status
const STATUS_MAP = {
  all: undefined,
  pending: "PENDING",
  active: "APPROVED",
  closed: "CLOSED",
  draft: "DRAFT",
} as const;

// Backend status -> Frontend display
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  APPROVED: {
    label: "Active",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  DRAFT: {
    label: "Draft",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

// Enrollment type display
const ENROLL_TYPE_DISPLAY: Record<string, { label: string; color: string }> = {
  online: {
    label: "Online",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  physical: {
    label: "Physical",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

export default function CompanyCourses() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "closed" | "draft" | "pending"
  >("pending");
  const [courses, setCourses] = useState<CompanyCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeCourseId, setCloseCourseId] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [courseCounts, setCourseCounts] = useState<CourseCountsResponse>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    closed: 0,
    draft: 0,
  });
  const itemsPerPage = 10;

  // Fetch course counts
  const fetchCourseCounts = async () => {
    try {
      const response = await courseEndpoints.getCourseCounts();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCourseCounts(apiResponse.data);
      }
    } catch (error) {
      console.error("Error fetching course counts:", error);
    }
  };

  // Fetch courses with pagination and filter
  const fetchCourses = async (
    filter: typeof activeFilter,
    page: number = 1,
  ) => {
    setIsLoading(true);
    try {
      const backendStatus = STATUS_MAP[filter];
      const params: CompanyCourseParams = {
        page: page - 1,
        size: itemsPerPage,
      };

      if (backendStatus) {
        params.status = backendStatus;
      }

      const response = await courseEndpoints.getCompanyCourses(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCourses(apiResponse.data.content);
        setTotalItems(apiResponse.data.totalElements);
        setTotalPages(apiResponse.data.totalPages);
      } else {
        toast.error(apiResponse.message || "Failed to load courses");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load courses";
      console.error("Error fetching courses:", errorMessage);
      toast.error(errorMessage || "Failed to load courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when filter or page changes
  useEffect(() => {
    fetchCourseCounts();
    fetchCourses(activeFilter, currentPage);
  }, [activeFilter, currentPage]);

  useEffect(() => {
    setTotalItems(0);
  }, [activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCloseCourse = async () => {
    if (!closeCourseId) return;

    try {
      await courseEndpoints.closeCourse(closeCourseId);
      toast.success("Course closed successfully");
      setCloseCourseId(null);
      fetchCourseCounts();
      fetchCourses(activeFilter, currentPage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to close course";
      console.error("Error closing course:", errorMessage);
      toast.error(errorMessage || "Failed to close course");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your course offerings
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => handleFilterChange("pending")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">
                  ({courseCounts.pending})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("active")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "active"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Active{" "}
                <span className="hidden md:inline-block">
                  ({courseCounts.approved})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("closed")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "closed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Inactive{" "}
                <span className="hidden md:inline-block">
                  ({courseCounts.closed + courseCounts.rejected})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("draft")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "draft"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Draft{" "}
                <span className="hidden md:inline-block">
                  ({courseCounts.draft})
                </span>
              </button>
            </div>
            <div>
              <Link href="/company/courses/create">
                <Button className="gap-2 cursor-pointer w-full lg:w-auto">
                  <Plus size={16} />
                  Post a Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Courses List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading your courses..."
                  fullScreen={false}
                />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "draft"
                    ? "No draft courses found. Create a new course."
                    : activeFilter === "active"
                      ? "No active courses found"
                      : activeFilter === "closed"
                        ? "No closed courses found"
                        : "No courses found. Click 'Post a Course' to create your first course."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/company/courses/create">
                    <Button className="mt-4 gap-2">
                      <Plus size={16} />
                      Post Your First Course
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              courses.map((course) => {
                const statusDisplay =
                  STATUS_DISPLAY[course.status] || STATUS_DISPLAY.DRAFT;
                const enrollTypeDisplay =
                  ENROLL_TYPE_DISPLAY[course.enrollType || "online"] ||
                  ENROLL_TYPE_DISPLAY.online;

                return (
                  <div
                    key={course.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Section - Takes remaining space */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {course.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            {/* <Badge className={enrollTypeDisplay.color}>
                              {enrollTypeDisplay.label}
                            </Badge> */}
                            <Badge className={statusDisplay.color}>
                              {statusDisplay.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {course.enrollmentCount || 0}{" "}
                            enrolled
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 size={14} /> {course.viewCount || 0}{" "}
                            views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {formatDate(course.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} /> {formatPrice(course.price)}
                          </span>
                          {/* {course.enrollType === "physical" &&
                            course.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />{" "}
                                {formatLocation(course.location)}
                              </span>
                            )} */}
                          <span className="flex items-center gap-1">
                            <GraduationCap size={14} />{" "}
                            {course.enrollType === "online"
                              ? "Online"
                              : "Physical"}
                          </span>
                        </div>
                      </div>

                      {/* Right Section - 2 rows on md+ */}
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        {/* Row 1: Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                          <Link
                            href={`/company/courses/${course.id}`}
                            className="flex-1 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 cursor-pointer w-full lg:w-auto text-xs sm:text-sm"
                            >
                              <Eye size={14} />
                              View
                            </Button>
                          </Link>
                          {course.status == "CLOSED" 
                          || course.status == "REJECTED" 
                          ? (
                            <Link
                              href={`/company/courses/edit/${course.id}`}
                              className="flex-2 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0"
                            >
                              <Button
                                variant="default"
                                size="sm"
                                className="gap-1 cursor-pointer w-full lg:w-auto text-xs sm:text-sm bg-green-100
                                text-green-800 hover:bg-green-200"
                              >
                                <Edit size={14} />
                                Re-Open
                              </Button>
                            </Link>
                          ) : (
                            <>
                              <Link
                                href={`/company/courses/edit/${course.id}`}
                                className="flex-1 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 cursor-pointer w-full lg:w-auto text-xs sm:text-sm"
                                >
                                  <Edit size={14} />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-1 cursor-pointer flex-1 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0 w-full lg:w-auto text-xs sm:text-sm"
                                onClick={() => setCloseCourseId(course.id)}
                              >
                                <Trash2 size={14} />
                                Close
                              </Button>
                            </>
                          ) 
                        }
                        </div>

                        {/* Row 2: View Leads Button */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/company/courses/leads/${course.id}`}
                            className="w-full"
                            onClick={(e) => {
                              if (course.enrollmentCount! <= 0) {
                                e.preventDefault();
                                toast.error(
                                  "No leads available for this course",
                                );
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 cursor-pointer w-full"
                              disabled={course.enrollmentCount! <= 0}
                            >
                              <Users size={14} />
                              View Leads ({course.enrollmentCount || 0})
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Showing{" "}
                {courses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} courses
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} courses
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!closeCourseId}
        onOpenChange={() => setCloseCourseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently close this
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseCourse}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
