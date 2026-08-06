// src/app/admin/visa-gateway/gateway/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  DollarSign,
  BookOpen,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface GatewayConsultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  // Study Preferences
  preferredCountry: string;
  otherCountry?: string;
  preferredStudyField: string;
  preferredStudyLevel: string;
  preferredIntake: string;
  preferredUniversityType?: string;
  languageTestStatus: "completed" | "planning";
  // Financial Planning
  budget: string;
  familySponsorship: "yes" | "no";
  educationLoanInterest: "yes" | "no";
  // Readiness
  passportAvailable: "yes" | "no";
  previousVisaRejection: "yes" | "no";
  readyToApplyWithin: "1month" | "3months" | "6months" | "other";
  status: "pending" | "in_review" | "completed" | "cancelled";
  appliedDate: string;
  avatar?: string;
}

// Mock data - replace with API call
const getConsultationsByGatewayId = (
  gatewayId: number,
): {
  gatewayTitle: string;
  gatewayId: number;
  consultations: GatewayConsultation[];
} => {
  const gatewaysData: Record<
    number,
    {
      gatewayTitle: string;
      gatewayId: number;
      consultations: GatewayConsultation[];
    }
  > = {
    1: {
      gatewayId: 1,
      gatewayTitle: "UK Immigration Gateway",
      consultations: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+94 77 123 4567",
          preferredCountry: "United Kingdom",
          preferredStudyField: "Computer Science",
          preferredStudyLevel: "Master's Degree",
          preferredIntake: "September 2024",
          preferredUniversityType: "Public University",
          languageTestStatus: "completed",
          budget: "$35,000 USD",
          familySponsorship: "yes",
          educationLoanInterest: "no",
          passportAvailable: "yes",
          previousVisaRejection: "no",
          readyToApplyWithin: "3months",
          status: "pending",
          appliedDate: "2024-04-21",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+94 77 234 5678",
          preferredCountry: "Canada",
          preferredStudyField: "Business Administration",
          preferredStudyLevel: "PhD",
          preferredIntake: "January 2025",
          preferredUniversityType: "Private University",
          languageTestStatus: "planning",
          budget: "$50,000 CAD",
          familySponsorship: "yes",
          educationLoanInterest: "yes",
          passportAvailable: "yes",
          previousVisaRejection: "yes",
          readyToApplyWithin: "6months",
          status: "in_review",
          appliedDate: "2024-04-20",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+94 77 345 6789",
          preferredCountry: "Australia",
          preferredStudyField: "Engineering",
          preferredStudyLevel: "Bachelor's Degree",
          preferredIntake: "July 2024",
          languageTestStatus: "completed",
          budget: "$40,000 AUD",
          familySponsorship: "no",
          educationLoanInterest: "yes",
          passportAvailable: "yes",
          previousVisaRejection: "no",
          readyToApplyWithin: "1month",
          status: "pending",
          appliedDate: "2024-04-19",
        },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+94 77 456 7890",
          preferredCountry: "Germany",
          otherCountry: "",
          preferredStudyField: "Data Science",
          preferredStudyLevel: "Master's Degree",
          preferredIntake: "October 2024",
          preferredUniversityType: "Technical University",
          languageTestStatus: "completed",
          budget: "€30,000 EUR",
          familySponsorship: "yes",
          educationLoanInterest: "no",
          passportAvailable: "yes",
          previousVisaRejection: "no",
          readyToApplyWithin: "3months",
          status: "completed",
          appliedDate: "2024-04-18",
        },
        {
          id: 5,
          name: "Charlie Wilson",
          email: "charlie@example.com",
          phone: "+94 77 567 8901",
          preferredCountry: "USA",
          preferredStudyField: "Medicine",
          preferredStudyLevel: "Doctorate",
          preferredIntake: "August 2024",
          preferredUniversityType: "Ivy League",
          languageTestStatus: "completed",
          budget: "$60,000 USD",
          familySponsorship: "yes",
          educationLoanInterest: "yes",
          passportAvailable: "yes",
          previousVisaRejection: "yes",
          readyToApplyWithin: "other",
          status: "cancelled",
          appliedDate: "2024-04-17",
        },
      ],
    },
  };
  return (
    gatewaysData[gatewayId] || {
      gatewayId,
      gatewayTitle: "Unknown Gateway",
      consultations: [],
    }
  );
};

const getStatusConfig = (status: GatewayConsultation["status"]) => {
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

const getReadyToApplyLabel = (value: string) => {
  const labels: Record<string, string> = {
    "1month": "1 Month",
    "3months": "3 Months",
    "6months": "6 Months",
    other: "Other",
  };
  return labels[value] || value;
};

export default function GatewayConsultationsPage() {
  const params = useParams();
  const router = useRouter();
  const gatewayId = parseInt(params.id as string);
  const { gatewayTitle, consultations } =
    getConsultationsByGatewayId(gatewayId);
  const [currentConsultations, setCurrentConsultations] =
    useState(consultations);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_review" | "completed" | "cancelled"
  >("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter consultations
  const getFilteredConsultations = () => {
    if (statusFilter === "all") return currentConsultations;
    return currentConsultations.filter((c) => c.status === statusFilter);
  };

  const filteredConsultations = getFilteredConsultations();
  const totalItems = filteredConsultations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConsultations = filteredConsultations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Get counts for filters
  const allCount = currentConsultations.length;
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
    newStatus: GatewayConsultation["status"],
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
        <h2 className="text-xl font-bold">
          Gateway Consultations - {gatewayTitle}
        </h2>
      </div>

      <Card className="bg-primary/4">
        <CardContent className="px-6 py-2">
          {/* Status Filter Tabs */}
          <div className="mb-6">
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
                All ({allCount})
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
          </div>

          {/* Consultations List */}
          <div className="space-y-4">
            {paginatedConsultations.map((consultation) => {
              const statusConfig = getStatusConfig(consultation.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={consultation.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {consultation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{consultation.name}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail size={12} /> {consultation.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} /> {consultation.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {formatDate(consultation.appliedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={statusConfig.color}>
                        <span className="flex items-center gap-1 text-xs">
                          <StatusIcon size={10} />
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </div>

                    {/* Study Preferences Section */}
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                        <BookOpen size={14} />
                        Study Preferences
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Preferred Country
                          </p>
                          <p className="font-medium">
                            {consultation.preferredCountry}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Preferred Study Field
                          </p>
                          <p className="font-medium">
                            {consultation.preferredStudyField}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Preferred Study Level
                          </p>
                          <p className="font-medium">
                            {consultation.preferredStudyLevel}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Preferred Intake
                          </p>
                          <p className="font-medium">
                            {consultation.preferredIntake}
                          </p>
                        </div>
                        {consultation.preferredUniversityType && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Preferred University Type
                            </p>
                            <p className="font-medium">
                              {consultation.preferredUniversityType}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Language Test
                          </p>
                          <Badge
                            variant={
                              consultation.languageTestStatus === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {consultation.languageTestStatus === "completed"
                              ? "Completed"
                              : "Planning to do soon"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Financial Planning Section */}
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                        <DollarSign size={14} />
                        Financial Planning
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Budget (Annual)
                          </p>
                          <p className="font-medium">{consultation.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Family Sponsorship Available?
                          </p>
                          <Badge
                            variant={
                              consultation.familySponsorship === "yes"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {consultation.familySponsorship === "yes"
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Education Loan Interest?
                          </p>
                          <Badge
                            variant={
                              consultation.educationLoanInterest === "yes"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {consultation.educationLoanInterest === "yes"
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Readiness Section */}
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                        <ClipboardCheck size={14} />
                        Readiness Check
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Passport Available?
                          </p>
                          <Badge
                            variant={
                              consultation.passportAvailable === "yes"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {consultation.passportAvailable === "yes"
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Previous Visa Rejection?
                          </p>
                          <Badge
                            variant={
                              consultation.previousVisaRejection === "yes"
                                ? "destructive"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {consultation.previousVisaRejection === "yes"
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Ready to Apply Within
                          </p>
                          <p className="font-medium">
                            {getReadyToApplyLabel(
                              consultation.readyToApplyWithin,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t justify-end">
                      {consultation.status !== "in_review" &&
                        consultation.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              handleStatusChange(consultation.id, "in_review")
                            }
                          >
                            <AlertCircle size={12} />
                            Mark In Review
                          </Button>
                        )}
                      {consultation.status !== "completed" &&
                        consultation.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() =>
                              handleStatusChange(consultation.id, "completed")
                            }
                          >
                            <CheckCircle size={12} />
                            Mark Completed
                          </Button>
                        )}
                      {consultation.status !== "cancelled" &&
                        consultation.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(consultation.id, "cancelled")
                            }
                          >
                            <XCircle size={12} />
                            Cancel
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {paginatedConsultations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {statusFilter !== "all"
                    ? `No ${statusFilter.replace("_", " ")} consultations found`
                    : "No consultations received yet"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t">
              Showing all {totalItems} consultations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
