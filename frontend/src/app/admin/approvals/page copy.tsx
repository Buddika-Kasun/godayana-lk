// src/app/admin/approvals/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Briefcase,
  MapPin,
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

interface CompanyRegistration {
  id: number;
  companyName: string;
  industry: string;
  email: string;
  contactPerson: string;
  phone: string;
  location: string;
  registeredDate: string;
  status: "pending" | "approved" | "rejected";
  description?: string;
  website?: string;
}

// Mock data - replace with API call
const allCompanies: CompanyRegistration[] = [
  {
    id: 1,
    companyName: "Tech Innovations Ltd",
    industry: "IT & Software",
    email: "info@techinnovations.com",
    contactPerson: "Sarah Johnson",
    phone: "+94 77 123 4567",
    location: "Colombo",
    registeredDate: "2024-04-22",
    status: "pending",
  },
  {
    id: 2,
    companyName: "Global Construction Co",
    industry: "Construction",
    email: "hr@globalconstruction.com",
    contactPerson: "Mike Wilson",
    phone: "+94 77 234 5678",
    location: "Kandy",
    registeredDate: "2024-04-23",
    status: "pending",
  },
  {
    id: 3,
    companyName: "Creative Solutions",
    industry: "Marketing",
    email: "hello@creativesolutions.com",
    contactPerson: "Emma Davis",
    phone: "+94 77 345 6789",
    location: "Colombo",
    registeredDate: "2024-04-20",
    status: "approved",
  },
  {
    id: 4,
    companyName: "Finance Hub Ltd",
    industry: "Finance",
    email: "contact@financehub.com",
    contactPerson: "John Smith",
    phone: "+94 77 456 7890",
    location: "Galle",
    registeredDate: "2024-04-18",
    status: "rejected",
  },
  {
    id: 5,
    companyName: "Digital Agency",
    industry: "Digital Marketing",
    email: "info@digitalagency.com",
    contactPerson: "Lisa Brown",
    phone: "+94 77 567 8901",
    location: "Colombo",
    registeredDate: "2024-04-21",
    status: "pending",
  },
];

const getStatusConfig = (status: CompanyRegistration["status"]) => {
  const config = {
    pending: {
      label: "Pending",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    approved: {
      label: "Approved",
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Registered 1 day ago";
  if (diffDays <= 7) return `Registered ${diffDays} days ago`;
  if (diffDays <= 30) return `Registered ${Math.floor(diffDays / 7)} weeks ago`;
  return `Registered ${Math.floor(diffDays / 30)} months ago`;
};

export default function AdminApprovals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [companies, setCompanies] =
    useState<CompanyRegistration[]>(allCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const itemsPerPage = 10;

  const getFilteredCompanies = () => {
    return companies.filter((company) => company.status === activeFilter);
  };

  const filteredCompanies = getFilteredCompanies();
  const totalItems = filteredCompanies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Get counts for filters
  const pendingCount = companies.filter((c) => c.status === "pending").length;
  const approvedCount = companies.filter((c) => c.status === "approved").length;
  const rejectedCount = companies.filter((c) => c.status === "rejected").length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApprove = () => {
    if (selectedCompanyId) {
      setCompanies(
        companies.map((company) =>
          company.id === selectedCompanyId
            ? { ...company, status: "approved" }
            : company,
        ),
      );
      toast.success("Company approved successfully");
      setSelectedCompanyId(null);
      setActionType(null);
    }
  };

  const handleReject = () => {
    if (selectedCompanyId) {
      setCompanies(
        companies.map((company) =>
          company.id === selectedCompanyId
            ? { ...company, status: "rejected" }
            : company,
        ),
      );
      toast.success("Company rejected");
      setSelectedCompanyId(null);
      setActionType(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve company registrations
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveFilter("pending");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">({pendingCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("approved");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "approved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Approved <span className="hidden md:inline-block">({approvedCount})</span>
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
                Rejected <span className="hidden md:inline-block">({rejectedCount})</span>
              </button>
            </div>
          </div>

          {/* Companies List */}
          <div className="flex-1 space-y-4">
            {currentCompanies.map((company) => {
              const statusConfig = getStatusConfig(company.status);
              return (
                <div
                  key={company.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section - Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Building2 className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {company.companyName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {company.industry}
                              </p>
                            </div>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Contact Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail
                                size={14}
                                className="text-muted-foreground shrink-0"
                              />
                              <span className="text-muted-foreground truncate">
                                {company.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User
                                size={14}
                                className="text-muted-foreground shrink-0"
                              />
                              <span className="text-muted-foreground">
                                Contact: {company.contactPerson}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone
                                size={14}
                                className="text-muted-foreground shrink-0"
                              />
                              <span className="text-muted-foreground">
                                {company.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar
                                size={14}
                                className="text-muted-foreground shrink-0"
                              />
                              <span className="text-muted-foreground">
                                {formatDate(company.registeredDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/approvals/${company.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Details
                        </Button>
                      </Link>
                      {company.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                            onClick={() => {
                              setSelectedCompanyId(company.id);
                              setActionType("approve");
                            }}
                          >
                            <CheckCircle size={14} />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() => {
                              setSelectedCompanyId(company.id);
                              setActionType("reject");
                            }}
                          >
                            <XCircle size={14} />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentCompanies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "pending"
                    ? "No pending company registrations"
                    : activeFilter === "approved"
                      ? "No approved companies"
                      : "No rejected companies"}
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
                {totalItems} companies
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} companies
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog
        open={actionType === "approve"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this company? They will be able
              to post jobs and access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={actionType === "reject"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this company registration? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
