// src/app/company/jobs/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  BarChart3,
  MapPin,
  Briefcase,
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

interface Job {
  id: number;
  title: string;
  location: string;
  type: "local" | "overseas";
  status: "active" | "closed" | "draft";
  applications: number;
  views: number;
  postedDate: string;
  company: string;
}

// Mock data - replace with API call
const allJobs: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "Colombo",
    type: "local",
    status: "active",
    applications: 45,
    views: 320,
    postedDate: "2024-04-20",
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Creative Agency",
    location: "Kandy",
    type: "local",
    status: "active",
    applications: 28,
    views: 210,
    postedDate: "2024-04-15",
  },
  {
    id: 3,
    title: "Construction Worker",
    company: "Build Masters",
    location: "Dubai UAE",
    type: "overseas",
    status: "active",
    applications: 52,
    views: 410,
    postedDate: "2024-04-18",
  },
  {
    id: 4,
    title: "Sales Executive",
    company: "Sales Hub",
    location: "Colombo",
    type: "local",
    status: "closed",
    applications: 55,
    views: 180,
    postedDate: "2024-04-10",
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech",
    location: "Remote",
    type: "local",
    status: "draft",
    applications: 0,
    views: 0,
    postedDate: "2024-04-22",
  },
];

const getStatusConfig = (status: Job["status"]) => {
  const config = {
    active: {
      label: "Active",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    closed: {
      label: "Closed",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    draft: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  };
  return config[status];
};

export default function CompanyJobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "closed" | "draft"
  >("all");
  const [jobs, setJobs] = useState<Job[]>(allJobs);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
  const itemsPerPage = 10;

  // Filter jobs based on status
  const getFilteredJobs = () => {
    if (activeFilter === "active") {
      return jobs.filter((job) => job.status === "active");
    }
    if (activeFilter === "closed") {
      return jobs.filter((job) => job.status === "closed");
    }
    if (activeFilter === "draft") {
      return jobs.filter((job) => job.status === "draft");
    }
    return jobs;
  };

  const filteredJobs = getFilteredJobs();
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = jobs.length;
  const activeCount = jobs.filter((job) => job.status === "active").length;
  const closedCount = jobs.filter((job) => job.status === "closed").length;
  const draftCount = jobs.filter((job) => job.status === "draft").length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteJob = () => {
    if (deleteJobId) {
      setJobs(jobs.filter((job) => job.id !== deleteJobId));
      toast.success("Job deleted successfully");
      setDeleteJobId(null);
    }
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

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your job postings
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("active");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "active"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Active{" "}
                <span className="hidden md:inline-block">({activeCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("closed");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "closed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Closed{" "}
                <span className="hidden md:inline-block">({closedCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("draft");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "draft"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Draft{" "}
                <span className="hidden md:inline-block">({draftCount})</span>
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
            {currentJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              return (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.company}
                          </p>
                        </div>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Job Stats */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {job.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 size={14} /> {job.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {formatDate(job.postedDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />{" "}
                          {job.type === "local" ? "Local Job" : "Overseas Job"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link href={`/company/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                          <Eye size={14} />
                          View
                        </Button>
                      </Link>
                      <Link href={`/company/jobs/edit/${job.id}`}>
                        <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                          <Edit size={14} />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1 cursor-pointer"
                        onClick={() => setDeleteJobId(job.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "draft"
                    ? "No draft jobs found. Create a new job posting."
                    : activeFilter === "active"
                      ? "No active jobs found"
                      : activeFilter === "closed"
                        ? "No closed jobs found"
                        : "No jobs found. Click 'Post a Job' to create your first job posting."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/company/jobs/post">
                    <Button className="mt-4 gap-2">
                      <Plus size={16} />
                      Post Your First Job
                    </Button>
                  </Link>
                )}
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
      <AlertDialog
        open={!!deleteJobId}
        onOpenChange={() => setDeleteJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              job posting and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
