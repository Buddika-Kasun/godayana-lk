// src/app/seeker/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Bookmark,
  Gift,
  Eye,
  Calendar,
  Building,
  MapPin,
  Clock,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with API call
const stats = [
  {
    id: 1,
    label: "Applicants",
    value: 12,
    icon: Users,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    label: "Saved Jobs",
    value: 8,
    icon: Bookmark,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 3,
    label: "Incentives",
    value: 2,
    icon: Gift,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    id: 4,
    label: "Profile Views",
    value: 34,
    icon: Eye,
    color: "bg-purple-500/10 text-purple-500",
  },
];

const recentApplications = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "Colombo",
    appliedDate: "2024-04-20",
    status: "pending",
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Creative Agency",
    location: "Kandy",
    appliedDate: "2024-04-15",
    status: "applied",
  },
  {
    id: 3,
    title: "Construction Worker",
    company: "Build Masters",
    location: "Dubai UAE",
    appliedDate: "2024-04-14",
    status: "applied",
  },
];

const recommendedJobs = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "Innovation Hub",
    location: "Colombo",
    type: "Full time",
    salary: "LKR 150,000 - 200,000",
  },
  {
    id: 2,
    title: "Project Manager",
    company: "Tech Solutions",
    location: "Kandy",
    type: "Full time",
    salary: "LKR 180,000 - 250,000",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Remote",
    salary: "LKR 120,000 - 160,000",
  },
];

export default function SeekerDashboard() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

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

      {/* Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Link href="/seeker/applications">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary cursor-pointer"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{application.title}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building size={14} /> {application.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {formatDate(application.appliedDate)}
                    </span>
                  </div>
                </div>
                <Button
                  variant={
                    application.status === "pending" ? "default" : "outline"
                  }
                  size="sm"
                  className="gap-2"
                >
                  {application.status === "pending"
                    ? "Undo Review"
                    : "Apply Now"}
                </Button>
              </div>
            ))}

            {recentApplications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recent applications
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended for You */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recommended for You</CardTitle>
            <Link href="/seeker/applications">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary cursor-pointer"
              >
                Browse Jobs
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{job.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building size={14} /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {job.location}
                    </span>
                  </div>
                  {job.salary && (
                    <p className="text-sm text-primary mt-1 font-medium">
                      {job.salary}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  Apply Now
                </Button>
              </div>
            ))}

            {recommendedJobs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No recommendations available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/jobs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-4 text-center">
              <Briefcase className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold">Browse Jobs</p>
              <p className="text-xs text-muted-foreground">
                Find your next opportunity
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/seeker/saved-jobs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-4 text-center">
              <Bookmark className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold">Saved Jobs</p>
              <p className="text-xs text-muted-foreground">
                View your saved listings
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/seeker/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold">Complete Profile</p>
              <p className="text-xs text-muted-foreground">
                Get more job matches
              </p>
            </CardContent>
          </Card>
        </Link>
      </div> */}
    </div>
  );
}
