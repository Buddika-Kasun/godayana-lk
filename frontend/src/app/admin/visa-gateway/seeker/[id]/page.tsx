// src/app/company/jobs/applications/seeker/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Award,
  BookOpen,
  CalendarDays,
  Upload,
  Eye,
  Download,
  RefreshCw,
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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { adminSeekerProfileAPI } from "@/lib/api/endpoints/admin/adminSeekerProfileEndpoint";
import {
  seekerProfileAPI,
  SeekerProfileData,
} from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { companySeekerProfileAPI } from "@/lib/api/endpoints/company/companySeekerProfileEndpoints";
import companyJobEndpoints, { JobApplicationResponse } from "@/lib/api/endpoints/company/companyJobEndpoints";
import { seekerJobAPI } from "@/lib/api/endpoints/seeker/seekerJobEndpoints";

// Label mappings
const educationLabels: Record<string, string> = {
  HIGH_SCHOOL: "High School",
  DIPLOMA: "Diploma",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
  PHD: "PhD",
  OTHER: "Other",
};

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const nationalityLabels: Record<string, string> = {
  SRI_LANKAN: "Sri Lankan",
  INDIAN: "Indian",
  AMERICAN: "American",
  BRITISH: "British",
  OTHER: "Other",
};

const employmentStatusLabels: Record<string, string> = {
  EMPLOYED: "Employed",
  UNEMPLOYED: "Unemployed",
  STUDENT: "Student",
  SELF_EMPLOYED: "Self-Employed",
  FREELANCE: "Freelance",
  OTHER: "Other",
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const formatDateOfBirth = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (isActive?: boolean) => {
  if (isActive) {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
      <XCircle className="h-3 w-3 mr-1" />
      Suspended
    </Badge>
  );
};

export default function CompanySeekerView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = params.id as string;
  const applicationId = searchParams.get("application") || null;

  const [seeker, setSeeker] = useState<SeekerProfileData | null>(null);
  const [application, setApplication] = useState<JobApplicationResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "SUSPEND" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle back navigation
  const handleBack = () => {
    if (application?.jobId){
      router.push(`/company/jobs/applications/${application.jobId}`);
    }
    // Check if there's a history entry to go back to
    else if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to users page if no history
      router.push("/company/jobs");
    }
  };

  const fetchSeeker = async () => {
    setIsLoading(true);
    try {
      const response =
        await companySeekerProfileAPI.getCompanySeekerById(userId);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setSeeker(apiResponse.data);
      } else {
        toast.error(apiResponse.message || "Failed to load seeker details");
      }
    } catch (error) {
      console.error("Error fetching seeker:", error);
      toast.error("Failed to load seeker details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplication = async () => {
    // setIsLoading(true);
    try {
      const response = await companyJobEndpoints.applications.getApplicationById(
        applicationId!,
      );
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setApplication(apiResponse.data);
      } else {
        toast.error(apiResponse.message || "Failed to load application details");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application details");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplication()
    }
    if (userId) {
      fetchSeeker();
    }
  }, [userId, applicationId]);

  const handleStatusChange = async (
      applicationId: string,
      newStatus: string,
    ) => {
      setIsUpdating(true);
      try {
        const response = await seekerJobAPI.application.updateApplicationStatus(
          applicationId,
          newStatus,
        );
        if (response.data.success) {
          toast.success(`Candidate ${newStatus.toLowerCase()} successfully`);
          // Refresh the list
          fetchApplication();
        } else {
          toast.error(response.data.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      } finally {
        setIsUpdating(false);
      }
    };

  const confirmStatusChange = async () => {
    if (!newStatus || !seeker) return;

    setIsUpdating(true);
    try {
      let response;
      if (newStatus === "ACTIVE") {
        response = await adminSeekerProfileAPI.activeSeeker(
          seeker.userId || seeker.id || "",
        );
      } else {
        response = await adminSeekerProfileAPI.suspendSeeker(
          seeker.userId || seeker.id || "",
        );
      }

      const apiResponse = response.data;

      if (apiResponse.success) {
        setSeeker({ ...seeker, isActive: newStatus === "ACTIVE" });
        toast.success(`Seeker ${newStatus.toLowerCase()} successfully`);
        setShowStatusDialog(false);
        setNewStatus(null);
      } else {
        toast.error(
          apiResponse.message || `Failed to ${newStatus.toLowerCase()} seeker`,
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewResume = () => {
    if (seeker?.resumeUrl) {
      window.open(seeker.resumeUrl, "_blank");
    } else {
      toast.error("No resume available");
    }
  };

  const handleDownloadResume = async (fileKey: string, name?: string) => {
    if (!fileKey) {
      toast.error("No resume available");
      return;
    }

    const loadingToast = toast.loading("Downloading resume...");

    try {
      // Call the backend API to get the file as blob
      const response = await seekerProfileAPI.downloadResume(fileKey);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from the fileKey or use default
      const fileName = name ? `${name}_CV.pdf` : "Resume.pdf";
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Resume downloaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.", {
        id: loadingToast,
      });
    }
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          {/* <Link href="/admin/users"> */}
          <Button
            variant="ghost"
            className="pl-0 hover:pl-2 cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          {/* </Link> */}
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-3 mt-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>

        {/* Status Card Skeleton */}
        <Skeleton className="h-24 w-full" />

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!seeker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <User className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Job Seeker Not Found</h2>
        <p className="text-muted-foreground">
          The job seeker you&apos;re looking for doesn&apos;t exist.
        </p>
        {/* <Link href="/admin/users"> */}
        <Button className="cursor-pointer" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        {/* </Link> */}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* <Link href="/admin/users"> */}
        <Button
          variant="ghost"
          className="pl-0 hover:pl-2 cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        {/* </Link> */}
      </div>

      <Card className="p-0">
        <CardContent className="px-4 pt-2 pb-4 space-y-4">
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h1 className="text-2xl font-bold">
              {seeker.fullName || "Unnamed Seeker"}
            </h1>
            {getStatusBadge(seeker.isActive)}
            {application?.status && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {/* <Upload className="h-3 w-3 mr-1" /> */}
                {application?.status}
              </Badge>
            )}
          </div>

          {/* Status Actions */}
          {application?.status != null && (
            <Card
              className={
                application?.status === "PENDING"
                  ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                  : application?.status === "SHORTLISTED"
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    : application?.status === "HIRED"
                      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
              }
            >
              <CardContent className="px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {application?.status === "PENDING" && (
                      <>
                        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                            Application is pending review
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            Review the application and take action.
                          </p>
                        </div>
                      </>
                    )}
                    {application?.status === "SHORTLISTED" && (
                      <>
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-semibold text-blue-800 dark:text-blue-300">
                            Candidate has been shortlisted
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            Select the candidate for hiring or reject if not
                            suitable.
                          </p>
                        </div>
                      </>
                    )}
                    {application?.status === "HIRED" && (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-300">
                            Candidate has been hired
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            The candidate has been selected for the position.
                          </p>
                        </div>
                      </>
                    )}
                    {application?.status === "REJECTED" && (
                      <>
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <div>
                          <p className="font-semibold text-red-800 dark:text-red-300">
                            Application has been rejected
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            This candidate was not selected for the position.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons based on application?.status */}
                  <div className="flex flex-wrap gap-2">
                    {application?.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "SHORTLISTED")
                          }
                          disabled={isUpdating}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "REJECTED")
                          }
                          disabled={isUpdating}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {application?.status === "SHORTLISTED" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "HIRED")
                          }
                          disabled={isUpdating}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Hire
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "REJECTED")
                          }
                          disabled={isUpdating}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {application?.status === "HIRED" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "SHORTLISTED")
                          }
                          disabled={isUpdating}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reconsider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() =>
                            handleStatusChange(applicationId!, "REJECTED")
                          }
                          disabled={isUpdating}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {application?.status === "REJECTED" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={() =>
                          handleStatusChange(applicationId!, "SHORTLISTED")
                        }
                        disabled={isUpdating}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reconsider
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Summary */}
              {/* <Card>
                <CardContent className="px-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <OptimizedAvatar
                      src={seeker.profilePicUrl}
                      alt={seeker.fullName || "Seeker"}
                      height={96}
                      width={96}
                      fallback={
                        seeker.fullName ? seeker.fullName.charAt(0) : "U"
                      }
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold">
                          {seeker.fullName || "N/A"}
                        </h2>
                        <Badge variant="outline" className="text-xs">
                          {seeker.employmentStatus
                            ? employmentStatusLabels[seeker.employmentStatus]
                            : "N/A"}
                        </Badge>
                        {seeker.shareCv && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            <Upload className="h-3 w-3 mr-1" />
                            CV Shared
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {seeker.currentJobTitle || "No current job"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {seeker.email || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {seeker.phone || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {seeker.location || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {seeker.skills?.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Personal Information */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Full Name
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.fullName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Email
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Phone
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Date of Birth
                      </Label>
                      <p className="font-medium mt-1">
                        {formatDateOfBirth(seeker.dateOfBirth)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Gender
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.gender ? genderLabels[seeker.gender] : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Nationality
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.nationality
                          ? nationalityLabels[seeker.nationality]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Location
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.location || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Professional Summary
                  </h2>
                  <p className="text-muted-foreground">
                    {seeker.professionalSummary ||
                      "No professional summary provided."}
                  </p>
                </CardContent>
              </Card>

              {/* Education & Experience */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Education & Experience
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Education Level
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.education
                          ? educationLabels[seeker.education]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Study Field
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.studyField || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Experience
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.experienceYears || 0} years
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Employment Status
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.employmentStatus
                          ? employmentStatusLabels[seeker.employmentStatus]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Current Job Title
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.currentJobTitle || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Notice Period
                      </Label>
                      <p className="font-medium mt-1">
                        {seeker.noticePeriod || "N/A"} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Information */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Salary Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Current Salary
                      </Label>
                      <p className="font-medium mt-1">
                        {formatCurrency(seeker.currentSalary)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Expected Salary
                      </Label>
                      <p className="font-medium mt-1">
                        {formatCurrency(seeker.expectedSalary)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferred Job Categories */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Preferred Job Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seeker.preferredJobCategories &&
                    seeker.preferredJobCategories?.length > 0 ? (
                      seeker.preferredJobCategories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        No preferred categories specified
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <OptimizedAvatar
                    src={seeker.profilePicUrl}
                    alt={seeker.fullName || "Seeker"}
                    height={128}
                    width={128}
                    fallback={seeker.fullName ? seeker.fullName.charAt(0) : "U"}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Profile Picture
                  </p>
                </CardContent>
              </Card>

              {/* Resume */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Resume</h2>
                  {seeker.resumeUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">CV</p>
                          <p className="text-xs text-muted-foreground">
                            PDF Document
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 cursor-pointer"
                          onClick={handleViewResume}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 cursor-pointer"
                          onClick={() =>
                            handleDownloadResume(
                              seeker.resumeFileKey!,
                              seeker.fullName,
                            )
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No resume uploaded
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      CV Sharing: {seeker.shareCv ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
                  {seeker.portfolioUrl ? (
                    <a
                      href={seeker.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline break-all"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      {seeker.portfolioUrl}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No portfolio provided
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skills Summary */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {seeker.skills && seeker.skills?.length > 0 ? (
                      seeker.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No skills listed
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p className="font-medium">
                          {formatDate(seeker.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Updated
                        </p>
                        <p className="font-medium">
                          {formatDate(seeker.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    {/* <Button
                      variant="outline"
                      className="w-full justify-start cursor-pointer"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Applications
                    </Button> */}
                    <Button
                      variant="outline"
                      className="w-full justify-start cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    {/* {seeker.resumeUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start cursor-pointer"
                        onClick={handleViewResume}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                      </Button>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this job seeker&apos;s status to{" "}
              <span className="font-semibold">{newStatus?.toLowerCase()}</span>?
              {newStatus === "ACTIVE" &&
                " This will allow the job seeker to access all features."}
              {newStatus === "SUSPEND" &&
                " This will suspend the job seeker's account and they will not be able to access the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isUpdating}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                newStatus === "ACTIVE"
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
              }
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
