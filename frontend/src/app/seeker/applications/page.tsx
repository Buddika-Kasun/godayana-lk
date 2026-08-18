// src/app/seeker/applications/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Building,
  MapPin,
  Eye,
  Bookmark,
  BookmarkCheck,
  Clock,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import {
  seekerJobAPI,
  JobApplicationResponse,
  JobApplicationCountsResponse,
  JobApplicationParams,
} from "@/lib/api/endpoints/seeker/seekerJobEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatLocation } from "@/lib/utils/locationUtils";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { useSavedJobs } from "@/lib/hooks/useSavedJobs";

// Status display mapping
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending Review",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  REVIEWED: {
    label: "Under Review",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  HIRED: {
    label: "Hired",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  NOTAPPLIED: {
    label: "Not Applied",
    color:
      "bg-gray-50 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
  },
};

// Frontend filter -> Backend status mapping
const STATUS_MAP = {
  pending: "PENDING",
  active: "ACTIVE",
  rejected: "REJECTED",
  saved: "SAVED",
} as const;

export default function SeekerApplications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "pending" | "active" | "rejected" | "saved"
  >("pending");
  const [applications, setApplications] = useState<JobApplicationResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [applicationCounts, setApplicationCounts] =
    useState<JobApplicationCountsResponse>({
      all: 0,
      pending: 0,
      active: 0,
      rejected: 0,
    });
  const itemsPerPage = 10;

  const { toggleSaveJob, isJobSaved, savedJobsCount } = useSavedJobs();

  // Fetch application counts
  const fetchCounts = async () => {
    try {
      const appCountRes = await seekerJobAPI.application.getAppliedJobsCount();

      if (appCountRes.data.success && appCountRes.data.data) {
        setApplicationCounts(appCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch applications with pagination and filter
  const fetchApplications = useCallback(
    async (filter: typeof activeFilter, page: number = 1) => {
      setIsLoading(true);
      try {
        const backendStatus = STATUS_MAP[filter];
        const params: JobApplicationParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        if (backendStatus) {
          params.status = backendStatus;
        }

        const response =
          await seekerJobAPI.application.getMyApplications(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setApplications(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load applications");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load applications";
        console.error("Error fetching applications:", errorMessage);
        toast.error(
          errorMessage || "Failed to load applications. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  // Initial load and refetch
  useEffect(() => {
    fetchCounts();
    fetchApplications(activeFilter, currentPage);
  }, [activeFilter, currentPage, fetchApplications]);

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

  const getStatusDisplay = (status: string) => {
    return STATUS_DISPLAY[status] || STATUS_DISPLAY.NOTAPPLIED;
  };

  const handleSaveToggle = async (jobId: string, status: boolean) => {
    await toggleSaveJob(jobId, status);
    if (activeFilter == "saved") {
      fetchApplications(activeFilter, currentPage);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Track all your job applications
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
                  ({applicationCounts.pending})
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
                  ({applicationCounts.active})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("rejected")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({applicationCounts.rejected})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("saved")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "saved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <BookmarkCheck size={16} /> */}
                Saved{" "}
                <span className="hidden md:inline-block">
                  ({savedJobsCount})
                </span>
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading your applications..."
                  fullScreen={false}
                />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "saved"
                    ? "No saved applications yet. Click the bookmark icon to save jobs."
                    : activeFilter === "active"
                      ? "No active applications found"
                      : activeFilter === "rejected"
                        ? "No rejected applications"
                        : "No applications found"}
                </p>
              </div>
            ) : (
              applications.map((application) => {
                const statusDisplay = getStatusDisplay(application.status);
                // const isSaved = application.isSaved || false;
                const isSaved = isJobSaved(application.jobId);

                return (
                  <div
                    key={application.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow gap-4 relative overflow-hidden"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() =>
                            handleSaveToggle(application.jobId, isSaved)
                          }
                          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10 p-1 rounded absolute top-0 left-0"
                        >
                          {isSaved ? (
                            <BookmarkCheck size={20} className="text-primary" />
                          ) : (
                            <Bookmark size={20} />
                          )}
                        </button>
                        <OptimizedAvatar
                          src={application.logoUrl}
                          alt={application.companyName || "Company"}
                          height={60}
                          width={60}
                          fallback={
                            application.companyName
                              ? application.companyName.charAt(0)
                              : "C"
                          }
                        />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {application.jobTitle || "Untitled"}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building size={14} />{" "}
                              {application.companyName || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />{" "}
                              {formatLocation(application.location) || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              {application.appliedAt ? (
                                <>
                                  <Clock size={14} />
                                  {" Applied "}
                                  {formatDate(application.appliedAt)}
                                </>
                              ) : (
                                <>
                                  <Clock size={14} />
                                  {" Saved "}
                                  {formatDate(application.savedAt)}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {application.status && (
                        <Badge className={statusDisplay.color}>
                          {statusDisplay.label}
                        </Badge>
                      )}
                      <Link href={`/seeker/applications/${application.jobId}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye size={14} />
                          View Job
                        </Button>
                      </Link>
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
                {applications.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} applications
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} applications
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
