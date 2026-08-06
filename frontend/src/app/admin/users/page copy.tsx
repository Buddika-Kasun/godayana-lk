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
  CheckCircle,
  XCircle,
  Users,
  Flag,
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Users as UsersIcon,
  Phone,
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
  location: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  educationLevel:
    | "High School"
    | "Bachelor's"
    | "Master's"
    | "PhD"
    | "Diploma"
    | "Other";
  experience: string;
  skills: string[];
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

// Filter state interface
interface FilterState {
  status: string;
  industry: string;
  dateRange: string;
  activeJobs: string;
  entityType: string;
  reportStatus: string;
  // Seeker specific filters
  location: string;
  gender: string;
  educationLevel: string;
  experience: string;
}

// Type guard functions
const isCompany = (item: Company | JobSeeker | AbuseReport ): item is Company => {
  return item && "industry" in item && "activeJobs" in item;
};

const isJobSeeker = (
  item: Company | JobSeeker | AbuseReport,
): item is JobSeeker => {
  return (
    item && "location" in item && "gender" in item && "educationLevel" in item
  );
};

const isAbuseReport = (
  item: Company | JobSeeker | AbuseReport,
): item is AbuseReport => {
  return (
    item &&
    "reporterName" in item &&
    "reportedEntity" in item &&
    "entityType" in item
  );
};

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
    status: "pending",
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
    location: "Colombo, Sri Lanka",
    gender: "Male",
    educationLevel: "Bachelor's",
    experience: "5 years",
    skills: ["JavaScript", "React", "Node.js"],
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
    location: "Kandy, Sri Lanka",
    gender: "Female",
    educationLevel: "Master's",
    experience: "3 years",
    skills: ["Python", "Django", "AWS"],
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
    location: "Galle, Sri Lanka",
    gender: "Male",
    educationLevel: "PhD",
    experience: "8 years",
    skills: ["Java", "Spring", "Microservices"],
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
    location: "Colombo, Sri Lanka",
    gender: "Female",
    educationLevel: "Bachelor's",
    experience: "2 years",
    skills: ["UI/UX", "Figma", "Adobe XD"],
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
    location: "Negombo, Sri Lanka",
    gender: "Male",
    educationLevel: "Diploma",
    experience: "4 years",
    skills: ["PHP", "Laravel", "MySQL"],
    appliedJobs: 3,
    savedJobs: 2,
    joinedDate: "2026-02-20",
    status: "active",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+94 77 678 9012",
    location: "Colombo, Sri Lanka",
    gender: "Female",
    educationLevel: "Master's",
    experience: "6 years",
    skills: ["Data Science", "Python", "Machine Learning"],
    appliedJobs: 10,
    savedJobs: 15,
    joinedDate: "2026-01-15",
    status: "active",
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert@example.com",
    phone: "+94 77 789 0123",
    location: "Kandy, Sri Lanka",
    gender: "Male",
    educationLevel: "Bachelor's",
    experience: "1 year",
    skills: ["HTML", "CSS", "JavaScript"],
    appliedJobs: 2,
    savedJobs: 5,
    joinedDate: "2026-02-25",
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

// Options for filters
const industries = [
  "All",
  "IT & Software",
  "Construction",
  "Marketing",
  "Finance",
  "Trading",
  "Healthcare",
  "Education",
];

const statusOptions = ["All", "Active", "Suspended", "Pending"];
const dateRangeOptions = ["All", "Last 7 days", "Last 30 days", "Last 90 days"];
const entityTypeOptions = ["All", "Company", "Job", "User"];

// Seeker specific options
const locationOptions = [
  "All",
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Jaffna",
  "Other",
];
const genderOptions = ["All", "Male", "Female", "Other", "Prefer not to say"];
const educationLevelOptions = [
  "All",
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];
const experienceOptions = [
  "All",
  "0-1 years",
  "2-3 years",
  "4-5 years",
  "6-8 years",
  "8+ years",
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
  const [companies] = useState<Company[]>(mockCompanies);
  const [seekers] = useState<JobSeeker[]>(mockJobSeekers);
  const [reports] = useState<AbuseReport[]>(mockAbuseReports);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "All",
    industry: "All",
    dateRange: "All",
    activeJobs: "All",
    entityType: "All",
    reportStatus: "All",
    location: "All",
    gender: "All",
    educationLevel: "All",
    experience: "All",
  });
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const itemsPerPage = 10;

  // Filter and Search logic with proper type checking
  const getFilteredData = () => {
    let filteredData: (Company | JobSeeker | AbuseReport)[] = [];

    // Get data based on active tab
    if (activeTab === "companies") {
      filteredData = companies;
    } else if (activeTab === "seekers") {
      filteredData = seekers;
    } else {
      filteredData = reports;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredData = filteredData.filter((item) => {
        if (isCompany(item)) {
          return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.industry.toLowerCase().includes(query) ||
            item.phone.toLowerCase().includes(query)
          );
        } else if (isJobSeeker(item)) {
          return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.phone.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.skills.some((skill) => skill.toLowerCase().includes(query)) ||
            item.educationLevel.toLowerCase().includes(query)
          );
        } else if (isAbuseReport(item)) {
          return (
            item.reportedEntity.toLowerCase().includes(query) ||
            item.reporterName.toLowerCase().includes(query) ||
            item.reason.toLowerCase().includes(query)
          );
        }
        return false;
      });
    }

    // Apply filters
    if (activeTab === "companies") {
      filteredData = filteredData.filter((item) => {
        if (!isCompany(item)) return false;
        const company = item;
        let match = true;

        if (filters.status !== "All") {
          match = match && company.status === filters.status.toLowerCase();
        }
        if (filters.industry !== "All") {
          match = match && company.industry === filters.industry;
        }
        if (filters.dateRange !== "All") {
          const days = parseInt(filters.dateRange.split(" ")[1]);
          const joinedDate = new Date(company.joinedDate);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          match = match && diffDays <= days;
        }
        if (filters.activeJobs !== "All") {
          if (filters.activeJobs === "0") {
            match = match && company.activeJobs === 0;
          } else if (filters.activeJobs === "1-5") {
            match = match && company.activeJobs >= 1 && company.activeJobs <= 5;
          } else if (filters.activeJobs === "6+") {
            match = match && company.activeJobs >= 6;
          }
        }
        return match;
      });
    } else if (activeTab === "seekers") {
      filteredData = filteredData.filter((item) => {
        if (!isJobSeeker(item)) return false;
        const seeker = item;
        let match = true;

        if (filters.status !== "All") {
          match = match && seeker.status === filters.status.toLowerCase();
        }
        if (filters.location !== "All") {
          match = match && seeker.location.includes(filters.location);
        }
        if (filters.gender !== "All") {
          match = match && seeker.gender === filters.gender;
        }
        if (filters.educationLevel !== "All") {
          match = match && seeker.educationLevel === filters.educationLevel;
        }
        if (filters.experience !== "All") {
          const expYears = parseInt(seeker.experience);
          if (filters.experience === "0-1 years") {
            match = match && expYears <= 1;
          } else if (filters.experience === "2-3 years") {
            match = match && expYears >= 2 && expYears <= 3;
          } else if (filters.experience === "4-5 years") {
            match = match && expYears >= 4 && expYears <= 5;
          } else if (filters.experience === "6-8 years") {
            match = match && expYears >= 6 && expYears <= 8;
          } else if (filters.experience === "8+ years") {
            match = match && expYears > 8;
          }
        }
        if (filters.dateRange !== "All") {
          const days = parseInt(filters.dateRange.split(" ")[1]);
          const joinedDate = new Date(seeker.joinedDate);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          match = match && diffDays <= days;
        }
        return match;
      });
    } else if (activeTab === "reports") {
      filteredData = filteredData.filter((item) => {
        if (!isAbuseReport(item)) return false;
        const report = item;
        let match = true;

        if (filters.reportStatus !== "All") {
          match = match && report.status === filters.reportStatus.toLowerCase();
        }
        if (filters.entityType !== "All") {
          match =
            match && report.entityType === filters.entityType.toLowerCase();
        }
        if (filters.dateRange !== "All") {
          const days = parseInt(filters.dateRange.split(" ")[1]);
          const reportDate = new Date(report.date);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          match = match && diffDays <= days;
        }
        return match;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

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
    setSearchQuery("");
    setFilters({
      status: "All",
      industry: "All",
      dateRange: "All",
      activeJobs: "All",
      entityType: "All",
      reportStatus: "All",
      location: "All",
      gender: "All",
      educationLevel: "All",
      experience: "All",
    });
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleClearFilters = () => {
    const resetFilters = {
      status: "All",
      industry: "All",
      dateRange: "All",
      activeJobs: "All",
      entityType: "All",
      reportStatus: "All",
      location: "All",
      gender: "All",
      educationLevel: "All",
      experience: "All",
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setSearchQuery("");
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  const handleSuspend = () => {
    if (selectedItemId) {
      toast.success(
        activeTab === "companies" ? "Company suspended" : "User suspended",
      );
      setSelectedItemId(null);
      setActionType(null);
    }
  };

  const handleActivate = () => {
    if (selectedItemId) {
      toast.success(
        activeTab === "companies" ? "Company activated" : "User activated",
      );
      setSelectedItemId(null);
      setActionType(null);
    }
  };

  const handleResolveReport = (reportId: number) => {
    toast.success("Report resolved");
  };

  const handleDismissReport = (reportId: number) => {
    toast.success("Report dismissed");
  };

  const renderCompaniesList = () => (
    <div className="space-y-4">
      {currentItems.filter(isCompany).map((company) => (
        <div
          key={company.id}
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
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    {company.status === "suspended" && (
                      <Badge variant="destructive" className="text-xs">
                        Suspended
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {company.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {company.activeJobs} active jobs
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Joined{" "}
                      {formatDate(company.joinedDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/users/company/${company.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer"
                >
                  <Eye size={14} />
                  View
                </Button>
              </Link>
              {company.status === "active" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 cursor-pointer"
                  onClick={() => {
                    setSelectedItemId(company.id);
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
                    setSelectedItemId(company.id);
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
      ))}
    </div>
  );

  const renderJobSeekersList = () => (
    <div className="space-y-4">
      {currentItems.filter(isJobSeeker).map((seeker) => (
        <div
          key={seeker.id}
          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={seeker.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {seeker.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg">{seeker.name}</h3>
                    {seeker.status === "suspended" && (
                      <Badge variant="destructive" className="text-xs">
                        Suspended
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {seeker.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {seeker.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {seeker.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={14} /> {seeker.educationLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon size={14} /> {seeker.gender}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {seeker.experience} exp
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {seeker.skills.slice(0, 4).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {seeker.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{seeker.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {seeker.appliedJobs} applied
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Joined{" "}
                      {formatDate(seeker.joinedDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/users/seeker/${seeker.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer"
                >
                  <Eye size={14} />
                  View
                </Button>
              </Link>
              {seeker.status === "active" ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 cursor-pointer"
                  onClick={() => {
                    setSelectedItemId(seeker.id);
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
                    setSelectedItemId(seeker.id);
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
      ))}
    </div>
  );

  const renderAbuseReportsList = () => (
    <div className="space-y-4">
      {currentItems.filter(isAbuseReport).map((report) => (
        <div
          key={report.id}
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
                      {report.reportedEntity}
                    </h3>
                    {report.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending
                      </Badge>
                    )}
                    {report.status === "resolved" && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Resolved
                      </Badge>
                    )}
                    {report.status === "dismissed" && (
                      <Badge variant="outline">Dismissed</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> Reporter: {report.reporterName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {report.entityType}
                      </Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(report.date)}
                    </span>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Reason:</span> {report.reason}
                  </p>
                </div>
              </div>
            </div>
            {report.status === "pending" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                  onClick={() => handleResolveReport(report.id)}
                >
                  <CheckCircle size={14} />
                  Resolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer"
                  onClick={() => handleDismissReport(report.id)}
                >
                  <XCircle size={14} />
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const isFilterActive = () => {
    return (
      filters.status !== "All" ||
      filters.industry !== "All" ||
      filters.dateRange !== "All" ||
      filters.activeJobs !== "All" ||
      filters.entityType !== "All" ||
      filters.reportStatus !== "All" ||
      filters.location !== "All" ||
      filters.gender !== "All" ||
      filters.educationLevel !== "All" ||
      filters.experience !== "All"
    );
  };

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

          {/* Tabs and Search/Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => handleTabChange("companies")}
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
                onClick={() => handleTabChange("seekers")}
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
                onClick={() => handleTabChange("reports")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  activeTab === "reports"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Abuse Reports{" "}
                <span className="hidden md:inline-block">
                  ({pendingReportsCount})
                </span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder={
                    activeTab === "companies"
                      ? "Search by name, email, or industry..."
                      : activeTab === "seekers"
                        ? "Search by name, email, location, or skills..."
                        : "Search reports..."
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-gray-50 dark:bg-gray-900"
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

              {/* Filter Button with Popover - 2 Columns on md+ */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer relative"
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
                    {/* 2 Column Grid for Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Filter - Common for all tabs */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Status</Label>
                        <Select
                          value={tempFilters.status}
                          onValueChange={(value) =>
                            setTempFilters({ ...tempFilters, status: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Company specific filters */}
                      {activeTab === "companies" && (
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
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
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
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="0">0 jobs</SelectItem>
                                <SelectItem value="1-5">1-5 jobs</SelectItem>
                                <SelectItem value="6+">6+ jobs</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Seeker specific filters */}
                      {activeTab === "seekers" && (
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
                                {locationOptions.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
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
                                {genderOptions.map((gender) => (
                                  <SelectItem key={gender} value={gender}>
                                    {gender}
                                  </SelectItem>
                                ))}
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
                                {educationLevelOptions.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
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
                                {experienceOptions.map((exp) => (
                                  <SelectItem key={exp} value={exp}>
                                    {exp}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Report specific filters */}
                      {activeTab === "reports" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Entity Type
                            </Label>
                            <Select
                              value={tempFilters.entityType}
                              onValueChange={(value) =>
                                setTempFilters({
                                  ...tempFilters,
                                  entityType: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {entityTypeOptions.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Report Status
                            </Label>
                            <Select
                              value={tempFilters.reportStatus}
                              onValueChange={(value) =>
                                setTempFilters({
                                  ...tempFilters,
                                  reportStatus: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Resolved">
                                  Resolved
                                </SelectItem>
                                <SelectItem value="Dismissed">
                                  Dismissed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Date Range Filter - Common for all */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Date Range
                        </Label>
                        <Select
                          value={tempFilters.dateRange}
                          onValueChange={(value) =>
                            setTempFilters({ ...tempFilters, dateRange: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            {dateRangeOptions.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
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
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Active Filters Summary */}
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
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {totalItems}{" "}
            {activeTab === "companies"
              ? "companies"
              : activeTab === "seekers"
                ? "job seekers"
                : "reports"}
            {searchQuery && ` matching "${searchQuery}"`}
            {isFilterActive() && " with filters applied"}
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
                  {searchQuery || isFilterActive()
                    ? "No results found matching your search or filters"
                    : activeTab === "companies"
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
