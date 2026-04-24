// src/app/seeker/enrollments/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BookOpen,
  Plane,
  Users,
  ChevronRight,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface Enrollment {
  id: number;
  title: string;
  provider: string;
  type: "course" | "visa" | "gateway";
  progress: number;
  enrolledDate: string;
  status: "in-progress" | "completed" | "pending" | "processing";
  nextStep?: string;
}

// Mock data - replace with API call
const allEnrollments: Enrollment[] = [
  {
    id: 1,
    title: "Full Stack Web Development Bootcamp",
    provider: "Tech Academy",
    type: "course",
    progress: 45,
    enrolledDate: "2024-04-08",
    status: "in-progress",
    nextStep: "Complete Module 5",
  },
  {
    id: 2,
    title: "Work Visa - UAE",
    provider: "Visa Services",
    type: "visa",
    progress: 60,
    enrolledDate: "2024-03-22",
    status: "processing",
    nextStep: "Document verification in progress",
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    provider: "Marketing Pro",
    type: "course",
    progress: 80,
    enrolledDate: "2024-03-01",
    status: "in-progress",
    nextStep: "Final assignment",
  },
  {
    id: 4,
    title: "Canada Express Entry",
    provider: "Immigration Solutions",
    type: "visa",
    progress: 30,
    enrolledDate: "2024-04-10",
    status: "processing",
    nextStep: "IELTS preparation",
  },
  {
    id: 5,
    title: "UK Skilled Worker Visa",
    provider: "Visa Experts",
    type: "visa",
    progress: 90,
    enrolledDate: "2024-02-15",
    status: "pending",
    nextStep: "Final approval pending",
  },
  {
    id: 6,
    title: "Global Career Gateway Program",
    provider: "Gateway International",
    type: "gateway",
    progress: 25,
    enrolledDate: "2024-04-05",
    status: "in-progress",
    nextStep: "Profile assessment",
  },
  {
    id: 7,
    title: "Python for Data Science",
    provider: "Code Academy",
    type: "course",
    progress: 15,
    enrolledDate: "2024-04-12",
    status: "in-progress",
    nextStep: "Week 2 assignments",
  },
  {
    id: 8,
    title: "Australia Skilled Migration",
    provider: "Migration Experts",
    type: "visa",
    progress: 50,
    enrolledDate: "2024-03-30",
    status: "processing",
    nextStep: "Skills assessment in progress",
  },
  {
    id: 9,
    title: "Digital Marketing Masterclass",
    provider: "Marketing Pro",
    type: "course",
    progress: 15,
    enrolledDate: "2024-04-12",
    status: "in-progress",
    nextStep: "Week 2 assignments",
  },
  {
    id: 10,
    title: "Australia Skilled Migration",
    provider: "Migration Experts",
    type: "visa",
    progress: 50,
    enrolledDate: "2024-03-30",
    status: "processing",
    nextStep: "Skills assessment in progress",
  },
  {
    id: 11,
    title: "Digital Marketing Masterclass",
    provider: "Marketing Pro",
    type: "course",
    progress: 15,
    enrolledDate: "2024-04-12",
    status: "in-progress",
    nextStep: "Week 2 assignments",
  },
];

const getStatusConfig = (status: Enrollment["status"]) => {
  const config = {
    "in-progress": {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    completed: {
      label: "Completed",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    pending: {
      label: "Pending",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    processing: {
      label: "Under Processing",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
  };
  return config[status];
};

const getTypeIcon = (type: Enrollment["type"]) => {
  switch (type) {
    case "course":
      return <BookOpen size={18} />;
    case "visa":
      return <Plane size={18} />;
    case "gateway":
      return <Users size={18} />;
  }
};

const getTypeLabel = (type: Enrollment["type"]) => {
  switch (type) {
    case "course":
      return "Course";
    case "visa":
      return "Visa Service";
    case "gateway":
      return "Gateway";
  }
};

export default function SeekerEnrollments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "courses" | "visa" | "gateway"
  >("all");
  const itemsPerPage = 10;

  // Filter enrollments based on type
  const getFilteredEnrollments = () => {
    if (activeFilter === "courses") {
      return allEnrollments.filter((e) => e.type === "course");
    }
    if (activeFilter === "visa") {
      return allEnrollments.filter((e) => e.type === "visa");
    }
    if (activeFilter === "gateway") {
      return allEnrollments.filter((e) => e.type === "gateway");
    }
    return allEnrollments;
  };

  const filteredEnrollments = getFilteredEnrollments();
  const totalItems = filteredEnrollments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEnrollments = filteredEnrollments.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = allEnrollments.length;
  const coursesCount = allEnrollments.filter((e) => e.type === "course").length;
  const visaCount = allEnrollments.filter((e) => e.type === "visa").length;
  const gatewayCount = allEnrollments.filter(
    (e) => e.type === "gateway",
  ).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Enrolled 1 day ago";
    if (diffDays <= 7) return `Enrolled ${diffDays} days ago`;
    if (diffDays <= 30) return `Enrolled ${Math.floor(diffDays / 7)} weeks ago`;
    return `Enrolled ${Math.floor(diffDays / 30)} months ago`;
  };

  const handleContactSupport = (id: number) => {
    console.log("Contact support for enrollment:", id);
    // Implement contact support logic
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Track your courses, visa applications, and migration plans
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
                  setActiveFilter("courses");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "courses"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <BookOpen size={16} /> */}
                Courses
                <span className="hidden md:inline-block">({coursesCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("visa");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "visa"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Plane size={16} /> */}
                Visa{" "}
                <span className="hidden md:inline-block">({visaCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("gateway");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "gateway"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Users size={16} /> */}
                Gateway
                <span className="hidden md:inline-block">({gatewayCount})</span>
              </button>
            </div>
          </div>

          {/* Enrollments List */}
          <div className="flex-1 space-y-4">
            {currentEnrollments.map((enrollment) => {
              const statusConfig = getStatusConfig(enrollment.status);
              return (
                <div
                  key={enrollment.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeIcon(enrollment.type)}
                            <span className="text-xs text-muted-foreground">
                              {getTypeLabel(enrollment.type)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">
                            {enrollment.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.provider}
                          </p>
                        </div>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-semibold text-primary">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {formatDate(enrollment.enrolledDate)}
                        </span>
                        {enrollment.nextStep && (
                          <span className="flex items-center gap-1 text-primary">
                            <ChevronRight size={14} />
                            Next: {enrollment.nextStep}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <Link href={`/seeker/enrollments/${enrollment.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full"
                        >
                          <ExternalLink size={14} />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={() => handleContactSupport(enrollment.id)}
                      >
                        <Mail size={14} />
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentEnrollments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "courses"
                    ? "No courses enrolled yet. Browse our courses to get started."
                    : activeFilter === "visa"
                      ? "No visa services enrolled yet."
                      : activeFilter === "gateway"
                        ? "No gateway programs enrolled yet."
                        : "No enrollments found"}
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
                {totalItems} enrollments
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} enrollments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
