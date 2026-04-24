// src/app/company/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Building,
  PlusCircle,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with API call
const stats = [
  {
    id: 1,
    label: "Active Jobs",
    value: 8,
    icon: Briefcase,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    label: "Total Applications",
    value: 145,
    icon: Users,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    label: "Profile Views",
    value: 1234,
    icon: Eye,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 4,
    label: "Response Rate",
    value: "92%",
    icon: TrendingUp,
    color: "bg-yellow-500/10 text-yellow-500",
  },
];

const activeJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    applications: 45,
    views: 320,
    postedDate: "2024-04-20",
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    applications: 28,
    views: 210,
    postedDate: "2024-04-15",
  },
  {
    id: 3,
    title: "Construction Worker",
    applications: 52,
    views: 410,
    postedDate: "2024-04-18",
  },
];

const quickActions = [
  {
    title: "Post a Job",
    description: "Create new job posting",
    icon: PlusCircle,
    href: "/company/jobs/post",
    color: "text-primary",
  },
  {
    title: "Review Applications",
    description: "45 new applications",
    icon: FileText,
    href: "/company/applications",
    color: "text-blue-500",
  },
  {
    title: "Manage Jobs",
    description: "Edit or close postings",
    icon: Settings,
    href: "/company/jobs",
    color: "text-purple-500",
  },
];

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

export default function CompanyDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Posts - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Job Posts</CardTitle>
              <Link href="/company/jobs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary cursor-pointer"
                >
                  View All Jobs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {job.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {job.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {formatDate(job.postedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {activeJobs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active job posts
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Takes 1/3 of the space */}
        <div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.title}>
                    <Link href={action.href}>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div
                          className={`p-2 rounded-full bg-primary/10 shrink-0 ${action.color}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">
                            {action.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
