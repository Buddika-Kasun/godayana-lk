// src/app/admin/jobs/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  Briefcase,
  Flag,
  Clock,
  XCircle,
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

interface JobPost {
  id: number;
  title: string;
  company: string;
  companyId: number;
  location: string;
  type: "local" | "overseas";
  status: "active" | "pending" | "flagged" | "suspended";
  postedDate: string;
  applications: number;
  views: number;
  reportedBy?: number;
  reportReason?: string;
}

// Mock data - replace with API call
const allJobPosts: JobPost[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    companyId: 1,
    location: "Colombo",
    type: "local",
    status: "active",
    postedDate: "2024-04-21",
    applications: 45,
    views: 320,
  },
  {
    id: 2,
    title: "Construction Worker",
    company: "Build Masters",
    companyId: 2,
    location: "Dubai UAE",
    type: "overseas",
    status: "pending",
    postedDate: "2024-04-22",
    applications: 0,
    views: 0,
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "Creative Agency",
    companyId: 3,
    location: "Kandy",
    type: "local",
    status: "flagged",
    postedDate: "2024-04-19",
    applications: 12,
    views: 89,
    reportedBy: 5,
    reportReason: "Inappropriate content",
  },
  {
    id: 4,
    title: "Digital Marketing Manager",
    company: "Digital Hub",
    companyId: 4,
    location: "Colombo",
    type: "local",
    status: "suspended",
    postedDate: "2024-04-15",
    applications: 28,
    views: 210,
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech",
    companyId: 5,
    location: "Remote",
    type: "local",
    status: "pending",
    postedDate: "2024-04-23",
    applications: 0,
    views: 15,
  },
];

const getStatusConfig = (status: JobPost["status"]) => {
  const config = {
    active: {
      label: "Active",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending Review",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    flagged: {
      label: "Flagged",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: Flag,
    },
    suspended: {
      label: "Suspended",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: AlertTriangle,
    },
  };
  return config[status];
};

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

export default function AdminJobPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "flagged" | "suspended"
  >("all");
  const [jobPosts, setJobPosts] = useState<JobPost[]>(allJobPosts);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "suspend" | "remove" | null
  >(null);
  const itemsPerPage = 10;

  const getFilteredJobs = () => {
    if (activeFilter === "pending") {
      return jobPosts.filter((job) => job.status === "pending");
    }
    if (activeFilter === "flagged") {
      return jobPosts.filter((job) => job.status === "flagged");
    }
    if (activeFilter === "suspended") {
      return jobPosts.filter((job) => job.status === "suspended");
    }
    return jobPosts;
  };

  const filteredJobs = getFilteredJobs();
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = jobPosts.length;
  const pendingCount = jobPosts.filter((j) => j.status === "pending").length;
  const flaggedCount = jobPosts.filter((j) => j.status === "flagged").length;
  const suspendedCount = jobPosts.filter(
    (j) => j.status === "suspended",
  ).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApprove = () => {
    if (selectedJobId) {
      setJobPosts(
        jobPosts.map((job) =>
          job.id === selectedJobId ? { ...job, status: "active" } : job,
        ),
      );
      toast.success("Job post approved and published");
      setSelectedJobId(null);
      setActionType(null);
    }
  };

  const handleSuspend = () => {
    if (selectedJobId) {
      setJobPosts(
        jobPosts.map((job) =>
          job.id === selectedJobId ? { ...job, status: "suspended" } : job,
        ),
      );
      toast.success("Job post suspended");
      setSelectedJobId(null);
      setActionType(null);
    }
  };

  const handleRemove = () => {
    if (selectedJobId) {
      setJobPosts(jobPosts.filter((job) => job.id !== selectedJobId));
      toast.success("Job post removed");
      setSelectedJobId(null);
      setActionType(null);
    }
  };

  // Determine which buttons to show based on status
  const getActionButtons = (job: JobPost) => {
    const buttons = [];

    // View button for all
    buttons.push(
      <Link key="view" href={`/admin/jobs/${job.id}`}>
        <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
          <Eye size={14} />
          View
        </Button>
      </Link>,
    );

    // Approve button for pending jobs
    if (job.status === "pending") {
      buttons.push(
        <Button
          key="approve"
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
          onClick={() => {
            setSelectedJobId(job.id);
            setActionType("approve");
          }}
        >
          <CheckCircle size={14} />
          Approve
        </Button>,
      );
    }

    // Suspend button for active and flagged jobs (not for pending or already suspended)
    // if (job.status !== "pending" && job.status !== "suspended") {
    if (job.status !== "suspended") {
      buttons.push(
        <Button
          key="suspend"
          size="sm"
          variant="outline"
          className="gap-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50 cursor-pointer"
          onClick={() => {
            setSelectedJobId(job.id);
            setActionType("suspend");
          }}
        >
          <AlertTriangle size={14} />
          Suspend
        </Button>,
      );
    }

    // Remove button for all
    buttons.push(
      <Button
        key="remove"
        variant="destructive"
        size="sm"
        className="gap-1 cursor-pointer"
        onClick={() => {
          setSelectedJobId(job.id);
          setActionType("remove");
        }}
      >
        <Trash2 size={14} />
        Remove
      </Button>,
    );

    return buttons;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Moderate and manage job posts
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("pending");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">({pendingCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("flagged");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "flagged"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Flagged{" "}
                <span className="hidden md:inline-block">({flaggedCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("suspended");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "suspended"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Suspended <span className="hidden md:inline-block">({suspendedCount})</span>
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 space-y-4">
            {currentJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section - Job Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={`${statusConfig.color} flex items-center gap-1 px-2 py-0.5`}
                            >
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.type === "local" ? "Local" : "Overseas"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 size={14} /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {formatDate(job.postedDate)}
                        </span>
                        {job.applications > 0 && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} /> {job.applications}{" "}
                            applications
                          </span>
                        )}
                      </div>

                      {/* Report Reason for Flagged Jobs */}
                      {job.status === "flagged" && job.reportReason && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Reported: {job.reportReason}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {getActionButtons(job)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "pending"
                    ? "No pending job posts"
                    : activeFilter === "flagged"
                      ? "No flagged job posts"
                      : activeFilter === "suspended"
                        ? "No suspended job posts"
                        : "No job posts found"}
                </p>
              </div>
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
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} job posts
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} job posts
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
            <AlertDialogTitle>Approve Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this job post? It will become
              visible to job seekers.
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

      {/* Suspend Confirmation Dialog */}
      <AlertDialog
        open={actionType === "suspend"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this job post? It will be hidden
              from job seekers until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Confirmation Dialog */}
      <AlertDialog
        open={actionType === "remove"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove this job post? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
