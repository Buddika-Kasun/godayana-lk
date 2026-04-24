// src/app/company/applications/[id]/page.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Candidate {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  experience: string;
  matchPercentage: number;
  status: "new" | "under_review" | "shortlisted" | "rejected";
  appliedDate: string;
  resume: string;
  avatar?: string;
}

// Mock data - replace with API call
const getCandidatesByJobId = (
  jobId: number,
): { jobTitle: string; jobId: number; candidates: Candidate[] } => {
  const jobsData: Record<
    number,
    { jobTitle: string; jobId: number; candidates: Candidate[] }
  > = {
    1: {
      jobId: 1,
      jobTitle: "Senior Software Engineer",
      candidates: [
        {
          id: 1,
          name: "John Doe",
          title: "Senior Software Engineer",
          email: "john@example.com",
          phone: "+94 77 123 4567",
          experience: "5 years",
          matchPercentage: 92,
          status: "new",
          appliedDate: "2024-04-21",
          resume: "/resumes/john-doe.pdf",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Senior Software Engineer",
          email: "jane.smith@example.com",
          phone: "+94 77 234 5678",
          experience: "4 years",
          matchPercentage: 88,
          status: "under_review",
          appliedDate: "2024-04-20",
          resume: "/resumes/jane-smith.pdf",
        },
        {
          id: 3,
          name: "Bob Johnson",
          title: "Software Engineer",
          email: "bob@example.com",
          phone: "+94 77 345 6789",
          experience: "3 years",
          matchPercentage: 75,
          status: "new",
          appliedDate: "2024-04-19",
          resume: "/resumes/bob-johnson.pdf",
        },
        {
          id: 4,
          name: "Alice Brown",
          title: "Senior Software Engineer",
          email: "alice@example.com",
          phone: "+94 77 456 7890",
          experience: "6 years",
          matchPercentage: 95,
          status: "shortlisted",
          appliedDate: "2024-04-18",
          resume: "/resumes/alice-brown.pdf",
        },
        {
          id: 5,
          name: "Charlie Wilson",
          title: "Software Engineer",
          email: "charlie@example.com",
          phone: "+94 77 567 8901",
          experience: "2 years",
          matchPercentage: 68,
          status: "rejected",
          appliedDate: "2024-04-17",
          resume: "/resumes/charlie-wilson.pdf",
        },
        {
          id: 6,
          name: "Diana Prince",
          title: "Senior Software Engineer",
          email: "diana@example.com",
          phone: "+94 77 678 9012",
          experience: "7 years",
          matchPercentage: 98,
          status: "shortlisted",
          appliedDate: "2024-04-16",
          resume: "/resumes/diana-prince.pdf",
        },
        {
          id: 7,
          name: "Ethan Hunt",
          title: "Software Engineer",
          email: "ethan@example.com",
          phone: "+94 77 789 0123",
          experience: "4 years",
          matchPercentage: 82,
          status: "new",
          appliedDate: "2024-04-15",
          resume: "/resumes/ethan-hunt.pdf",
        },
        {
          id: 8,
          name: "Fiona Gallagher",
          title: "Senior Software Engineer",
          email: "fiona@example.com",
          phone: "+94 77 890 1234",
          experience: "5 years",
          matchPercentage: 90,
          status: "under_review",
          appliedDate: "2024-04-14",
          resume: "/resumes/fiona-gallagher.pdf",
        },
      ],
    },
    2: {
      jobId: 2,
      jobTitle: "Digital Marketing Manager",
      candidates: [
        {
          id: 9,
          name: "Mike Wilson",
          title: "Digital Marketing Manager",
          email: "mike.wilson@example.com",
          phone: "+94 77 345 6789",
          experience: "3 years",
          matchPercentage: 85,
          status: "shortlisted",
          appliedDate: "2024-04-19",
          resume: "/resumes/mike-wilson.pdf",
        },
      ],
    },
  };
  return jobsData[jobId] || { jobId, jobTitle: "Unknown Job", candidates: [] };
};

const getStatusConfig = (status: Candidate["status"]) => {
  const config = {
    new: {
      label: "New",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    under_review: {
      label: "Under Review",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
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
  };
  return config[status];
};

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  const { jobTitle, candidates } = getCandidatesByJobId(jobId);
  const [currentCandidates, setCurrentCandidates] = useState(candidates);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "new" | "shortlisted" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter candidates based on status
  const getFilteredCandidates = () => {
    if (activeFilter === "new") {
      return currentCandidates.filter((c) => c.status === "new");
    }
    if (activeFilter === "shortlisted") {
      return currentCandidates.filter((c) => c.status === "shortlisted");
    }
    if (activeFilter === "rejected") {
      return currentCandidates.filter((c) => c.status === "rejected");
    }
    return currentCandidates;
  };

  const filteredCandidates = getFilteredCandidates();
  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidatesList = filteredCandidates.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = currentCandidates.length;
  const newCount = currentCandidates.filter((c) => c.status === "new").length;
  const shortlistedCount = currentCandidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const rejectedCount = currentCandidates.filter(
    (c) => c.status === "rejected",
  ).length;

  const handleStatusChange = (
    candidateId: number,
    newStatus: Candidate["status"],
  ) => {
    setCurrentCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c)),
    );
    toast.success(`Candidate ${newStatus.replace("_", " ")} successfully`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) return "Applied 1 day ago";
    if (diffDays <= 7) return `Applied ${diffDays} days ago`;
    if (diffDays <= 30) return `Applied ${Math.floor(diffDays / 7)} weeks ago`;
    return `Applied ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">Applications for {jobTitle}</h2>
      </div>
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col px-4 ">
          {/* Filter Tabs */}
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap mb-6 order-last md:order-first">
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
              {/* <button
                onClick={() => {
                  setActiveFilter("new");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "new"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                New <span className="hidden md:inline-block">({newCount})</span>
              </button> */}
              <button
                onClick={() => {
                  setActiveFilter("shortlisted");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "shortlisted"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Shortlisted{" "}
                <span className="hidden md:inline-block">
                  ({shortlistedCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("rejected");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
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
            </div>

            <div className="pb-2 md:pb-0">
              <Link href={`/company/jobs/${jobId}`}>
                <Button className="gap-2 cursor-pointer w-full lg:w-auto px-4">
                  View Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Candidates List */}
          <div className="flex-1 space-y-4">
            {currentCandidatesList.map((candidate) => {
              const statusConfig = getStatusConfig(candidate.status);
              return (
                <div
                  key={candidate.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {candidate.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {candidate.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <TrendingUp size={12} />
                                Match: {candidate.matchPercentage}%
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail size={14} /> {candidate.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} /> {candidate.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} /> {candidate.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />{" "}
                              {formatDate(candidate.appliedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/company/applications/${jobId}/candidate/${candidate.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 cursor-pointer"
                      >
                        <Download size={14} />
                        Download CV
                      </Button>
                      {candidate.status !== "shortlisted" && (
                        <Button
                          size="sm"
                          className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(candidate.id, "shortlisted")
                          }
                        >
                          <UserCheck size={14} />
                          Shortlist
                        </Button>
                      )}
                      {candidate.status !== "rejected" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(candidate.id, "rejected")
                          }
                        >
                          <UserX size={14} />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentCandidatesList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "new"
                    ? "No new applications"
                    : activeFilter === "shortlisted"
                      ? "No shortlisted candidates"
                      : activeFilter === "rejected"
                        ? "No rejected candidates"
                        : "No applications received yet"}
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
