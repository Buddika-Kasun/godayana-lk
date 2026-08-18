// src/app/admin/approvals/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Facebook,
  Linkedin,
  Instagram,
  User,
  FileText,
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
import {
  formatCategory,
  formatCompanyType,
  formatEmployeeCount,
} from "@/lib/utils/companyUtils";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { adminCompanyProfileAPI } from "@/lib/api/endpoints/admin/adminCompanyProfileEndpoint";
import { CompanyProfileData } from "@/lib/api/endpoints/company/companyProfileEndpoints";

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

export default function AdminCompanyView() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [company, setCompany] = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        const response =
          await adminCompanyProfileAPI.getAdminCompanyById(userId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setCompany(apiResponse.data);
        } else {
          toast.error(apiResponse.message || "Failed to load company details");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        toast.error("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCompany();
    }
  }, [userId]);

  const handleStatusChange = (status: "APPROVED" | "REJECTED") => {
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!newStatus || !company) return;

    setIsUpdating(true);
    try {
      let response;
      if (newStatus === "APPROVED") {
        response = await adminCompanyProfileAPI.approveCompany(
          company.userId || company.id || "",
        );
      } else {
        response = await adminCompanyProfileAPI.rejectCompany(
          company.userId || company.id || "",
        );
      }

      const apiResponse = response.data;

      if (apiResponse.success) {
        setCompany({ ...company, status: newStatus });
        toast.success(`Company ${newStatus.toLowerCase()} successfully`);
        setShowStatusDialog(false);
        setNewStatus(null);
      } else {
        toast.error(
          apiResponse.message || `Failed to ${newStatus.toLowerCase()} company`,
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getVerificationBadge = (isVerified?: boolean) => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <AlertCircle className="h-3 w-3 mr-1" />
        Suspended
      </Badge>
    );
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <Link href="/admin/approvals">
              <Button
                variant="ghost"
                className="pl-0 hover:pl-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Approvals
              </Button>
            </Link>
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

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Company Not Found</h2>
        <p className="text-muted-foreground">
          The company you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/approvals">
          <Button className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Approvals
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <Link href="/admin/approvals">
          <Button variant="ghost" className="pl-0 hover:pl-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Approvals
          </Button>
        </Link>
      </div>

      <Card className="p-0">
        <CardContent className="px-4 pt-2 pb-4 space-y-4">
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h1 className="text-2xl font-bold">
              {company.companyName || "Unnamed Company"}
            </h1>
            {getStatusBadge(company.status)}
            {getVerificationBadge(company.isVerified)}
          </div>

          {/* Status Actions */}
          <Card
            className={
              company.status === "PENDING"
                ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                : company.status === "APPROVED"
                  ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
            }
          >
            <CardContent className="px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {company.status === "PENDING" && (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                          This company is pending verification
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          Review the company details and approve or reject the
                          application.
                        </p>
                      </div>
                    </>
                  )}
                  {company.status === "APPROVED" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">
                          This company is approved
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          The company has full access to all features.
                        </p>
                      </div>
                    </>
                  )}
                  {company.status === "REJECTED" && (
                    <>
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-300">
                          This company has been rejected
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          The company application has been rejected.
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() => handleStatusChange("APPROVED")}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={() => handleStatusChange("REJECTED")}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {company.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleStatusChange("REJECTED")}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  {company.status === "REJECTED" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      onClick={() => handleStatusChange("APPROVED")}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Company Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Company Name
                        </Label>
                        <p className="font-medium mt-1">
                          {company.companyName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Registration Number
                        </Label>
                        <p className="font-medium mt-1">
                          {company.registrationNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Description
                      </Label>
                      <p className="font-medium mt-1">
                        {company.description || "No description provided"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Industry
                        </Label>
                        <p className="font-medium mt-1">
                          {formatCategory(company.industry) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Company Type
                        </Label>
                        <p className="font-medium mt-1">
                          {formatCompanyType(company.companyType) || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Employee Count
                        </Label>
                        <p className="font-medium mt-1">
                          {company.employeeCount
                            ? formatEmployeeCount(company.employeeCount) ||
                              `${company.employeeCount} employees`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Location
                        </Label>
                        <p className="font-medium mt-1">
                          {company.location || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Company Email
                        </Label>
                        <p className="font-medium mt-1">
                          {company.companyEmail || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Hotline Number
                        </Label>
                        <p className="font-medium mt-1">
                          {company.hotlineNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Website
                      </Label>
                      <p className="font-medium mt-1">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {company.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Social Media Links
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Facebook className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="font-medium break-all">
                        {company.facebookUrl ? (
                          <a
                            href={company.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {company.facebookUrl}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-4 w-4 text-blue-700 shrink-0" />
                      <span className="font-medium break-all">
                        {company.linkedinUrl ? (
                          <a
                            href={company.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {company.linkedinUrl}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-pink-600 shrink-0" />
                      <span className="font-medium break-all">
                        {company.instagramUrl ? (
                          <a
                            href={company.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {company.instagramUrl}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* HR/Contact Person */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    HR / Contact Person
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Contact Person
                        </Label>
                        <p className="font-medium mt-1">
                          {company.contactPersonName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Designation
                        </Label>
                        <p className="font-medium mt-1">
                          {company.designation || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        CV Delivery Email
                      </Label>
                      <p className="font-medium mt-1">
                        {company.cvDeliveryEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Logo */}
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  {/* <Avatar className="w-32 h-32 ring-4 ring-primary/10">
                    {company.logoUrl ? (
                      <AvatarImage
                        src={company.logoUrl}
                        alt={company.companyName}
                      />
                    ) : null}
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {company.companyName?.charAt(0).toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar> */}
                  <OptimizedAvatar
                    src={company.logoUrl}
                    alt={company.companyName || "Company"}
                    height={128}
                    width={128}
                    fallback={
                      company.companyName ? company.companyName.charAt(0) : "C"
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Company Logo
                  </p>
                </CardContent>
              </Card>

              {/* Terms & Agreements */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Terms & Agreements
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">Job Posting Terms</span>
                      </div>
                      <Badge
                        variant={
                          company.jobPostingTerms ? "default" : "destructive"
                        }
                      >
                        {company.jobPostingTerms ? "Accepted" : "Not Accepted"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">CV Delivery Terms</span>
                      </div>
                      <Badge
                        variant={
                          company.cvDeliveryTerms ? "default" : "destructive"
                        }
                      >
                        {company.cvDeliveryTerms ? "Accepted" : "Not Accepted"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardContent className="px-6">
                  <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p className="font-medium">
                          {formatDate(company.createdAt)}
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
                          {formatDate(company.updatedAt)}
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
                      <Briefcase className="h-4 w-4 mr-2" />
                      View Jobs
                    </Button> */}
                    <Button
                      variant="outline"
                      className="w-full justify-start cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
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
              Are you sure you want to change this company&apos;s status to{" "}
              <span className="font-semibold">{newStatus?.toLowerCase()}</span>?
              {newStatus === "APPROVED" &&
                " This will allow the company to post jobs and access all features."}
              {newStatus === "REJECTED" &&
                " This will reject the company's application and they will not be able to access the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isUpdating}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                newStatus === "APPROVED"
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
