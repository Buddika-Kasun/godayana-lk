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
  Briefcase,
  Clock,
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
import companyJobEndpoints, {
  CompanyJobItem,
  CompanyJobParams,
  JobCountsResponse,
} from "@/lib/api/endpoints/company/companyJobEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";
import { STATUS_DISPLAY } from "@/types/statusDisplay";
import { formatLocation } from "@/lib/utils/locationUtils";

// Status mapping: Frontend filter -> Backend status
const STATUS_MAP = {
  all: undefined,
  pending: "PENDING",
  active: "APPROVED",
  closed: "CLOSED",
  draft: "DRAFT",
} as const;


export default function CompanyJobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "closed" | "draft" | "pending"
  >("pending");
  const [jobs, setJobs] = useState<CompanyJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeJobId, setCloseJobId] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jobCounts, setJobCounts] = useState<JobCountsResponse>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    closed: 0,
    draft: 0,
  });
  const itemsPerPage = 10;

  // Fetch job counts (single API call)
  const fetchJobCounts = async () => {
    try {
      const response = await companyJobEndpoints.getJobCounts();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setJobCounts(apiResponse.data);
      }
    } catch (error) {
      console.error("Error fetching job counts:", error);
    }
  };

  // Fetch jobs with pagination and filter
  const fetchJobs = async (filter: typeof activeFilter, page: number = 1) => {
    setIsLoading(true);
    try {
      const backendStatus = STATUS_MAP[filter];
      const params: CompanyJobParams = {
        page: page - 1,
        size: itemsPerPage,
      };

      if (backendStatus) {
        params.status = backendStatus;
      }

      const response = await companyJobEndpoints.getCompanyJobs(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setJobs(apiResponse.data.content);
        setTotalItems(apiResponse.data.totalElements);
        setTotalPages(apiResponse.data.totalPages);
      } else {
        toast.error(apiResponse.message || "Failed to load jobs");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load seeker profile data";
      console.error("Error fetching jobs:", errorMessage);
      toast.error(errorMessage || "Failed to load jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  // useEffect(() => {
  //   fetchJobCounts();
  //   fetchJobs(activeFilter, currentPage);
  // }, []);

  // Refetch when filter or page changes
  useEffect(() => {
    fetchJobCounts();
    fetchJobs(activeFilter, currentPage);
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

  // const handleDeleteJob = async () => {
  //   if (!closeJobId) return;

  //   try {
  //     await jobEndpoints.deleteJob(closeJobId);
  //     toast.success("Job deleted successfully");
  //     setCloseJobId(null);
  //     fetchJobCounts(); // Refresh counts
  //     fetchJobs(activeFilter, currentPage); // Refresh list
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to load seeker profile data";
  //     console.error("Error deleting job:", errorMessage);
  //     toast.error(errorMessage || "Failed to delete job");
  //   }
  // };

  const handleCloseJob = async () => {
    // if (!confirm("Are you sure you want to close this job?")) return;
    if (!closeJobId) return;

    try {
      // await jobEndpoints.closeJob(jobId);
      await companyJobEndpoints.closeJob(closeJobId);
      toast.success("Job closed successfully");
      fetchJobCounts(); // Refresh counts
      fetchJobs(activeFilter, currentPage); // Refresh list
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load seeker profile data";
      console.error("Error closing job:", errorMessage);
      toast.error(errorMessage || "Failed to close job");
    }
  };

  // if (isLoading && jobs.length === 0) {
  //   return (
  //     <div className="relative">
  //       <Card className="bg-primary/4 min-h-[calc(100vh-150px)]">
  //         <SubLoadingScreen message="Loading your jobs..." />
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            {/* <h1 className="text-2xl font-bold">My Jobs</h1> */}
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your job postings
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
                  ({jobCounts.pending})
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
                  ({jobCounts.approved})
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
                  ({jobCounts.closed + jobCounts.rejected})
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
                  ({jobCounts.draft})
                </span>
              </button>
            </div>
            <div>
              <Link href="/company/jobs/create">
                <Button className="gap-2 cursor-pointer w-full lg:w-auto">
                  <Plus size={16} />
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading your jobs..."
                  fullScreen={false}
                />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "draft"
                    ? "No draft jobs found. Create a new job posting."
                    : activeFilter === "active"
                      ? "No active jobs found"
                      : activeFilter === "closed"
                        ? "No closed jobs found"
                        : "No pending jobs found. Click 'Post a Job' to create job posting."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/company/jobs/create">
                    <Button className="mt-4 gap-2">
                      <Plus size={16} />
                      Post Your First Job
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              jobs.map((job) => {
                const statusDisplay =
                  STATUS_DISPLAY[job.status] || STATUS_DISPLAY.DRAFT;
                return (
                  <div
                    key={job.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Section - Takes remaining space */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {job.jobTitle}
                            </h3>
                          </div>
                          <Badge className={statusDisplay.color}>
                            {statusDisplay.label}
                          </Badge>
                        </div>

                        {/* Job Stats */}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {job.applicationCount || 0}{" "}
                            applications
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 size={14} /> {job.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {formatDate(job.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {formatLocation(job.location) || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />{" "}
                            {job.type === "local"
                              ? "Local Job"
                              : "Overseas Job"}
                          </span>
                        </div>
                      </div>

                      {/* Right Section - 2 rows on md+ */}
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        {/* Row 1: Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                          <Link
                            href={`/company/jobs/${job.id}`}
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
                          {job.status == "CLOSED" ||
                          job.status == "REJECTED" ? (
                            <Link
                              href={`/company/jobs/edit/${job.id}`}
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
                                href={`/company/jobs/edit/${job.id}`}
                                className="flex-1 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0"
                                onClick={(e) => {
                                  if (job.status === "CLOSED" || job.status === "REJECTED") {
                                    e.preventDefault();
                                    toast.error("Cannot edit a closed or rejected job");
                                  }
                                }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 cursor-pointer w-full lg:w-auto text-xs sm:text-sm"
                                  disabled={job.status === "CLOSED"}
                                >
                                  <Edit size={14} />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-1 cursor-pointer flex-1 lg:flex-none min-w-[calc(33.333%-0.5rem)] lg:min-w-0 w-full lg:w-auto text-xs sm:text-sm"
                                onClick={() => setCloseJobId(job.id)}
                              >
                                <Trash2 size={14} />
                                Close
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Row 2: View Applications Button */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/company/jobs/applications/${job.id}`}
                            className="w-full"
                            onClick={(e) => {
                              if (job.applicationCount! <= 0) {
                                e.preventDefault();
                                toast.error(
                                  "No applications available for this job",
                                );
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 cursor-pointer w-full"
                              disabled={job.applicationCount! <= 0}
                            >
                              <Eye size={14} />
                              View Applications ({job.applicationCount || 0})
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
                {jobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} jobs
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} jobs
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!closeJobId} onOpenChange={() => setCloseJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently close this job
              posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseJob}
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
