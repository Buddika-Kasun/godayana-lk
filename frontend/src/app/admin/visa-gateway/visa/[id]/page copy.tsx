// src/app/admin/visa-gateway/visa/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Book,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface VisaConsultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  visaType: "student" | "work" | "visit";
  country: string;
  hasPassport: "yes" | "no";
  previousRejection: "yes" | "no";
  targetTravelMonth: string;
  additionalNotes: string;
  status: "pending" | "in_review" | "completed" | "cancelled";
  appliedDate: string;
  avatar?: string;
}

// Mock data - replace with API call
const getConsultationsByVisaId = (
  visaId: number,
): { visaTitle: string; visaId: number; consultations: VisaConsultation[] } => {
  const visasData: Record<
    number,
    { visaTitle: string; visaId: number; consultations: VisaConsultation[] }
  > = {
    1: {
      visaId: 1,
      visaTitle: "UK Visa Services",
      consultations: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+94 77 123 4567",
          visaType: "student",
          country: "United Kingdom",
          hasPassport: "yes",
          previousRejection: "no",
          targetTravelMonth: "June 2024",
          additionalNotes: "Looking for work visa sponsorship",
          status: "pending",
          appliedDate: "2024-04-21",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+94 77 234 5678",
          visaType: "work",
          country: "United Kingdom",
          hasPassport: "yes",
          previousRejection: "yes",
          targetTravelMonth: "August 2024",
          additionalNotes: "Previous visa was rejected for missing documents",
          status: "in_review",
          appliedDate: "2024-04-20",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+94 77 345 6789",
          visaType: "visit",
          country: "United Kingdom",
          hasPassport: "no",
          previousRejection: "no",
          targetTravelMonth: "September 2024",
          additionalNotes: "Need assistance with passport application first",
          status: "pending",
          appliedDate: "2024-04-19",
        },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+94 77 456 7890",
          visaType: "student",
          country: "United Kingdom",
          hasPassport: "yes",
          previousRejection: "no",
          targetTravelMonth: "July 2024",
          additionalNotes: "Student visa for master's degree",
          status: "completed",
          appliedDate: "2024-04-18",
        },
        {
          id: 5,
          name: "Charlie Wilson",
          email: "charlie@example.com",
          phone: "+94 77 567 8901",
          visaType: "work",
          country: "United Kingdom",
          hasPassport: "yes",
          previousRejection: "yes",
          targetTravelMonth: "October 2024",
          additionalNotes: "Need help with document preparation",
          status: "cancelled",
          appliedDate: "2024-04-17",
        },
        {
          id: 6,
          name: "Diana Prince",
          email: "diana@example.com",
          phone: "+94 77 678 9012",
          visaType: "visit",
          country: "United Kingdom",
          hasPassport: "yes",
          previousRejection: "no",
          targetTravelMonth: "December 2024",
          additionalNotes: "Tourist visa for family visit",
          status: "pending",
          appliedDate: "2024-04-16",
        },
      ],
    },
  };
  return (
    visasData[visaId] || {
      visaId,
      visaTitle: "Unknown Visa",
      consultations: [],
    }
  );
};

const getStatusConfig = (status: VisaConsultation["status"]) => {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    in_review: {
      label: "In Review",
      icon: AlertCircle,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };
  return config[status];
};

const getVisaTypeLabel = (visaType: VisaConsultation["visaType"]) => {
  const types = {
    student: "Student Visa",
    work: "Work Visa",
    visit: "Visit Visa",
  };
  return types[visaType];
};

export default function VisaConsultationsPage() {
  const params = useParams();
  const router = useRouter();
  const visaId = parseInt(params.id as string);
  const { visaTitle, consultations } = getConsultationsByVisaId(visaId);
  const [currentConsultations, setCurrentConsultations] =
    useState(consultations);
  const [visaTypeFilter, setVisaTypeFilter] = useState<
    "all" | "student" | "work" | "visit"
  >("student");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_review" | "completed" | "cancelled"
  >("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter consultations based on visa type and status
  const getFilteredConsultations = () => {
    let filtered = currentConsultations;

    // Filter by visa type
    if (visaTypeFilter !== "all") {
      filtered = filtered.filter((c) => c.visaType === visaTypeFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    return filtered;
  };

  const filteredConsultations = getFilteredConsultations();
  const totalItems = filteredConsultations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConsultationsList = filteredConsultations.slice(
    startIndex,
    endIndex,
  );

  // Get counts for filters
  const allCount = currentConsultations.length;
  const studentCount = currentConsultations.filter(
    (c) => c.visaType === "student",
  ).length;
  const workCount = currentConsultations.filter(
    (c) => c.visaType === "work",
  ).length;
  const visitCount = currentConsultations.filter(
    (c) => c.visaType === "visit",
  ).length;

  const pendingCount = currentConsultations.filter(
    (c) => c.status === "pending",
  ).length;
  const inReviewCount = currentConsultations.filter(
    (c) => c.status === "in_review",
  ).length;
  const completedCount = currentConsultations.filter(
    (c) => c.status === "completed",
  ).length;
  const cancelledCount = currentConsultations.filter(
    (c) => c.status === "cancelled",
  ).length;

  const handleStatusChange = (
    consultationId: number,
    newStatus: VisaConsultation["status"],
  ) => {
    setCurrentConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId ? { ...c, status: newStatus } : c,
      ),
    );
    toast.success(`Consultation ${newStatus.replace("_", " ")} successfully`);
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
    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
        <h2 className="text-xl font-bold">Visa Consultations - {visaTitle}</h2>
      </div>
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col px-4">
          {/* Visa Type Filter Tabs */}
          <div className="w-full mb-4">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              {/* <button
                onClick={() => {
                  setVisaTypeFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  visaTypeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All Visa Types ({allCount})
              </button> */}
              <button
                onClick={() => {
                  setVisaTypeFilter("student");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  visaTypeFilter === "student"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Student ({studentCount})
              </button>
              <button
                onClick={() => {
                  setVisaTypeFilter("work");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  visaTypeFilter === "work"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Work ({workCount})
              </button>
              <button
                onClick={() => {
                  setVisaTypeFilter("visit");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  visaTypeFilter === "visit"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Visit ({visitCount})
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="w-full flex flex-col md:flex-row justify-between mb-6">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              {/* <button
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All Status
              </button> */}
              <button
                onClick={() => {
                  setStatusFilter("pending");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Clock size={14} /> */}
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("in_review");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "in_review"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <AlertCircle size={14} /> */}
                In Review ({inReviewCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("completed");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "completed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <CheckCircle size={14} /> */}
                Completed ({completedCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("cancelled");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "cancelled"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <XCircle size={14} /> */}
                Cancelled ({cancelledCount})
              </button>
            </div>

            {/* <div className="pb-2 md:pb-0">
              <Link href={`/admin/visa-gateway`}>
                <Button className="gap-2 cursor-pointer w-full lg:w-auto px-4">
                  <Book size={16} />
                  Back to Services
                </Button>
              </Link>
            </div> */}
          </div>

          {/* Consultations List */}
          <div className="flex-1 space-y-4">
            {currentConsultationsList.map((consultation) => {
              const statusConfig = getStatusConfig(consultation.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={consultation.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={consultation.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {consultation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">
                              {consultation.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {getVisaTypeLabel(consultation.visaType)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail size={14} /> {consultation.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} /> {consultation.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> Applied{" "}
                              {formatDate(consultation.appliedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={statusConfig.color}>
                        <span className="flex items-center gap-1">
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </div>

                    {/* Form Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Target Country
                        </p>
                        <p className="text-sm font-medium">
                          {consultation.country}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Has Passport?
                        </p>
                        <Badge
                          variant={
                            consultation.hasPassport === "yes"
                              ? "default"
                              : "destructive"
                          }
                          className="w-fit"
                        >
                          {consultation.hasPassport === "yes" ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Previous Visa Rejection?
                        </p>
                        <Badge
                          variant={
                            consultation.previousRejection === "yes"
                              ? "destructive"
                              : "default"
                          }
                          className="w-fit"
                        >
                          {consultation.previousRejection === "yes"
                            ? "Yes"
                            : "No"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Target Travel Month
                        </p>
                        <p className="text-sm font-medium">
                          {consultation.targetTravelMonth}
                        </p>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Additional Notes
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.additionalNotes ||
                            "No additional notes provided"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Link
                        href={`/admin/visa-gateway/visa/${visaId}/consultation/${consultation.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Details
                        </Button>
                      </Link>
                      {consultation.status !== "in_review" &&
                        consultation.status !== "completed" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(consultation.id, "in_review")
                            }
                          >
                            <AlertCircle size={14} />
                            Mark In Review
                          </Button>
                        )}
                      {consultation.status !== "completed" &&
                        consultation.status !== "cancelled" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(consultation.id, "completed")
                            }
                          >
                            <CheckCircle size={14} />
                            Mark Completed
                          </Button>
                        )}
                      {consultation.status !== "cancelled" &&
                        consultation.status !== "completed" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(consultation.id, "cancelled")
                            }
                          >
                            <XCircle size={14} />
                            Cancel
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentConsultationsList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {visaTypeFilter !== "all"
                    ? `No ${visaTypeFilter} visa consultations found`
                    : statusFilter !== "all"
                      ? `No ${statusFilter.replace("_", " ")} consultations found`
                      : "No consultations received yet"}
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
                {totalItems} consultations
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} consultations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
