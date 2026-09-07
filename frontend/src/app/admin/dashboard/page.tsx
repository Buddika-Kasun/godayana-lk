// src/app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  FileText,
  Settings,
  Coins,
  BadgeCheck,
  User,
  BookX,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plane,
  Library,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subText?: string;
  items?: { label: string; value: number; href?: string; color?: string }[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

// Mock data - Replace with API calls
const mockStats = {
  payments: {
    revenue: 0,
    totalTransactions: 0,
    pendingInvoices: 0,
  },
  content: {
    visas: 0,
    countries: 0,
    stories: 0,
  },
  posts: {
    jobs: { all: 0, pending: 0, active: 0, rejected: 0 },
    courses: { all: 0, pending: 0, active: 0, rejected: 0 },
  },
  users: {
    companies: 0,
    pendingCompanies: 0,
    seekers: 0,
  },
  visaApplications: {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  gatewayApplications: {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
};

const statCards: StatCard[] = [
  {
    id: "revenue",
    label: "Revenue",
    value: `LKR ${mockStats.payments.revenue.toLocaleString()}`,
    icon: DollarSign,
    color: "bg-green-500/10 text-green-500",
    subText: `${mockStats.payments.totalTransactions} transactions • ${mockStats.payments.pendingInvoices} pending invoices`,
  },
  {
    id: "content",
    label: "Content",
    value:
      mockStats.content.visas +
      mockStats.content.countries +
      mockStats.content.stories,
    icon: Library,
    color: "bg-purple-500/10 text-purple-500",
    items: [
      {
        label: "Visas",
        value: mockStats.content.visas,
        href: "/admin/content?type=visas",
        color: "text-blue-500",
      },
      {
        label: "Countries",
        value: mockStats.content.countries,
        href: "/admin/content?type=countries",
        color: "text-green-500",
      },
      {
        label: "Stories",
        value: mockStats.content.stories,
        href: "/admin/content?type=stories",
        color: "text-pink-500",
      },
    ],
  },
  {
    id: "posts",
    label: "Posts",
    value: mockStats.posts.jobs.all + mockStats.posts.courses.all,
    icon: FileText,
    color: "bg-orange-500/10 text-orange-500",
    items: [
      {
        label: "Jobs",
        value: mockStats.posts.jobs.all,
        href: "/admin/posts?type=jobs",
        color: "text-blue-500",
      },
      {
        label: "Courses",
        value: mockStats.posts.courses.all,
        href: "/admin/posts?type=courses",
        color: "text-emerald-500",
      },
    ],
    subText: `${mockStats.posts.jobs.pending + mockStats.posts.courses.pending} pending approval`,
  },
  {
    id: "users",
    label: "Users",
    value: mockStats.users.companies + mockStats.users.seekers,
    icon: Users,
    color: "bg-cyan-500/10 text-cyan-500",
    items: [
      {
        label: "Companies",
        value: mockStats.users.companies,
        href: "/admin/users?type=companies",
        color: "text-indigo-500",
      },
      {
        label: "Seekers",
        value: mockStats.users.seekers,
        href: "/admin/users?type=seekers",
        color: "text-cyan-500",
      },
    ],
  },
  {
    id: "visa-applications",
    label: "Visa Applications",
    value: mockStats.visaApplications.all,
    icon: Plane,
    color: "bg-blue-500/10 text-blue-500",
    items: [
      {
        label: "Pending",
        value: mockStats.visaApplications.pending,
        href: "/admin/visa-gateway?type=visa",
        color: "text-yellow-500",
      },
      // {
      //   label: "Approved",
      //   value: mockStats.visaApplications.approved,
      //   color: "text-green-500",
      // },
      // {
      //   label: "Rejected",
      //   value: mockStats.visaApplications.rejected,
      //   color: "text-red-500",
      // },
    ],
  },
  {
    id: "gateway-applications",
    label: "Gateway Applications",
    value: mockStats.gatewayApplications.all,
    icon: BookX,
    color: "bg-red-500/10 text-red-500",
    items: [
      {
        label: "Pending",
        value: mockStats.gatewayApplications.pending,
        href: "/admin/visa-gateway?type=gateway",
        color: "text-yellow-500",
      },
      // {
      //   label: "Approved",
      //   value: mockStats.gatewayApplications.approved,
      //   color: "text-green-500",
      // },
      // {
      //   label: "Rejected",
      //   value: mockStats.gatewayApplications.rejected,
      //   color: "text-red-500",
      // },
    ],
  },
];

const quickActions: QuickAction[] = [
  {
    title: "Payment Records",
    description: "View all payment transactions",
    icon: Coins,
    href: "/admin/payments",
    color: "text-green-500",
  },
  {
    title: "Manage Content",
    description: "Visas, Countries, Stories",
    icon: Settings,
    href: "/admin/content",
    color: "text-purple-500",
  },
  {
    title: "Manage Approvals",
    description: "Review and approve content",
    icon: BadgeCheck,
    href: "/admin/approvals",
    color: "text-blue-500",
  },
  {
    title: "Manage Posts",
    description: "Jobs & Courses moderation",
    icon: FileText,
    href: "/admin/posts",
    color: "text-orange-500",
  },
  {
    title: "Visa & Gateway Review",
    description: "Review applications",
    icon: BookX,
    href: "/admin/visa-gateway",
    color: "text-red-500",
  },
  {
    title: "Users & Companies",
    description: "Manage users and companies",
    icon: User,
    href: "/admin/users",
    color: "text-cyan-500",
  },
];

// Pending Stats Row
const PendingStatsRow = () => {
  const router = useRouter();
  const pendingStats = [
    {
      label: "Pending Companies",
      value: mockStats.users.pendingCompanies,
      href: "/admin/approvals?status=pending",
    },
    {
      label: "Pending Jobs",
      value: mockStats.posts.jobs.pending,
      href: "/admin/posts?type=jobs",
    },
    {
      label: "Pending Courses",
      value: mockStats.posts.courses.pending,
      href: "/admin/posts?type=courses",
    },
    {
      label: "Pending Visas",
      value: mockStats.visaApplications.pending,
      href: "/admin/visa-gateway?type=visa",
    },
    {
      label: "Pending Gateway",
      value: mockStats.gatewayApplications.pending,
      href: "/admin/visa-gateway?type=gateway",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {pendingStats.map((stat, index) => (
        <Card
          key={index}
          className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors cursor-pointer"
          onClick={() => router.push(stat.href)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="p-2 rounded-full bg-yellow-200/50 dark:bg-yellow-900/30">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {stat.value}
                </p>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400/70 text-center">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Combined Stat Card Component
const CombinedStatCard = ({ stat }: { stat: StatCard }) => {
  const Icon = stat.icon;
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${stat.color}`}>
                <Icon size={16} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stat.value}
            </p>
            {stat.subText && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.subText}
              </p>
            )}
            {stat.items && (
              <div className="flex flex-wrap gap-3 mt-2">
                {stat.items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href || "#"}
                    className={`text-xs hover:underline ${item.color || "text-muted-foreground"} underline-offset-2`}
                    style={{ textDecorationColor: "currentColor" }}
                  >
                    <span className={item.color || "text-muted-foreground"}>
                      {item.label}: {item.value}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Admin Dashboard Component
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of all platform activities and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div> */}

      {/* Pending Items Quick Stats */}
      <PendingStatsRow />

      {/* Main Stats Grid - Combined Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <CombinedStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all aspects of the platform
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <div className="group flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer h-full min-h-30 relative">
                    <div
                      className={`p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors ${action.color}`}
                    >
                      <Icon size={24} />
                    </div>
                    <h4 className="font-semibold text-sm text-center">
                      {action.title}
                    </h4>
                    {/* Description - Hidden by default, shows on hover */}
                    <div className="absolute inset-0 bg-background backdrop-blur-sm rounded-lg flex items-center justify-center p-3 opacity-0 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none">
                      <p className="text-xs text-primary text-center">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity / Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>No recent activity</div>
            {/* <div className="flex items-center justify-between p-2 border-b">
              <div>
                <p className="font-medium">Job Post: Senior Developer</p>
                <p className="text-xs text-muted-foreground">
                  Posted 2 hours ago
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 border-b">
              <div>
                <p className="font-medium">Course: React Masterclass</p>
                <p className="text-xs text-muted-foreground">
                  Posted 5 hours ago
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-medium">Visa Application: UK Student Visa</p>
                <p className="text-xs text-muted-foreground">
                  Applied 1 day ago
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div> */}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>No recent activity</div>
            {/* <div className="flex items-start gap-3 p-2 border-b">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="font-medium">New Company Registered</p>
                <p className="text-xs text-muted-foreground">
                  TechCorp Ltd - 10 min ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 border-b">
              <div className="p-2 rounded-full bg-blue-500/10">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">New Job Posted</p>
                <p className="text-xs text-muted-foreground">
                  UX Designer at DesignStudio - 1 hour ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2">
              <div className="p-2 rounded-full bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">Visa Application Pending Review</p>
                <p className="text-xs text-muted-foreground">
                  Canada Work Visa - 2 hours ago
                </p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
