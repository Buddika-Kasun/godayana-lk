// src/app/company/applications/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Users, MapPin, Briefcase, Clock } from "lucide-react";
import Link from "next/link";

interface JobApplication {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "local" | "overseas";
  status: "active" | "closed";
  applicationsCount: number;
  newApplicationsCount: number;
  postedDate: string;
}

// Mock data - replace with API call
const allJobs: JobApplication[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "Colombo",
    type: "local",
    status: "active",
    applicationsCount: 12,
    newApplicationsCount: 3,
    postedDate: "2024-04-20",
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Creative Agency",
    location: "Kandy",
    type: "local",
    status: "active",
    applicationsCount: 8,
    newApplicationsCount: 1,
    postedDate: "2024-04-15",
  },
  {
    id: 3,
    title: "Construction Worker",
    company: "Build Masters",
    location: "Dubai UAE",
    type: "overseas",
    status: "active",
    applicationsCount: 15,
    newApplicationsCount: 5,
    postedDate: "2024-04-18",
  },
  {
    id: 4,
    title: "Sales Executive",
    company: "Sales Hub",
    location: "Colombo",
    type: "local",
    status: "closed",
    applicationsCount: 5,
    newApplicationsCount: 0,
    postedDate: "2024-04-10",
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech",
    location: "Remote",
    type: "local",
    status: "active",
    applicationsCount: 3,
    newApplicationsCount: 2,
    postedDate: "2024-04-22",
  },
];

const getStatusConfig = (status: JobApplication["status"]) => {
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
  };
  return config[status];
};

export default function CompanyApplications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "closed">(
    "all",
  );
  const [jobs, setJobs] = useState<JobApplication[]>(allJobs);
  const itemsPerPage = 10;

  // Filter jobs based on status
  const getFilteredJobs = () => {
    if (activeFilter === "active") {
      return jobs.filter((job) => job.status === "active");
    }
    if (activeFilter === "closed") {
      return jobs.filter((job) => job.status === "closed");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              View and manage all applications received for your job postings
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
                          <Users size={14} /> {job.applicationsCount}{" "}
                          applications
                        </span>
                        {job.newApplicationsCount > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <Clock size={14} /> {job.newApplicationsCount} new
                          </span>
                        )}
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
                      <Link href={`/company/applications/${job.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "active"
                    ? "No active jobs with applications found"
                    : activeFilter === "closed"
                      ? "No closed jobs found"
                      : "No jobs found. Post a job to start receiving applications."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/company/jobs/post">
                    <Button className="mt-4 gap-2">Post a Job</Button>
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
    </div>
  );
}
