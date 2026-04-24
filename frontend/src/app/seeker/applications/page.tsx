// src/app/seeker/applications/page.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Application {
  id: number;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "interview"
    | "applied";
  type: string;
  isSaved?: boolean;
}

// Mock data - replace with API call
const allApplications: Application[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "Colombo",
    appliedDate: "2024-04-20",
    status: "pending",
    type: "Full-time",
    isSaved: true,
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Creative Agency",
    location: "Kandy",
    appliedDate: "2024-04-15",
    status: "interview",
    type: "Full-time",
    isSaved: false,
  },
  {
    id: 3,
    title: "Construction Worker",
    company: "Build Masters",
    location: "Dubai UAE",
    appliedDate: "2024-04-14",
    status: "applied",
    type: "Contract",
    isSaved: true,
  },
  {
    id: 4,
    title: "Accountant",
    company: "Finance Solutions",
    location: "Galle",
    appliedDate: "2024-04-10",
    status: "rejected",
    type: "Full-time",
    isSaved: false,
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech Solutions",
    location: "Remote",
    appliedDate: "2024-04-18",
    status: "reviewed",
    type: "Remote",
    isSaved: true,
  },
  {
    id: 6,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Colombo",
    appliedDate: "2024-04-12",
    status: "shortlisted",
    type: "Full-time",
    isSaved: false,
  },
  {
    id: 7,
    title: "Project Manager",
    company: "Tech Innovations",
    location: "Kandy",
    appliedDate: "2024-04-08",
    status: "pending",
    type: "Full-time",
    isSaved: true,
  },
  {
    id: 8,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Remote",
    appliedDate: "2024-04-05",
    status: "interview",
    type: "Remote",
    isSaved: false,
  },
  {
    id: 9,
    title: "Marketing Specialist",
    company: "Brand Masters",
    location: "Colombo",
    appliedDate: "2024-04-03",
    status: "applied",
    type: "Full-time",
    isSaved: true,
  },
  {
    id: 10,
    title: "Customer Support",
    company: "Service Hub",
    location: "Galle",
    appliedDate: "2024-04-01",
    status: "rejected",
    type: "Part-time",
    isSaved: false,
  },
  {
    id: 11,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    appliedDate: "2024-03-28",
    status: "reviewed",
    type: "Remote",
    isSaved: true,
  },
  {
    id: 12,
    title: "QA Tester",
    company: "Quality Labs",
    location: "Colombo",
    appliedDate: "2024-03-25",
    status: "shortlisted",
    type: "Full-time",
    isSaved: false,
  },
];

const getStatusConfig = (status: Application["status"]) => {
  const config = {
    pending: {
      label: "Unlock Review",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    reviewed: {
      label: "Under Review",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    shortlisted: {
      label: "Shortlisted",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    interview: {
      label: "Interview Scheduled",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    applied: {
      label: "Applied",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  };
  return config[status];
};

export default function SeekerApplications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
   "all" | "active" | "rejected" | "saved"
  >("all");
  const [applications, setApplications] =
    useState<Application[]>(allApplications);
  const itemsPerPage = 10;

  // Filter applications based on status
  const getFilteredApplications = () => {
    if (activeFilter === "active") {
      return applications.filter((app) => app.status !== "rejected");
    }
    if (activeFilter === "rejected") {
      return applications.filter((app) => app.status === "rejected");
    }
    if (activeFilter === "saved") {
      return applications.filter((app) => app.isSaved === true);
    }
    return applications;
  };

  const filteredApplications = getFilteredApplications();
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = applications.length;
  const activeCount = applications.filter(
    (app) => app.status !== "rejected",
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected",
  ).length;
  const savedCount = applications.filter((app) => app.isSaved === true).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveToggle = (id: number) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, isSaved: !app.isSaved } : app,
      ),
    );
    const application = applications.find((app) => app.id === id);
    if (application?.isSaved) {
      toast.success("Removed from saved");
    } else {
      toast.success("Saved for later");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Applied 1 day ago";
    if (diffDays <= 7) return `Applied ${diffDays} days ago`;
    if (diffDays <= 30) return `Applied ${Math.floor(diffDays / 7)} weeks ago`;
    return `Applied ${Math.floor(diffDays / 30)} months ago`;
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
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap justify-between">
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
                  setActiveFilter("rejected");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({rejectedCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("saved");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "saved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <BookmarkCheck size={16} /> */}
                Saved{" "}
                <span className="hidden md:inline-block">({savedCount})</span>
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="flex-1 space-y-4">
            {currentApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              return (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleSaveToggle(application.id)}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10 p-1 rounded"
                      >
                        {application.isSaved ? (
                          <BookmarkCheck size={20} className="text-primary" />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                      <h3 className="font-semibold text-lg">
                        {application.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2  text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building size={14} /> {application.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {application.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{" "}
                        {formatDate(application.appliedDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                    <Link href={`/seeker/applications/${application.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye size={14} />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentApplications.length === 0 && (
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
