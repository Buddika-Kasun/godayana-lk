// src/app/admin/posts/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  Briefcase,
  Flag,
  Clock,
  XCircle,
  GraduationCap,
  DollarSign,
  Users,
  Globe,
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
import { STATUS_DISPLAY } from "@/types/statusDisplay";

interface BasePost {
  id: number;
  title: string;
  company: string;
  companyId: number;
  status: "closed" | "pending" | "approved" | "rejected";
  postedDate: string;
  views: number;
  reportedBy?: number;
  reportReason?: string;
}

interface JobPost extends BasePost {
  type: "job";
  jobType: "local" | "overseas";
  location: string;
  applications: number;
}

interface CoursePost extends BasePost {
  type: "course";
  enrollType: "online" | "physical";
  location?: string;
  price: string;
  enrolledStudents: number;
  maxStudents: number;
}

type Post = JobPost | CoursePost;

// Mock data - replace with API call
const allPosts: Post[] = [
  // Job Posts
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    companyId: 1,
    type: "job",
    jobType: "local",
    location: "Colombo",
    status: "rejected",
    postedDate: "2024-04-21",
    applications: 45,
    views: 320,
  },
  {
    id: 2,
    title: "Construction Worker",
    company: "Build Masters",
    companyId: 2,
    type: "job",
    jobType: "overseas",
    location: "Dubai UAE",
    status: "pending",
    postedDate: "2024-04-22",
    applications: 0,
    views: 0,
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "Creative Agency",
    companyId: 3,
    type: "job",
    jobType: "local",
    location: "Kandy",
    status: "rejected",
    postedDate: "2024-04-19",
    applications: 12,
    views: 89,
    reportedBy: 5,
    reportReason: "Inappropriate content",
  },
  {
    id: 4,
    title: "Digital Marketing Manager",
    company: "Digital Hub",
    companyId: 4,
    type: "job",
    jobType: "local",
    location: "Colombo",
    status: "approved",
    postedDate: "2024-04-15",
    applications: 28,
    views: 210,
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech",
    companyId: 5,
    type: "job",
    jobType: "local",
    location: "Remote",
    status: "pending",
    postedDate: "2024-04-23",
    applications: 0,
    views: 15,
  },
  // Course Posts
  {
    id: 6,
    title: "Advanced Web Development Bootcamp",
    company: "Tech Academy",
    companyId: 6,
    type: "course",
    enrollType: "physical",
    location: "Colombo",
    status: "pending",
    postedDate: "2024-04-20",
    price: "45000",
    enrolledStudents: 45,
    maxStudents: 60,
    views: 320,
  },
  {
    id: 7,
    title: "Digital Marketing Masterclass",
    company: "Marketing Pro",
    companyId: 7,
    type: "course",
    enrollType: "online",
    status: "pending",
    postedDate: "2024-04-22",
    price: "25000",
    enrolledStudents: 0,
    maxStudents: 100,
    views: 0,
  },
  {
    id: 8,
    title: "Data Science Course",
    company: "Data Institute",
    companyId: 8,
    type: "course",
    enrollType: "online",
    status: "approved",
    postedDate: "2024-04-18",
    price: "55000",
    enrolledStudents: 28,
    maxStudents: 50,
    views: 156,
    reportedBy: 3,
    reportReason: "Misleading information",
  },
  {
    id: 9,
    title: "UI/UX Design Course",
    company: "Design Hub",
    companyId: 9,
    type: "course",
    enrollType: "physical",
    location: "Kandy",
    status: "closed",
    postedDate: "2024-04-14",
    price: "35000",
    enrolledStudents: 12,
    maxStudents: 30,
    views: 89,
  },
  {
    id: 10,
    title: "Business English Course",
    company: "Language Center",
    companyId: 10,
    type: "course",
    enrollType: "online",
    status: "pending",
    postedDate: "2024-04-23",
    price: "15000",
    enrolledStudents: 0,
    maxStudents: 200,
    views: 45,
  },
];

const getStatusConfig = (status: Post["status"]) => {
  const config = {
    approved: {
      label: "Approved",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending Review",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: Flag,
    },
    closed: {
      label: "Closed",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: AlertTriangle,
    },
  };
  return config[status];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays <= 7) return `Posted ${diffDays} days ago`;
  if (diffDays <= 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
  return `Posted ${Math.floor(diffDays / 30)} months ago`;
};

const formatPrice = (price: string) => {
  const numPrice = parseInt(price);
  if (numPrice === 0) return "Free";
  return `LKR ${numPrice.toLocaleString()}`;
};

export default function AdminPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [postTypeFilter, setPostTypeFilter] = useState<
    "all" | "jobs" | "courses"
  >("jobs");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "closed"
  >("pending");
  const [posts, setPosts] = useState<Post[]>(allPosts);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "close" | null
  >(null);
  const itemsPerPage = 10;

  const getFilteredPosts = () => {
    let filtered = posts;

    // Filter by post type
    if (postTypeFilter === "jobs") {
      filtered = filtered.filter((post) => post.type === "job");
    } else if (postTypeFilter === "courses") {
      filtered = filtered.filter((post) => post.type === "course");
    }

    // Filter by status
    if (statusFilter === "pending") {
      filtered = filtered.filter((post) => post.status === "pending");
    } else if (statusFilter === "approved") {
      filtered = filtered.filter((post) => post.status === "approved");
    } else if (statusFilter === "rejected") {
      filtered = filtered.filter((post) => post.status === "rejected");
    } else if (statusFilter === "closed") {
      filtered = filtered.filter((post) => post.status === "closed");
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = posts.length;
  const jobsCount = posts.filter((p) => p.type === "job").length;
  const coursesCount = posts.filter((p) => p.type === "course").length;

  const pendingCount = posts.filter((p) => p.status === "pending").length;
  const approvedCount = posts.filter((p) => p.status === "approved").length;
  const rejectedCount = posts.filter((p) => p.status === "rejected").length;
  const closedCount = posts.filter((p) => p.status === "closed").length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApprove = () => {
    if (selectedPostId) {
      setPosts(
        posts.map((post) =>
          post.id === selectedPostId ? { ...post, status: "approved" } : post,
        ),
      );
      toast.success("Post approved and published");
      setSelectedPostId(null);
      setActionType(null);
    }
  };

  const handleReject = () => {
    if (selectedPostId) {
      setPosts(
        posts.map((post) =>
          post.id === selectedPostId ? { ...post, status: "rejected" } : post,
        ),
      );
      toast.success("Post rejected");
      setSelectedPostId(null);
      setActionType(null);
    }
  };

  const getActionButtons = (post: Post) => {
    const buttons = [];

    // View button for all
    // const viewLink =
    //   post.type === "job"
    //     ? `/admin/jobs/${post.id}`
    //     : `/admin/courses/${post.id}`;

    // buttons.push(
    //   <Link key="view" href={viewLink}>
    //     <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
    //       <Eye size={14} />
    //       View
    //     </Button>
    //   </Link>,
    // );

    // Approve button for pending posts
    if (post.status === "pending" || post.status === "rejected") {
      buttons.push(
        <Button
          key="approve"
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer flex-1"
          onClick={() => {
            setSelectedPostId(post.id);
            setActionType("approve");
          }}
        >
          <CheckCircle size={14} />
          Approve
        </Button>,
      );
    }

    // Reject button for all
    if (post.status === "pending" || post.status === "approved") {
      buttons.push(
        <Button
          key="rejected"
          variant="destructive"
          size="sm"
          className="gap-1 cursor-pointer flex-1"
          onClick={() => {
            setSelectedPostId(post.id);
            setActionType("reject");
          }}
        >
          <Trash2 size={14} />
          Reject
        </Button>,
      );
    }

    return buttons;
  };

  const renderPostDetails = (post: Post) => {
    const statusDisplay = STATUS_DISPLAY[post.status.toUpperCase()] || STATUS_DISPLAY.DRAFT;
    if (post.type === "job") {
      return (
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="text-xs gap-1 px-1">
                  <Briefcase size={12} />
                </Badge>
                <h3 className="font-semibold text-lg">{post.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{post.company}</p>
            </div>
            <Badge className={statusDisplay.color}>
              {statusDisplay.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {post.location || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />{" "}
              {post.jobType === "local" ? "Local Job" : "Overseas Job"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDate(post.postedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {post.applications || 0} applications
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.views || 0} views
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="text-xs gap-1 px-1">
                  <GraduationCap size={12} />
                </Badge>
                <h3 className="font-semibold text-lg">{post.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{post.company}</p>
            </div>
            <Badge className={statusDisplay.color}>{statusDisplay.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {post.enrollType === "online" ? (
                <Globe size={14} />
              ) : (
                <MapPin size={14} />
              )}
              {post.enrollType === "online"
                ? "Online Course"
                : post.location || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={14} /> {formatPrice(post.price)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDate(post.postedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {post.enrolledStudents || 0}/
              {post.maxStudents || 0} enrolled
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.views || 0} views
            </span>
          </div>
        </div>
      );
    }
  };

  // Helper function for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Moderate and manage all posts (jobs and courses)
            </p>
          </div>

          {/* Post Type Filter Tabs */}
          <div className="flex gap-4 mb-4">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              {/* <button
                onClick={() => {
                  setPostTypeFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  postTypeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button> */}
              <button
                onClick={() => {
                  setPostTypeFilter("jobs");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  postTypeFilter === "jobs"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Briefcase size={14} /> */}
                Jobs{" "}
                <span className="hidden md:inline-block">({jobsCount})</span>
              </button>
              <button
                onClick={() => {
                  setPostTypeFilter("courses");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  postTypeFilter === "courses"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <GraduationCap size={14} /> */}
                Courses{" "}
                <span className="hidden md:inline-block">({coursesCount})</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
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
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">({pendingCount})</span>
              </button>
              <button
                onClick={() => {
                  setStatusFilter("approved");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "approved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Active{" "}
                <span className="hidden md:inline-block">
                  ({approvedCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setStatusFilter("rejected");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  statusFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({rejectedCount})
                </span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1 space-y-4">
            {currentPosts.map((post) => {
              const statusConfig = getStatusConfig(post.status);
              const StatusIcon = statusConfig.icon;
              // View button for all
              const viewLink =
                post.type === "job"
                  ? `/admin/jobs/${post.id}`
                  : `/admin/courses/${post.id}`;

              return (
                <div
                  key={post.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section - Post Info */}
                    <div className="flex-1">
                      {/* <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs gap-1 px-1">
                              {post.type === "job" ? (
                                <Briefcase size={12} />
                              ) : (
                                <GraduationCap size={12} />
                              )}
                              {post.type === "job" ? "Job" : "Course"}
                            </Badge>
                            <Badge
                              className={`${statusConfig.color} flex items-center gap-1 px-2 py-0.5`}
                            >
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">
                            {post.title}
                          </h3>
                        </div>
                      </div> */}

                      {/* Post Details */}
                      {renderPostDetails(post)}

                      {/* Report Reason for Flagged Posts */}
                      {/* {post.status === "rejected" && post.reportReason && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Reported: {post.reportReason}
                        </div>
                      )} */}
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex flex-col flex-wrap gap-2">
                      <Link key="view" href={viewLink}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer w-full"
                        >
                          <Eye size={14} />
                          View
                        </Button>
                      </Link>
                      <div className="flex gap-1">{getActionButtons(post)}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {statusFilter === "pending"
                    ? "No pending posts"
                    : statusFilter === "approved"
                      ? "No approved posts"
                      : statusFilter === "rejected"
                        ? "No rejected posts"
                        : `No ${postTypeFilter === "jobs" ? "job" : postTypeFilter === "courses" ? "course" : ""} posts found`}
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
                {totalItems} posts
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} posts
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
            <AlertDialogTitle>Approve Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this post? It will become visible
              to users.
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
            <AlertDialogTitle>Reject Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this post?
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
