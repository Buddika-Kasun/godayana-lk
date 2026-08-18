// src/app/company/jobs/applications/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Download,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import {
  seekerJobAPI,
  JobApplicationCountsResponse,
  JobApplicationParams,
} from "@/lib/api/endpoints/seeker/seekerJobEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatLocation } from "@/lib/utils/locationUtils";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { seekerProfileAPI } from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import companyJobEndpoints, { companyJobAPI, CompanyJobApplicationResponse } from "@/lib/api/endpoints/company/companyJobEndpoints";

// Status display mapping
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  REVIEWED: {
    label: "Reviewed",
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
};

// Frontend filter -> Backend status mapping
const STATUS_MAP = {
  pending: "PENDING",
  shortlisted: "SHORTLISTED",
  hired: "HIRED",
  rejected: "REJECTED",
} as const;

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [applications, setApplications] = useState<
    CompanyJobApplicationResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "pending" | "shortlisted" | "hired" | "rejected"
  >("pending");
  const [applicationCounts, setApplicationCounts] =
    useState<JobApplicationCountsResponse>({
      jobTitle: "",
      all: 0,
      pending: 0,
      active: 0,
      rejected: 0,
    });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch application counts
  const fetchCounts = useCallback(async () => {
    try {
      const appCountRes =
        await companyJobEndpoints.applications.getCompanyJobsCount(jobId);
      if (appCountRes.data.success && appCountRes.data.data) {
        setApplicationCounts(appCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, [jobId]);

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
          await companyJobEndpoints.applications.getApplicationsByJob(
            jobId,
            params,
          );
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
    [jobId, itemsPerPage],
  );

  // Initial load and refetch
  useEffect(() => {
    fetchCounts();
    fetchApplications(activeFilter, currentPage);
  }, [activeFilter, currentPage, fetchCounts, fetchApplications]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    setIsUpdating(true);
    try {
      const response = await seekerJobAPI.application.updateApplicationStatus(
        applicationId,
        newStatus,
      );
      if (response.data.success) {
        toast.success(`Candidate ${newStatus.toLowerCase()} successfully`);
        // Refresh the list
        fetchApplications(activeFilter, currentPage);
        fetchCounts();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadResume = async (fileKey: string, name?: string) => {
    if (!fileKey) {
      toast.error("No resume available");
      return;
    }

    const loadingToast = toast.loading("Downloading resume...");

    try {
      // Call the backend API to get the file as blob
      const response = await seekerProfileAPI.downloadResume(fileKey);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from the fileKey or use default
      const fileName = name ? `${name}_CV.pdf` : "Resume.pdf";
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Resume downloaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.", {
        id: loadingToast,
      });
    }
  };

  const getStatusDisplay = (status: string) => {
    return STATUS_DISPLAY[status] || STATUS_DISPLAY.PENDING;
  };

  const getCountForFilter = (filter: string) => {
    switch (filter) {
      case "pending":
        return applicationCounts.pending;
      case "shortlisted":
        return applicationCounts.active;
      case "hired":
        return 0; // Add hired count when available
      case "rejected":
        return applicationCounts.rejected;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/company/jobs`)}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          Applications
          {applicationCounts.jobTitle && (
            <>
              <span className="">for</span>
              <span className="text-primary">{applicationCounts.jobTitle}</span>
            </>
          )}
        </h2>
      </div>

      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col px-4">
          {/* Filter Tabs */}
          <div className="w-full flex flex-col md:flex-row justify-between border-b pb-4 mb-6">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap order-last md:order-first">
              <button
                onClick={() => handleFilterChange("pending")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
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
                onClick={() => handleFilterChange("shortlisted")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "shortlisted"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Shortlisted{" "}
                <span className="hidden md:inline-block">
                  ({applicationCounts.active})
                </span>
              </button>
              {/* <button
                onClick={() => handleFilterChange("hired")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "hired"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Hired <span className="hidden md:inline-block">(0)</span>
              </button> */}
              <button
                onClick={() => handleFilterChange("rejected")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
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
            </div>

            {/* <div className="pb-2 md:pb-0">
              <Link href={`/company/jobs/${jobId}`}>
                <Button className="gap-2 cursor-pointer w-full lg:w-auto px-4">
                  <ExternalLink size={16} />
                  View Job
                </Button>
              </Link>
            </div> */}
          </div>

          {/* Applications List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading applications..."
                  fullScreen={false}
                />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "pending"
                    ? "No pending applications"
                    : activeFilter === "shortlisted"
                      ? "No shortlisted candidates"
                      : activeFilter === "hired"
                        ? "No hired candidates"
                        : activeFilter === "rejected"
                          ? "No rejected candidates"
                          : "No applications received yet"}
                </p>
              </div>
            ) : (
              applications.map((application) => {
                const statusDisplay = getStatusDisplay(application.status);
                const isPending = application.status === "PENDING";
                const isShortlisted = application.status === "SHORTLISTED";
                const isRejected = application.status === "REJECTED";
                const isHired = application.status === "HIRED";

                return (
                  <div
                    key={application.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {application.seekerProfileUrl ? (
                            <OptimizedAvatar
                              src={application.seekerProfileUrl}
                              alt={application.seekerName || "Seeker"}
                              height={60}
                              width={60}
                              fallback={
                                application.seekerName
                                  ? application.seekerName.charAt(0)
                                  : "S"
                              }
                            />
                          ) : null}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {application.seekerName || "Unknown"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {application.seekerExperience +
                                    " Year experience" ||
                                    "Experience not specified"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={statusDisplay.color}>
                                  {statusDisplay.label}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              {application.seekerEmail && (
                                <span className="flex items-center gap-1">
                                  <Mail size={14} /> {application.seekerEmail}
                                </span>
                              )}
                              {application.seekerContactNo && (
                                <span className="flex items-center gap-1">
                                  <Phone size={14} />{" "}
                                  {application.seekerContactNo}
                                </span>
                              )}
                              {application.seekerExperience && (
                                <span className="flex items-center gap-1">
                                  <Briefcase size={14} />{" "}
                                  {application.seekerExperience} Year
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />{" "}
                                {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row gap-2">
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 py-1 gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    application.id,
                                    "SHORTLISTED",
                                  )
                                }
                                disabled={isUpdating}
                              >
                                <UserCheck size={14} />
                                Shortlist
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 py-1 gap-2 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(application.id, "REJECTED")
                                }
                                disabled={isUpdating}
                              >
                                <UserX size={14} />
                                Reject
                              </Button>
                            </>
                          )}

                          {isShortlisted && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 py-1 gap-2 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(application.id, "HIRED")
                                }
                                disabled={isUpdating}
                              >
                                <UserCheck size={14} />
                                Hire
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 py-1 gap-2 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(application.id, "REJECTED")
                                }
                                disabled={isUpdating}
                              >
                                <UserX size={14} />
                                Reject
                              </Button>
                            </>
                          )}

                          {isRejected && (
                            <Button
                              size="sm"
                              className="flex-1 py-1 gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  "SHORTLISTED",
                                )
                              }
                              disabled={isUpdating}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reconsider
                            </Button>
                          )}

                          {isHired && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 py-1 gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(
                                    application.id,
                                    "SHORTLISTED",
                                  )
                                }
                                disabled={isUpdating}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reconsider
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 py-1 gap-2 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(application.id, "REJECTED")
                                }
                                disabled={isUpdating}
                              >
                                <UserX size={14} />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                          <Link
                            href={`/company/jobs/applications/seeker/${application.seekerId}?application=${application.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 py-1 gap-1 cursor-pointer"
                            >
                              <Eye size={14} />
                              View Profile
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 py-1 gap-1 cursor-pointer"
                            onClick={() =>
                              handleDownloadResume(
                                application.seekerCvUrl!,
                                application.seekerName,
                              )
                            }
                          >
                            <Download size={14} />
                            Download CV
                          </Button>
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
                {applications.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} applicants
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} applicants
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
