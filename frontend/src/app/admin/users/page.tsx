// src/app/admin/users/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
  CheckCircle,
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Users as UsersIcon,
  Phone,
  Download,
  FileSpreadsheet,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import {
  AdminCompanyParams,
  adminCompanyProfileAPI,
  AdminCompanyProfileData,
  CompanyApprovedCountsResponse,
} from "@/lib/api/endpoints/admin/adminCompanyProfileEndpoint";
import {
  AdminSeekerParams,
  adminSeekerProfileAPI,
  AdminSeekerProfileData,
  SeekerApprovedCountsResponse,
} from "@/lib/api/endpoints/admin/adminSeekerProfileEndpoint";
import { STATUS_DISPLAY } from "@/types/statusDisplay";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Filter state interface
interface FilterState {
  status: string;
  industry: string;
  dateRange: string;
  activeJobs: string;
  location: string;
  gender: string;
  educationLevel: string;
  experience: string;
}

const industriesOptions: Record<string, string> = {
  all: "All",
  it: "IT & Software",
  construction: "Construction",
  marketing: "Marketing",
  finance: "Finance",
  trading: "Trading",
  healthcare: "Healthcare",
  education: "Education",
};

const dateRangeOptions: Record<string, string> = {
  all: "All",
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 90 days",
};

const locationOptions: Record<string, string> = {
  all: "All",
  colombo: "Colombo",
  kandy: "Kandy",
  galle: "Galle",
  negombo: "Negombo",
  jaffna: "Jaffna",
  other: "Other",
};

const genderOptions: Record<string, string> = {
  all: "All",
  male: "Male",
  female: "Female",
  // other: "Other",
  // preferNotToSay: "Prefer not to say",
};

const educationLevelOptions: Record<string, string> = {
  all: "All",
  highSchool: "High School",
  diploma: "Diploma",
  bachelors: "Bachelor's",
  masters: "Master's",
  phd: "PhD",
  other: "Other",
};

const experienceOptions: Record<string, string> = {
  all: "All",
  "0-1": "0-1 years",
  "2-3": "2-3 years",
  "4-5": "4-5 years",
  "6-8": "6-8 years",
  "8-": "8+ years",
};

export default function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userTypeFilter, setUserTypeFilter] = useState<"companies" | "seekers">(
    "companies",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [companies, setCompanies] = useState<AdminCompanyProfileData[]>([]);
  const [seekers, setSeekers] = useState<AdminSeekerProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [companyCounts, setCompanyCounts] =
    useState<CompanyApprovedCountsResponse>({
      all: 0,
      active: 0,
      suspended: 0,
    });
  const [seekerCounts, setSeekerCounts] =
    useState<SeekerApprovedCountsResponse>({
      all: 0,
      active: 0,
      suspended: 0,
    });
  const itemsPerPage = 10;

  // Export Dialog state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportOption, setExportOption] = useState<"current" | "all">(
    "current",
  );
  const [isExporting, setIsExporting] = useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    industry: "all",
    dateRange: "all",
    activeJobs: "all",
    location: "all",
    gender: "all",
    educationLevel: "all",
    experience: "all",
  });
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filters, statusFilter, userTypeFilter]);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    try {
      const [companyCountRes, seekerCountRes] = await Promise.all([
        adminCompanyProfileAPI.getAdminCompanyApprovedCounts(),
        adminSeekerProfileAPI.getAdminSeekerApprovedCounts(),
      ]);

      if (companyCountRes.data.success && companyCountRes.data.data) {
        setCompanyCounts(companyCountRes.data.data);
      }
      if (seekerCountRes.data.success && seekerCountRes.data.data) {
        setSeekerCounts(seekerCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  // Build filter params
  const buildFilterParams = useCallback(() => {
    // const statusMap: Record<string, string> = {
    //   active: "ACTIVE",
    //   suspended: "SUSPENDED",
    // };

    const statusMap: Record<string, string> = {
      active: "true",
      suspended: "false",
    };

    const baseParams = {
      page: currentPage - 1,
      size: itemsPerPage,
      search: debouncedSearchQuery || undefined,
      status: "APPROVED",
    };

    // const status = statusFilter !== "all" ? statusMap[statusFilter] : undefined;
    const activation = statusFilter !== "all" ? statusMap[statusFilter] : null;

    // Company filters
    if (userTypeFilter === "companies") {
      const params: AdminCompanyParams = {
        ...baseParams,
        // status,
      };

      if (activation != null) {
        params.isVerified = activation;
      }

      if (filters.industry && filters.industry !== "all") {
        params.industry = filters.industry;
      }
      if (filters.activeJobs && filters.activeJobs !== "all") {
        params.activeJobs = filters.activeJobs;
      }
      if (filters.dateRange && filters.dateRange !== "all") {
        params.dateRange = filters.dateRange;
      }

      return params;
    }

    // Seeker filters
    const params: AdminSeekerParams = {
      ...baseParams,
      // status,
    };

    if (activation) {
      params.isActive = activation;
    }

    if (filters.location && filters.location !== "all") {
      params.location = filters.location;
    }
    if (filters.gender && filters.gender !== "all") {
      params.gender = filters.gender;
    }
    if (filters.educationLevel && filters.educationLevel !== "all") {
      params.educationLevel = filters.educationLevel;
    }
    if (filters.experience && filters.experience !== "all") {
      params.experience = filters.experience;
    }
    if (filters.dateRange && filters.dateRange !== "all") {
      params.dateRange = filters.dateRange;
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    statusFilter,
    userTypeFilter,
    filters,
  ]);

  // Fetch users based on type and filter
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // const statusMap: Record<string, string> = {
      //   active: "ACTIVE",
      //   suspended: "SUSPENDED",
      // };

      // const params = {
      //   page: currentPage - 1,
      //   size: itemsPerPage,
      //   status: statusFilter !== "all" ? statusMap[statusFilter] : "APPROVED",
      // };
      const params = buildFilterParams();

      if (userTypeFilter === "companies") {
        const response = await adminCompanyProfileAPI.getAdminCompanies(params);
        if (response.data.success && response.data.data) {
          setCompanies(response.data.data.content || []);
          setTotalItems(response.data.data.totalElements || 0);
          setTotalPages(response.data.data.totalPages || 0);
        } else {
          toast.error(response.data.message || "Failed to load companies");
        }
      } else {
        const response = await adminSeekerProfileAPI.getAdminSeekers(params);
        if (response.data.success && response.data.data) {
          setSeekers(response.data.data.content || []);
          setTotalItems(response.data.data.totalElements || 0);
          setTotalPages(response.data.data.totalPages || 0);
        } else {
          toast.error(response.data.message || "Failed to load seekers");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load users";
      console.error("Error fetching users:", errorMessage);
      toast.error(errorMessage || "Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // }, [userTypeFilter, statusFilter, currentPage, itemsPerPage, searchQuery]);
  }, [buildFilterParams, userTypeFilter]);

  // Initial load and refetch
  useEffect(() => {
    fetchCounts();
    fetchUsers();
  }, [fetchCounts, fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    type: "companies" | "seekers",
    status: "all" | "active" | "suspended",
  ) => {
    setUserTypeFilter(type);
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleClearFilters = () => {
    const resetFilters = {
      status: "all",
      industry: "all",
      dateRange: "all",
      activeJobs: "all",
      location: "all",
      gender: "all",
      educationLevel: "all",
      experience: "all",
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setSearchQuery("");
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  const handleSuspend = async () => {
    if (!selectedUserId) return;

    try {
      let response;
      if (userTypeFilter === "companies") {
        response = await adminCompanyProfileAPI.suspendCompany(selectedUserId);
      } else {
        response = await adminSeekerProfileAPI.suspendSeeker(selectedUserId);
      }

      if (response.data.success) {
        toast.success(
          `${userTypeFilter === "companies" ? "Company" : "User"} suspended successfully`,
        );
        setSelectedUserId(null);
        setActionType(null);
        fetchCounts();
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to suspend");
      }
    } catch (error) {
      console.error("Error suspending:", error);
      toast.error("Failed to suspend");
    }
  };

  const handleActivate = async () => {
    if (!selectedUserId) return;

    try {
      let response;
      if (userTypeFilter === "companies") {
        response = await adminCompanyProfileAPI.activeCompany(selectedUserId);
      } else {
        response = await adminSeekerProfileAPI.activeSeeker(selectedUserId);
      }

      if (response.data.success) {
        toast.success(
          `${userTypeFilter === "companies" ? "Company" : "User"} activated successfully`,
        );
        setSelectedUserId(null);
        setActionType(null);
        fetchCounts();
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to activate");
      }
    } catch (error) {
      console.error("Error activating:", error);
      toast.error("Failed to activate");
    }
  };

  // Export function
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all data for export if "all" is selected
      let exportData: (AdminCompanyProfileData | AdminSeekerProfileData)[] = [];

      if (exportOption === "current") {
        // Use current page data
        exportData = userTypeFilter === "companies" ? companies : seekers;
      } else {
        // Fetch all data
        const statusMap: Record<string, string> = {
          active: "APPROVED",
          suspended: "SUSPENDED",
        };
        const params = {
          page: 0,
          size: 1000, // Fetch all
          status: statusFilter !== "all" ? statusMap[statusFilter] : undefined,
        };

        if (userTypeFilter === "companies") {
          const response =
            await adminCompanyProfileAPI.getAdminCompanies(params);
          if (response.data.success && response.data.data) {
            exportData = response.data.data.content || [];
          }
        } else {
          const response = await adminSeekerProfileAPI.getAdminSeekers(params);
          if (response.data.success && response.data.data) {
            exportData = response.data.data.content || [];
          }
        }
      }

      if (exportData.length === 0) {
        toast.error("No data to export");
        setIsExporting(false);
        return;
      }

      // Prepare CSV data
      let csvData: any[] = [];
      if (userTypeFilter === "companies") {
        csvData = exportData.map((item) => {
          const company = item as AdminCompanyProfileData;
          return {
            "Company Name": company.companyName || "N/A",
            Email: company.companyEmail || "N/A",
            Phone: company.hotlineNumber || "N/A",
            Industry: company.industry || "N/A",
            Status: company.status || "N/A",
            "Joined Date": formatDate(company.createdAt),
          };
        });
      } else {
        csvData = exportData.map((item) => {
          const seeker = item as AdminSeekerProfileData;
          return {
            Name: seeker.name || "N/A",
            "Contact No": seeker.contactNo || "N/A",
            "Applied Jobs": seeker.appliedCount || 0,
            "Enrolled Courses": seeker.enrolledCount || 0,
            Status: seeker.status || "N/A",
            "Joined Date": formatDate(seeker.createdAt),
          };
        });
      }

      // Convert to CSV
      const headers = Object.keys(csvData[0]);
      const csvRows = [
        headers.join(","),
        ...csvData.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            })
            .join(","),
        ),
      ];
      const csvString = csvRows.join("\n");

      // Download CSV
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userTypeFilter}_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${csvData.length} ${userTypeFilter}`);
      setIsExportOpen(false);
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const getCurrentItems = () => {
    return userTypeFilter === "companies" ? companies : seekers;
  };

  const currentItems = getCurrentItems();

  const getStatusCount = (status: string) => {
    if (userTypeFilter === "companies") {
      switch (status) {
        case "active":
          return companyCounts.active;
        case "suspended":
          return companyCounts.suspended;
        default:
          return companyCounts.all;
      }
    } else {
      switch (status) {
        case "active":
          return seekerCounts.active;
        case "suspended":
          return seekerCounts.suspended;
        default:
          return seekerCounts.all;
      }
    }
  };

  const isFilterActive = () => {
    return (
      filters.industry !== "all" ||
      filters.dateRange !== "all" ||
      filters.activeJobs !== "all" ||
      filters.location !== "all" ||
      filters.gender !== "all" ||
      filters.educationLevel !== "all" ||
      filters.experience !== "all"
    );
  };

  const renderCompaniesList = () => (
    <div className="space-y-4">
      {companies.map((company) => {
        const statusDisplay =
          STATUS_DISPLAY[company.activation == true ? "ACTIVE" : "SUSPENDED"] ||
          STATUS_DISPLAY.PENDING;
        return (
          <div
            key={company.userId}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <OptimizedAvatar
                    src={company.logoUrl}
                    alt={company.companyName || "Company"}
                    height={60}
                    width={60}
                    fallback={
                      company.companyName ? company.companyName.charAt(0) : "C"
                    }
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {company.companyName || "Unnamed Company"}
                      </h3>
                      <Badge className={statusDisplay.color}>
                        {statusDisplay.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {company.companyEmail || "N/A"}
                      </span>
                      {/* <span className="flex items-center gap-1">
                        <Phone size={14} /> {company.hotlineNumber || "N/A"}
                      </span> */}
                      {/* <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {company.industry || "N/A"}
                      </span> */}
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {company.jobCount || 0} jobs
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap size={14} /> {company.courseCount || 0}{" "}
                        courses
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Joined{" "}
                        {formatDate(company.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/users/company/${company.userId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer w-full"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                {company.activation == true ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1 cursor-pointer w-full"
                    onClick={() => {
                      setSelectedUserId(company.userId || null);
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
                      setSelectedUserId(company.userId || null);
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

  const renderSeekersList = () => (
    <div className="space-y-4">
      {seekers.map((seeker) => {
        const statusDisplay =
          STATUS_DISPLAY[seeker.activation ? "ACTIVE" : "SUSPENDED"] || STATUS_DISPLAY.ACTIVE;
        return (
          <div
            key={seeker.userId}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <OptimizedAvatar
                    src={seeker.profileImageUrl}
                    alt={seeker.name || "Seeker"}
                    height={60}
                    width={60}
                    fallback={seeker.name ? seeker.name.charAt(0) : "S"}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {seeker.name || "Unnamed User"}
                      </h3>
                      <Badge className={statusDisplay.color}>
                        {statusDisplay.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {seeker.contactNo || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {seeker.appliedCount || 0}{" "}
                        applied
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap size={14} /> {seeker.enrolledCount || 0}{" "}
                        enrolled
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Joined{" "}
                        {formatDate(seeker.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/users/seeker/${seeker.userId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer w-full"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                {seeker.activation == true ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1 cursor-pointer w-full"
                    onClick={() => {
                      setSelectedUserId(seeker.userId || null);
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
                      setSelectedUserId(seeker.userId || null);
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

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex flex-col flex-1">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Manage user accounts and company profiles
            </p>
          </div>

          <div className="flex flex-col md:flex-row border-b pb-2 mb-2 gap-2">
            <div className="flex-1">
              {/* User Type Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
                <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
                  <button
                    onClick={() => handleFilterChange("companies", "all")}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                      userTypeFilter === "companies"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Companies{" "}
                    <span className="hidden md:inline-block">
                      ({companyCounts.all})
                    </span>
                  </button>
                  <button
                    onClick={() => handleFilterChange("seekers", "all")}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                      userTypeFilter === "seekers"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Seekers{" "}
                    <span className="hidden md:inline-block">
                      ({seekerCounts.all})
                    </span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
                <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                      statusFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    }`}
                  >
                    All{" "}
                    <span className="hidden md:inline-block">
                      ({getStatusCount("all")})
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                      statusFilter === "active"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Active{" "}
                    <span className="hidden md:inline-block">
                      ({getStatusCount("active")})
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("suspended")}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                      statusFilter === "suspended"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Suspended{" "}
                    <span className="hidden md:inline-block">
                      ({getStatusCount("suspended")})
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-end justify-center gap-4 pb-2">
              <div className="gap-2 flex w-full justify-end">
                {/* Export Button */}
                <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 cursor-pointer flex-1 md:flex-0"
                    >
                      <Download size={16} />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Export Data</DialogTitle>
                      <DialogDescription>
                        Choose what data you want to export as CSV.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <RadioGroup
                        value={exportOption}
                        onValueChange={(value) =>
                          setExportOption(value as "current" | "all")
                        }
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="current" id="current" />
                          <Label htmlFor="current" className="cursor-pointer">
                            Current Page ({currentItems.length} items)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all" className="cursor-pointer">
                            All Data (
                            {getStatusCount(
                              statusFilter === "all" ? "all" : statusFilter,
                            )}{" "}
                            items)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsExportOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleExport}
                        className="gap-2"
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet size={16} />
                            Export CSV
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Filter Button */}
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 cursor-pointer relative flex-1 md:flex-0"
                    >
                      <SlidersHorizontal size={18} />
                      Filters
                      {isFilterActive() && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full md:w-100 p-0 max-h-[80vh] overflow-hidden z-0"
                    align="end"
                  >
                    <div className="p-4 border-b sticky top-0 bg-background">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Advanced Filters</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="text-sm text-muted-foreground"
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userTypeFilter === "companies" && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Industry
                              </Label>
                              <Select
                                value={tempFilters.industry}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    industry: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(industriesOptions).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Active Jobs
                              </Label>
                              <Select
                                value={tempFilters.activeJobs}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    activeJobs: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="0">0 jobs</SelectItem>
                                  <SelectItem value="5">1-5 jobs</SelectItem>
                                  <SelectItem value="6+">6+ jobs</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {userTypeFilter === "seekers" && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Location
                              </Label>
                              <Select
                                value={tempFilters.location}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    location: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(locationOptions).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Gender
                              </Label>
                              <Select
                                value={tempFilters.gender}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    gender: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(genderOptions).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Education Level
                              </Label>
                              <Select
                                value={tempFilters.educationLevel}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    educationLevel: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(educationLevelOptions).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Experience
                              </Label>
                              <Select
                                value={tempFilters.experience}
                                onValueChange={(value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    experience: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(experienceOptions).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Date Range
                          </Label>
                          <Select
                            value={tempFilters.dateRange}
                            onValueChange={(value) =>
                              setTempFilters({
                                ...tempFilters,
                                dateRange: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(dateRangeOptions).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t sticky bottom-0 bg-background flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleApplyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {isFilterActive() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-muted-foreground gap-1"
                  >
                    <X size={14} />
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    placeholder={
                      userTypeFilter === "companies"
                        ? "Search by name, email, or industry..."
                        : "Search by name or contact no..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 py-4"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {totalItems}{" "}
            {userTypeFilter === "companies" ? "companies" : "job seekers"}
            {searchQuery && ` matching "${searchQuery}"`}
            {isFilterActive() && " with filters applied"}
          </div>

          {/* Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message={`Loading ${userTypeFilter === "companies" ? "companies" : "seekers"}...`}
                  fullScreen={false}
                />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery || isFilterActive()
                    ? "No results found matching your search or filters"
                    : userTypeFilter === "companies"
                      ? "No companies found"
                      : "No job seekers found"}
                </p>
              </div>
            ) : userTypeFilter === "companies" ? (
              renderCompaniesList()
            ) : (
              renderSeekersList()
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
                {currentItems.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
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
