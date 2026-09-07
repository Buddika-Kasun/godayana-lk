// src/app/admin/posts/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  Trash2,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  DollarSign,
  Users,
  Globe,
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
import { STATUS_DISPLAY } from "@/types/statusDisplay";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import {
  adminCompanyJobAPI,
  AdminCompanyJobData,
  CompanyJobCountsResponse,
} from "@/lib/api/endpoints/admin/adminCompanyJobEndpoint";
import {
  adminCompanyCourseAPI,
  AdminCompanyCourseData,
  CompanyCourseCountsResponse,
} from "@/lib/api/endpoints/admin/adminCompanyCourseEndpoint";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { useSearchParams } from "next/navigation";

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays <= 7) return `Posted ${diffDays} days ago`;
  if (diffDays <= 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
  return `Posted ${Math.floor(diffDays / 30)} months ago`;
};

const formatPrice = (price?: string) => {
  if (!price) return "Free";
  const numPrice = parseInt(price);
  if (numPrice === 0) return "Free";
  return `LKR ${numPrice.toLocaleString()}`;
};

const formatLocation = (location?: string) => {
  if (!location) return "N/A";
  const parts = location.split(",").map((part) => part.trim());
  const lastTwo = parts.slice(-2);
  return lastTwo.join(", ");
};

export default function AdminPosts() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as "jobs" | "courses" | null;
  const [currentPage, setCurrentPage] = useState(1);
  const [postTypeFilter, setPostTypeFilter] = useState<"jobs" | "courses">(
    initialType || "jobs",
  );
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [jobs, setJobs] = useState<AdminCompanyJobData[]>([]);
  const [courses, setCourses] = useState<AdminCompanyCourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jobCounts, setJobCounts] = useState<CompanyJobCountsResponse>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [courseCounts, setCourseCounts] = useState<CompanyCourseCountsResponse>(
    {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );
  const itemsPerPage = 10;

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    try {
      const [jobCountRes, courseCountRes] = await Promise.all([
        adminCompanyJobAPI.getAdminCompanyJobCounts(),
        adminCompanyCourseAPI.getAdminCompanyCourseCounts(),
      ]);

      if (jobCountRes.data.success && jobCountRes.data.data) {
        setJobCounts(jobCountRes.data.data);
      }
      if (courseCountRes.data.success && courseCountRes.data.data) {
        setCourseCounts(courseCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  // Fetch posts based on type and filter
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusMap: Record<string, string> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
      };

      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        status: statusMap[statusFilter],
      };

      if (postTypeFilter === "jobs") {
        const response = await adminCompanyJobAPI.getAdminCompaniesJobs(params);
        if (response.data.success && response.data.data) {
          setJobs(response.data.data.content || []);
          setTotalItems(response.data.data.totalElements || 0);
          setTotalPages(response.data.data.totalPages || 0);
        } else {
          toast.error(response.data.message || "Failed to load jobs");
        }
      } else {
        const response =
          await adminCompanyCourseAPI.getAdminCompaniesCourses(params);
        if (response.data.success && response.data.data) {
          setCourses(response.data.data.content || []);
          setTotalItems(response.data.data.totalElements || 0);
          setTotalPages(response.data.data.totalPages || 0);
        } else {
          toast.error(response.data.message || "Failed to load courses");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load posts";
      console.error("Error fetching posts:", errorMessage);
      toast.error(errorMessage || "Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [postTypeFilter, statusFilter, currentPage, itemsPerPage]);

  // Initial load and refetch
  useEffect(() => {
    fetchCounts();
    fetchPosts();
  }, [fetchCounts, fetchPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    type: "jobs" | "courses",
    status: "pending" | "approved" | "rejected",
  ) => {
    setPostTypeFilter(type);
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleApprove = async () => {
    if (!selectedPostId) return;

    try {
      let response;
      if (postTypeFilter === "jobs") {
        response = await adminCompanyJobAPI.approveCompanyJob(
          selectedPostId.toString(),
        );
      } else {
        response = await adminCompanyCourseAPI.approveCompanyCourse(
          selectedPostId.toString(),
        );
      }

      if (response.data.success) {
        toast.success("Post approved and published");
        setSelectedPostId(null);
        setActionType(null);
        fetchCounts();
        fetchPosts();
      } else {
        toast.error(response.data.message || "Failed to approve post");
      }
    } catch (error) {
      console.error("Error approving post:", error);
      toast.error("Failed to approve post");
    }
  };

  const handleReject = async () => {
    if (!selectedPostId) return;

    try {
      let response;
      if (postTypeFilter === "jobs") {
        response = await adminCompanyJobAPI.rejectCompanyJob(
          selectedPostId.toString(),
          "Rejected by admin",
        );
      } else {
        response = await adminCompanyCourseAPI.rejectCompanyCourse(
          selectedPostId.toString(),
          "Rejected by admin",
        );
      }

      if (response.data.success) {
        toast.success("Post rejected");
        setSelectedPostId(null);
        setActionType(null);
        fetchCounts();
        fetchPosts();
      } else {
        toast.error(response.data.message || "Failed to reject post");
      }
    } catch (error) {
      console.error("Error rejecting post:", error);
      toast.error("Failed to reject post");
    }
  };

  const getCurrentItems = () => {
    return postTypeFilter === "jobs" ? jobs : courses;
  };

  const currentItems = getCurrentItems();

  const getStatusCount = (status: string) => {
    if (postTypeFilter === "jobs") {
      switch (status) {
        case "pending":
          return jobCounts.pending;
        case "approved":
          return jobCounts.approved;
        case "rejected":
          return jobCounts.rejected;
        default:
          return 0;
      }
    } else {
      switch (status) {
        case "pending":
          return courseCounts.pending;
        case "approved":
          return courseCounts.approved;
        case "rejected":
          return courseCounts.rejected;
        default:
          return 0;
      }
    }
  };

  // const getActionButtons = (
  //   post: AdminCompanyJobData | AdminCompanyCourseData,
  // ) => {
  //   const buttons = [];

  //   const viewLink =
  //     postTypeFilter === "jobs"
  //       ? `/admin/jobs/${post.id}`
  //       : `/admin/courses/${post.id}`;

  //   buttons.push(
  //     <Link key="view" href={viewLink}>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         className="gap-1 cursor-pointer w-full"
  //       >
  //         <Eye size={14} />
  //         View
  //       </Button>
  //     </Link>,
  //   );

  //   if (post.status === "PENDING" || post.status === "REJECTED") {
  //     buttons.push(
  //       <Button
  //         key="approve"
  //         size="sm"
  //         className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer flex-1 py-1"
  //         onClick={() => {
  //           setSelectedPostId(post.id);
  //           setActionType("approve");
  //         }}
  //       >
  //         <CheckCircle size={14} />
  //         Approve
  //       </Button>,
  //     );
  //   }

  //   if (post.status === "PENDING" || post.status === "APPROVED") {
  //     buttons.push(
  //       <Button
  //         key="reject"
  //         variant="destructive"
  //         size="sm"
  //         className="gap-1 cursor-pointer flex-1"
  //         onClick={() => {
  //           setSelectedPostId(post.id);
  //           setActionType("reject");
  //         }}
  //       >
  //         <Trash2 size={14} />
  //         Reject
  //       </Button>,
  //     );
  //   }

  //   return buttons;
  // };,
  const getActionButtons = (
    post: AdminCompanyCourseData | AdminCompanyJobData,
  ) => {
    const buttons = [];

    // View button for all
    // const viewLink =
    //   post.type === "job"
    //     ? `/admin/jobs/${post.id}`
    //     : `/admin/courses/${post.id}`;

    // buttons.push(
    //   <Link key="view" href={viewLink}>
    //     <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
    //       <Eye size={14} />
    //       View
    //     </Button>
    //   </Link>,
    // );

    // Approve button for pending posts
    if (post.status === "PENDING" || post.status === "REJECTED") {
      buttons.push(
        <Button
          key="approve"
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer flex-1"
          onClick={() => {
            setSelectedPostId(post.id);
            setActionType("approve");
          }}
        >
          <CheckCircle size={14} />
          Approve
        </Button>,
      );
    }

    // Reject button for all
    if (post.status === "PENDING" || post.status === "APPROVED") {
      buttons.push(
        <Button
          key="rejected"
          variant="destructive"
          size="sm"
          className="gap-1 cursor-pointer flex-1"
          onClick={() => {
            setSelectedPostId(post.id);
            setActionType("reject");
          }}
        >
          <Trash2 size={14} />
          Reject
        </Button>,
      );
    }

    return buttons;
  };

  const renderPostDetails = (
    post: AdminCompanyJobData | AdminCompanyCourseData,
  ) => {
    const statusDisplay = STATUS_DISPLAY[post.status] || STATUS_DISPLAY.DRAFT;

    if (postTypeFilter === "jobs") {
      const job = post as AdminCompanyJobData;
      return (
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <Badge
                  variant="outline"
                  className="text-xs px-1 absolute top-1 left-1"
                >
                  <Briefcase size={12} />
                </Badge>
                <OptimizedAvatar
                  src={job.logoUrl}
                  alt={job.companyName || "Company"}
                  height={60}
                  width={60}
                  fallback={job.companyName ? job.companyName.charAt(0) : "C"}
                />
                <div>
                  <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.companyName}
                  </p>
                </div>
              </div>
            </div>
            <Badge className={statusDisplay.color}>{statusDisplay.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {formatLocation(job.location) || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />{" "}
              {job.jobType === "local" ? "Local Job" : "Overseas Job"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {job.applications || 0} applications
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {job.views || 0} views
            </span>
          </div>
        </div>
      );
    } else {
      const course = post as AdminCompanyCourseData;
      return (
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <Badge
                  variant="outline"
                  className="text-xs px-1 absolute top-1 left-1"
                >
                  <GraduationCap size={12} />
                </Badge>
                <OptimizedAvatar
                  src={course.logoUrl}
                  alt={course.companyName || "Company"}
                  height={60}
                  width={60}
                  fallback={
                    course.companyName ? course.companyName.charAt(0) : "C"
                  }
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {course.courseTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {course.companyName}
                  </p>
                </div>
              </div>
            </div>
            <Badge className={statusDisplay.color}>{statusDisplay.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {course.enrollType === "online" ? (
                <Globe size={14} />
              ) : (
                <MapPin size={14} />
              )}
              {course.enrollType === "online"
                ? "Online Course"
                : formatLocation(course.location) || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={14} /> {formatPrice(course.price)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDate(course.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {course.enrolledStudents || 0}/
              {course.maxStudents || 0} enrolled
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {course.views || 0} views
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Moderate and manage all posts (jobs and courses)
            </p>
          </div>

          {/* Post Type & Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => handleFilterChange("jobs", "pending")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  postTypeFilter === "jobs"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Jobs{" "}
                <span className="hidden md:inline-block">
                  ({jobCounts.pending + jobCounts.approved + jobCounts.rejected}
                  )
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("courses", "pending")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  postTypeFilter === "courses"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Courses{" "}
                <span className="hidden md:inline-block">
                  (
                  {courseCounts.pending +
                    courseCounts.approved +
                    courseCounts.rejected}
                  )
                </span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">
                  ({getStatusCount("pending")})
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "approved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Active{" "}
                <span className="hidden md:inline-block">
                  ({getStatusCount("approved") || 0})
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({getStatusCount("rejected")})
                </span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="pt-15 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading posts..."
                  fullScreen={false}
                />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No {statusFilter}{" "}
                  {postTypeFilter === "jobs" ? "jobs" : "courses"} found
                </p>
              </div>
            ) : (
              currentItems.map((post) => {
                const viewLink =
                  postTypeFilter === "jobs"
                    ? `/admin/posts/job/${post.id}`
                    : `/admin/posts/course/${post.id}`;

                return (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Section - Post Info */}
                      {renderPostDetails(post)}

                      {/* Right Section - Action Buttons */}
                      <div className="flex flex-col flex-wrap gap-2">
                        <Link key="view" href={viewLink}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 cursor-pointer w-full"
                          >
                            <Eye size={14} />
                            View
                          </Button>
                        </Link>
                        <div className="flex gap-1">
                          {getActionButtons(post)}
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
                {currentItems.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} {postTypeFilter === "jobs" ? "jobs" : "courses"}
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems}{" "}
              {postTypeFilter === "jobs" ? "jobs" : "courses"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog
        open={actionType === "approve"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this{" "}
              {postTypeFilter === "jobs" ? "job" : "course"}? It will become
              visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={actionType === "reject"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this{" "}
              {postTypeFilter === "jobs" ? "job" : "course"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
