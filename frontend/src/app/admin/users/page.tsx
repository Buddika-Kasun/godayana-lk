// src/app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  UserX,
  Building2,
  Mail,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Flag,
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

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  industry: string;
  activeJobs: number;
  joinedDate: string;
  status: "active" | "suspended" | "pending";
  logo?: string;
}

interface JobSeeker {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedJobs: number;
  savedJobs: number;
  joinedDate: string;
  status: "active" | "suspended";
  avatar?: string;
}

interface AbuseReport {
  id: number;
  reporterName: string;
  reportedEntity: string;
  entityType: "job" | "company" | "user";
  reason: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
}

// Mock data - replace with API call
const mockCompanies: Company[] = [
  {
    id: 1,
    name: "Tech Corp Ltd",
    email: "hr@techcorp.com",
    phone: "+94 77 123 4567",
    industry: "IT & Software",
    activeJobs: 8,
    joinedDate: "2026-01-05",
    status: "active",
  },
  {
    id: 2,
    name: "Build Masters",
    email: "info@buildmasters.com",
    phone: "+94 77 234 5678",
    industry: "Construction",
    activeJobs: 5,
    joinedDate: "2026-01-10",
    status: "active",
  },
  {
    id: 3,
    name: "Creative Agency",
    email: "contact@creativeagency.com",
    phone: "+94 77 345 6789",
    industry: "Marketing",
    activeJobs: 0,
    joinedDate: "2026-02-01",
    status: "active",
  },
  {
    id: 4,
    name: "Finance Hub",
    email: "info@financehub.com",
    phone: "+94 77 456 7890",
    industry: "Finance",
    activeJobs: 3,
    joinedDate: "2026-01-15",
    status: "suspended",
  },
  {
    id: 5,
    name: "Digital Solutions",
    email: "hello@digitalsolutions.com",
    phone: "+94 77 567 8901",
    industry: "IT & Software",
    activeJobs: 2,
    joinedDate: "2026-02-10",
    status: "active",
  },
  {
    id: 6,
    name: "Global Traders",
    email: "info@globaltraders.com",
    phone: "+94 77 678 9012",
    industry: "Trading",
    activeJobs: 1,
    joinedDate: "2026-01-20",
    status: "active",
  },
  {
    id: 7,
    name: "Marketing Pro",
    email: "contact@marketingpro.com",
    phone: "+94 77 789 0123",
    industry: "Marketing",
    activeJobs: 4,
    joinedDate: "2026-02-15",
    status: "active",
  },
  {
    id: 8,
    name: "Tech Innovations",
    email: "hr@techinnovations.com",
    phone: "+94 77 890 1234",
    industry: "IT & Software",
    activeJobs: 6,
    joinedDate: "2026-01-25",
    status: "suspended",
  },
];

const mockJobSeekers: JobSeeker[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+94 77 123 4567",
    appliedJobs: 12,
    savedJobs: 8,
    joinedDate: "2026-01-20",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+94 77 234 5678",
    appliedJobs: 5,
    savedJobs: 3,
    joinedDate: "2026-02-10",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "+94 77 345 6789",
    appliedJobs: 8,
    savedJobs: 12,
    joinedDate: "2026-01-25",
    status: "suspended",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+94 77 456 7890",
    appliedJobs: 15,
    savedJobs: 6,
    joinedDate: "2026-02-05",
    status: "active",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    phone: "+94 77 567 8901",
    appliedJobs: 3,
    savedJobs: 2,
    joinedDate: "2026-02-20",
    status: "active",
  },
];

const mockAbuseReports: AbuseReport[] = [
  {
    id: 1,
    reporterName: "John Doe",
    reportedEntity: "Tech Corp Ltd",
    entityType: "company",
    reason: "Spam job postings",
    date: "2026-04-20",
    status: "pending",
  },
  {
    id: 2,
    reporterName: "Jane Smith",
    reportedEntity: "Senior Software Engineer",
    entityType: "job",
    reason: "Misleading information",
    date: "2026-04-21",
    status: "pending",
  },
  {
    id: 3,
    reporterName: "Mike Wilson",
    reportedEntity: "Creative Agency",
    entityType: "company",
    reason: "Fake job post",
    date: "2026-04-19",
    status: "resolved",
  },
  {
    id: 4,
    reporterName: "Sarah Johnson",
    reportedEntity: "Construction Worker",
    entityType: "job",
    reason: "Offensive content",
    date: "2026-04-18",
    status: "pending",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "seekers" | "companies" | "reports"
  >("companies");
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [seekers, setSeekers] = useState<JobSeeker[]>(mockJobSeekers);
  const [reports, setReports] = useState<AbuseReport[]>(mockAbuseReports);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );
  const itemsPerPage = 10;

  const getCurrentData = () => {
    if (activeTab === "seekers") return seekers;
    if (activeTab === "companies") return companies;
    return reports;
  };

  const currentData = getCurrentData();
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);

  // Get counts
  const seekersCount = seekers.length;
  const companiesCount = companies.length;
  const pendingReportsCount = reports.filter(
    (r) => r.status === "pending",
  ).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: "seekers" | "companies" | "reports") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSuspend = () => {
    if (selectedItemId) {
      if (activeTab === "companies") {
        setCompanies(
          companies.map((c) =>
            c.id === selectedItemId ? { ...c, status: "suspended" } : c,
          ),
        );
        toast.success("Company suspended");
      } else if (activeTab === "seekers") {
        setSeekers(
          seekers.map((s) =>
            s.id === selectedItemId ? { ...s, status: "suspended" } : s,
          ),
        );
        toast.success("User suspended");
      }
      setSelectedItemId(null);
      setActionType(null);
    }
  };

  const handleActivate = () => {
    if (selectedItemId) {
      if (activeTab === "companies") {
        setCompanies(
          companies.map((c) =>
            c.id === selectedItemId ? { ...c, status: "active" } : c,
          ),
        );
        toast.success("Company activated");
      } else if (activeTab === "seekers") {
        setSeekers(
          seekers.map((s) =>
            s.id === selectedItemId ? { ...s, status: "active" } : s,
          ),
        );
        toast.success("User activated");
      }
      setSelectedItemId(null);
      setActionType(null);
    }
  };

  const handleResolveReport = (reportId: number) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: "resolved" } : r,
      ),
    );
    toast.success("Report resolved");
  };

  const handleDismissReport = (reportId: number) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: "dismissed" } : r,
      ),
    );
    toast.success("Report dismissed");
  };

  const renderCompaniesList = () => (
    <div className="space-y-4">
      {currentItems.map((company) => {
        const companyData = company as Company;
        return (
          <div
            key={companyData.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Building2 className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {companyData.name}
                      </h3>
                      {companyData.status === "suspended" && (
                        <Badge variant="destructive" className="text-xs">
                          Suspended
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {companyData.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {companyData.activeJobs} active
                        jobs
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Joined{" "}
                        {formatDate(companyData.joinedDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/users/company/${companyData.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                {companyData.status === "active" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1 cursor-pointer"
                    onClick={() => {
                      setSelectedItemId(companyData.id);
                      setActionType("suspend");
                    }}
                  >
                    <UserX size={14} />
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                    onClick={() => {
                      setSelectedItemId(companyData.id);
                      setActionType("activate");
                    }}
                  >
                    <CheckCircle size={14} />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderJobSeekersList = () => (
    <div className="space-y-4">
      {currentItems.map((seeker) => {
        const seekerData = seeker as JobSeeker;
        return (
          <div
            key={seekerData.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={seekerData.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {seekerData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {seekerData.name}
                      </h3>
                      {seekerData.status === "suspended" && (
                        <Badge variant="destructive" className="text-xs">
                          Suspended
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {seekerData.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {seekerData.appliedJobs} applied
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Joined{" "}
                        {formatDate(seekerData.joinedDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/users/seeker/${seekerData.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                {seekerData.status === "active" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1 cursor-pointer"
                    onClick={() => {
                      setSelectedItemId(seekerData.id);
                      setActionType("suspend");
                    }}
                  >
                    <UserX size={14} />
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                    onClick={() => {
                      setSelectedItemId(seekerData.id);
                      setActionType("activate");
                    }}
                  >
                    <CheckCircle size={14} />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAbuseReportsList = () => (
    <div className="space-y-4">
      {currentItems.map((report) => {
        const reportData = report as AbuseReport;
        return (
          <div
            key={reportData.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Flag className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {reportData.reportedEntity}
                      </h3>
                      {reportData.status === "pending" && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Pending
                        </Badge>
                      )}
                      {reportData.status === "resolved" && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Resolved
                        </Badge>
                      )}
                      {reportData.status === "dismissed" && (
                        <Badge variant="outline">Dismissed</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> Reporter: {reportData.reporterName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {reportData.entityType}
                        </Badge>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(reportData.date)}
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {reportData.reason}
                    </p>
                  </div>
                </div>
              </div>
              {reportData.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                    onClick={() => handleResolveReport(reportData.id)}
                  >
                    <CheckCircle size={14} />
                    Resolve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer"
                    onClick={() => handleDismissReport(reportData.id)}
                  >
                    <XCircle size={14} />
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Manage user accounts and company profiles
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveTab("companies");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "companies"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Companies{" "}
                <span className="hidden md:inline-block">
                  ({companiesCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("seekers");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "seekers"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Seekers{" "}
                <span className="hidden md:inline-block">({seekersCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("reports");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  activeTab === "reports"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Flag size={14} /> */}
                Abuse Reports{" "}
                <span className="hidden md:inline-block">
                  ({pendingReportsCount})
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "companies" && renderCompaniesList()}
            {activeTab === "seekers" && renderJobSeekersList()}
            {activeTab === "reports" && renderAbuseReportsList()}

            {/* Empty State */}
            {currentItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeTab === "companies"
                    ? "No companies found"
                    : activeTab === "seekers"
                      ? "No job seekers found"
                      : "No abuse reports found"}
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
                {totalItems} items
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} items
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspend/Activate Confirmation Dialog */}
      <AlertDialog
        open={actionType === "suspend" || actionType === "activate"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "suspend"
                ? "Suspend Account"
                : "Activate Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "suspend"
                ? "Are you sure you want to suspend this account? The user will not be able to access their account until reactivated."
                : "Are you sure you want to activate this account? The user will regain full access to their account."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={
                actionType === "suspend" ? handleSuspend : handleActivate
              }
              className={
                actionType === "suspend"
                  ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }
            >
              {actionType === "suspend" ? "Suspend" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
