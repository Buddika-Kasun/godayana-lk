// src/app/seeker/enrollments/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
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
  Clock,
  Clock1,
  Briefcase,
  Book,
  ChevronDown,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import seekerVisaGatewayEndpoints, {
  GatewayConsultationResponse,
  VisaConsultationParams,
  VisaConsultationResponse,
  VisaGatewayCountResponse,
} from "@/lib/api/endpoints/seeker/seekerVisaGatewayEndpoints";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatCountryName, formatDateDisplay } from "@/lib/utils/visaUtils";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { AnimatePresence } from "framer-motion";
import { formatCurrency, getApplyWithinLabel, getIntakeLabel, getLanguageTestStatusLabel, getStudyLevelLabel } from "@/lib/utils/gatewayUtils";

// Status display mapping for visa consultations
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  REVIEW: {
    label: "In Review",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  COMPLETED: {
    label: "Completed",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

// Visa type labels
const VISA_TYPE_LABELS: Record<string, string> = {
  STUDENT: "Student Visa",
  WORK: "Work Visa",
  VISIT: "Visit Visa",
};

// Visa type icons
const VISA_TYPE_ICONS: Record<string, React.ReactNode> = {
  STUDENT: <BookOpen size={18} className="text-primary shrink-0" />,
  WORK: <Briefcase size={18} className="text-primary shrink-0" />,
  VISIT: <Plane size={18} className="text-primary shrink-0" />,
};

export default function SeekerEnrollments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"visa" | "gateway">("visa");
  const [visaApplications, setVisaApplications] = useState<
    VisaConsultationResponse[]
  >([]);
  const [gatewayApplications, setGatewayApplications] = useState<
    GatewayConsultationResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [applicationCounts, setApplicationCounts] =
    useState<VisaGatewayCountResponse>({
      visaCount: 0,
      gatewayCount: 0,
    });
  const itemsPerPage = 10;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  
    const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    };

  // Fetch application counts
  const fetchCounts = async () => {
    try {
      const appCountRes =
        await seekerVisaGatewayEndpoints.visa.countMyConsultations();

      if (appCountRes.data.success && appCountRes.data.data) {
        setApplicationCounts(appCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch visa consultations with pagination and filter
  const fetchVisaConsultations = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: VisaConsultationParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response =
          await seekerVisaGatewayEndpoints.visa.getMyConsultations(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setVisaApplications(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load enrollments");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load enrollments";
        console.error("Error fetching enrollments:", errorMessage);
        toast.error(
          errorMessage || "Failed to load enrollments. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  const fetchGatewayConsultations = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: VisaConsultationParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response =
          await seekerVisaGatewayEndpoints.gateway.getMyConsultations(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setGatewayApplications(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load enrollments");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load enrollments";
        console.error("Error fetching enrollments:", errorMessage);
        toast.error(
          errorMessage || "Failed to load enrollments. Please try again.",
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
    if (activeFilter === "visa") {
      fetchVisaConsultations(currentPage);
    } else if (activeFilter === "gateway") {
      fetchGatewayConsultations(currentPage);
    }
  }, [
    activeFilter,
    currentPage,
    fetchVisaConsultations,
    fetchGatewayConsultations,
  ]);

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

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Track your visa consultation, and migration plans
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => handleFilterChange("visa")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "visa"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Plane size={16} /> */}
                Visa{" "}
                <span className="hidden md:inline-block">
                  ({applicationCounts.visaCount})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("gateway")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "gateway"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Users size={16} /> */}
                Gateway
                <span className="hidden md:inline-block">
                  ({applicationCounts.gatewayCount})
                </span>
              </button>
            </div>
          </div>

          {/* Enrollments List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading consultations..."
                  fullScreen={false}
                />
              </div>
            ) : visaApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "visa"
                    ? `No visa consultations found`
                    : activeFilter === "gateway"
                      ? `No gateway consultations found`
                      : "No consultations received yet"}
                </p>
              </div>
            ) : activeFilter === "visa" ? (
              visaApplications.map((enrollment) => {
                const statusConfig = STATUS_DISPLAY[enrollment.status];
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
                              {VISA_TYPE_ICONS[enrollment.type]}
                              {VISA_TYPE_LABELS[enrollment.type] ||
                                enrollment.type}
                            </div>
                            <h3 className="font-semibold text-lg">
                              {formatCountryName(enrollment.country)}
                            </h3>
                          </div>
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Book size={14} /> Passport{" "}
                            {enrollment.hasPassport ? "Have" : "Haven't"}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} /> Visa Rejection{" "}
                            {enrollment.visaRejection ? "Yes" : "No"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> Target:{" "}
                            {formatDateDisplay(enrollment.travelDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock1 size={14} /> Enrolled{" "}
                            {formatDate(enrollment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              gatewayApplications.map((enrollment) => {
                const statusConfig = STATUS_DISPLAY[enrollment.status];

                return (
                  <div
                    key={enrollment.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => toggleExpand(enrollment.id)}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-4 mb-1">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Plane
                                size={18}
                                className="text-primary shrink-0"
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                Gateway
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock1 size={14} className="shrink-0" />
                              <span>
                                Enrolled {formatDate(enrollment.createdAt)}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-lg truncate">
                            {formatCountryName(enrollment.country)}
                          </h3>
                        </div>

                        <div className="flex md:flex-col flex-row sm:items-center gap-2 shrink-0">
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(enrollment.id);
                            }}
                            className="cursor-pointer py-0 pl-2 pr-1 h-7"
                          >
                            <span className="text-xs">Details</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${
                                expandedId === enrollment.id ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Form Details - Expandable */}
                      <AnimatePresence>
                        {expandedId === enrollment.id && (
                          <div className="overflow-hidden">
                            {/* Study Preferences */}
                            <div className="pt-4 border-t">
                              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                                <BookOpen size={14} />
                                Study Preferences
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Preferred Country
                                  </p>
                                  <p className="text-sm font-medium truncate">
                                    {enrollment.country !== "Other"
                                      ? formatCountryName(enrollment.country)
                                      : formatCountryName(
                                          enrollment.otherCountry,
                                        ) || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Study Field
                                  </p>
                                  <p className="text-sm font-medium truncate">
                                    {enrollment.studyField !== "Other"
                                      ? enrollment.studyField
                                      : enrollment.otherStudyField || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Study Level
                                  </p>
                                  <p className="text-sm font-medium">
                                    {getStudyLevelLabel(enrollment.studyLevel)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Preferred Intake
                                  </p>
                                  <p className="text-sm font-medium">
                                    {getIntakeLabel(enrollment.intake)}
                                  </p>
                                </div>
                                {enrollment.universityType && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                      University Type
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                      {enrollment.universityType}
                                    </p>
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Language Test Status
                                  </p>
                                  <Badge
                                    variant={
                                      enrollment.languageTestStatus ===
                                      "COMPLETED"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {getLanguageTestStatusLabel(
                                      enrollment.languageTestStatus,
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Financial Planning */}
                            <div className="pt-4 border-t mt-4">
                              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                                <DollarSign size={14} />
                                Financial Planning
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Budget (Annual)
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatCurrency(enrollment.budget)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Family Sponsorship
                                  </p>
                                  <Badge
                                    variant={
                                      enrollment.familySponsorship === "YES"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {enrollment.familySponsorship === "YES"
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Education Loan Interest
                                  </p>
                                  <Badge
                                    variant={
                                      enrollment.educationLoan === "YES"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {enrollment.educationLoan === "YES"
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Readiness */}
                            <div className="pt-4 border-t mt-4">
                              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                                <ClipboardCheck size={14} />
                                Readiness Check
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Has Passport?
                                  </p>
                                  <Badge
                                    variant={
                                      enrollment.hasPassport === "YES"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {enrollment.hasPassport === "YES"
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Previous Visa Rejection?
                                  </p>
                                  <Badge
                                    variant={
                                      enrollment.visaRejection === "YES"
                                        ? "destructive"
                                        : "default"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {enrollment.visaRejection === "YES"
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Ready to Apply Within
                                  </p>
                                  <p className="text-sm font-medium">
                                    {getApplyWithinLabel(
                                      enrollment.applyWithin,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })
            )}

            {/* Empty State */}
            {visaApplications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "visa"
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
                Showing{" "}
                {visaApplications.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
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
