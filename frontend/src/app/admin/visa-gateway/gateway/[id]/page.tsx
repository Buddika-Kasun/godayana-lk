// src/app/admin/visa-gateway/gateway/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BookOpen,
  DollarSign,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { AnimatePresence } from "framer-motion";
import adminVisaGatewayEndpoints, {
  VisaConsultationCountryParams,
  GatewayConsultationResponse,
  VisaCountryCountRequest,
  VisaCountryCountResponse,
} from "@/lib/api/endpoints/admin/adminVisaGatewayEndpoints";
import { formatCountryName } from "@/lib/utils/visaUtils";
import { formatCurrency, getApplyWithinLabel, getIntakeLabel, getLanguageTestStatusLabel, getStatusConfig, getStudyLevelLabel } from "@/lib/utils/gatewayUtils";

export default function GatewayConsultationsPage() {
  const params = useParams();
  const router = useRouter();
  const country = decodeURIComponent(params.id as string);

  const [consultations, setConsultations] = useState<
    GatewayConsultationResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  // Counts
  const [counts, setCounts] = useState<VisaCountryCountResponse>({
    student: 0,
    work: 0,
    visit: 0,
    pending: 0,
    inReview: 0,
    completed: 0,
    cancelled: 0,
  });

  // Fetch consultations by country
  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: VisaConsultationCountryParams = {
        country: country,
        page: currentPage - 1,
        size: itemsPerPage,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response =
        await adminVisaGatewayEndpoints.gateway.getConsultationByCountry(
          params,
        );
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setConsultations(apiResponse.data.content || []);
        setTotalItems(apiResponse.data.totalElements || 0);
        setTotalPages(apiResponse.data.totalPages || 0);
      } else {
        toast.error(apiResponse.message || "Failed to load consultations");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load consultations";
      console.error("Error fetching consultations:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [country, currentPage, itemsPerPage, statusFilter]);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    try {
      const params: VisaCountryCountRequest = {
        country: country,
      };

      const response =
        await adminVisaGatewayEndpoints.gateway.countAdminConsultationsByCountry(
          params,
        );
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCounts(apiResponse.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, [country]);

  // Initial load
  useEffect(() => {
    fetchConsultations();
    fetchCounts();
  }, [fetchConsultations, fetchCounts]);

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchConsultations();
    fetchCounts();
  }, [statusFilter, fetchConsultations, fetchCounts]);

  const handleStatusChange = async (
    consultationId: string,
    newStatus: string,
  ) => {
    try {
      const response =
        await adminVisaGatewayEndpoints.gateway.updateConsultationStatus(
          consultationId,
          newStatus,
        );
      if (response.data.success) {
        toast.success(`Consultation ${newStatus.toLowerCase()} successfully`);
        // Refresh data
        fetchConsultations();
        fetchCounts();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
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

  // Get counts
  const pendingCount = counts.pending || 0;
  const inReviewCount = counts.inReview || 0;
  const completedCount = counts.completed || 0;
  const cancelledCount = counts.cancelled || 0;

  const filteredConsultations = consultations;
  const totalItemsCount = totalItems;

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
          Gateway Consultations - {formatCountryName(country)}
        </h2>
      </div>

      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col px-4">
          {/* Status Filter Tabs */}
          <div className="w-full flex flex-col md:flex-row justify-between mb-4 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              <button
                onClick={() => {
                  setStatusFilter("PENDING");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "PENDING"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("REVIEW");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "REVIEW"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                In Review ({inReviewCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("COMPLETED");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "COMPLETED"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter("CANCELLED");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  statusFilter === "CANCELLED"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>
          </div>

          {/* Consultations List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading consultations..."
                  fullScreen={false}
                />
              </div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {statusFilter
                    ? `No ${getStatusConfig(statusFilter).label.toLowerCase()} gateway consultations found`
                    : "No gateway consultations received yet"}
                </p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => {
                const statusDisplay = getStatusConfig(consultation.status);

                return (
                  <div
                    key={consultation.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div
                        className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 cursor-pointer"
                        onClick={() => toggleExpand(consultation.id)}
                      >
                        <div className="flex items-start gap-4">
                          <OptimizedAvatar
                            src={consultation.seekerProfileImage}
                            alt={consultation.seekerName || "Seeker"}
                            height={60}
                            width={60}
                            fallback={
                              consultation.seekerName
                                ? consultation.seekerName.charAt(0)
                                : "S"
                            }
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">
                                {consultation.seekerName || "Unknown"}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                Gateway
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />{" "}
                                {consultation.seekerEmail || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={14} />{" "}
                                {consultation.seekerPhone || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} /> Applied{" "}
                                {formatDate(consultation.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Badge className={statusDisplay.color}>
                            {statusDisplay.label}
                          </Badge>
                          {/* Expand/Collapse Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(consultation.id)}
                            className="px-2 cursor-pointer"
                          >
                            Details
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${
                                expandedId === consultation.id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Form Details - Expandable */}
                      <AnimatePresence>
                        {expandedId === consultation.id && (
                          <div className="overflow-hidden">
                            {/* Study Preferences */}
                            <div className="pt-4 border-t">
                              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                                <BookOpen size={14} />
                                Study Preferences
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Preferred Country
                                  </p>
                                  <p className="text-sm font-medium">
                                    {consultation.country != "Other"
                                      ? formatCountryName(consultation.country)
                                      : formatCountryName(
                                          consultation.otherCountry,
                                        )  || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Study Field
                                  </p>
                                  <p className="text-sm font-medium">
                                    {consultation.studyField != "Other" ? consultation.studyField : consultation.otherStudyField || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Study Level
                                  </p>
                                  <p className="text-sm font-medium">
                                    {getStudyLevelLabel(
                                      consultation.studyLevel,
                                    )}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Preferred Intake
                                  </p>
                                  <p className="text-sm font-medium">
                                    {getIntakeLabel(consultation.intake)}
                                  </p>
                                </div>
                                {consultation.universityType && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                      University Type
                                    </p>
                                    <p className="text-sm font-medium">
                                      {consultation.universityType}
                                    </p>
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Language Test Status
                                  </p>
                                  <Badge
                                    variant={
                                      consultation.languageTestStatus ===
                                      "COMPLETED"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {getLanguageTestStatusLabel(
                                      consultation.languageTestStatus,
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
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Budget (Annual)
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatCurrency(consultation.budget)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Family Sponsorship
                                  </p>
                                  <Badge
                                    variant={
                                      consultation.familySponsorship === "YES"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {consultation.familySponsorship === "YES"
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
                                      consultation.educationLoan === "YES"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {consultation.educationLoan === "YES"
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
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Has Passport?
                                  </p>
                                  <Badge
                                    variant={
                                      consultation.hasPassport === "YES"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {consultation.hasPassport === "YES"
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
                                      consultation.visaRejection === "YES"
                                        ? "destructive"
                                        : "default"
                                    }
                                    className="w-fit text-xs"
                                  >
                                    {consultation.visaRejection === "YES"
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
                                      consultation.applyWithin,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <div className="flex-1">
                          <Link
                            href={`/admin/visa-gateway/seeker/${consultation.seekerId}`}
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
                        </div>
                        {consultation.status !== "REVIEW" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(consultation.id, "REVIEW")
                            }
                          >
                            <AlertCircle size={14} />
                            Mark In Review
                          </Button>
                        )}
                        {consultation.status !== "COMPLETED" &&
                          consultation.status !== "CANCELLED" && (
                            <Button
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() =>
                                handleStatusChange(consultation.id, "COMPLETED")
                              }
                            >
                              <CheckCircle size={14} />
                              Mark Completed
                            </Button>
                          )}
                        {consultation.status !== "CANCELLED" &&
                          consultation.status !== "COMPLETED" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1 cursor-pointer"
                              onClick={() =>
                                handleStatusChange(consultation.id, "CANCELLED")
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
                {filteredConsultations.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItemsCount)} of{" "}
                {totalItemsCount} consultations
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItemsCount > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItemsCount} consultations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
