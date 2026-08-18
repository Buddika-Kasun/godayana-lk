// src/components/jobs/JobDetailsView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Briefcase,
  Share2,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Building2,
  Eye,
  Users,
  CheckCircle,
  ExternalLink,
  Award,
  Clock as ClockIcon,
  DollarSign,
  GraduationCap,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { JobResponse } from "@/lib/api/endpoints/company/companyJobEndpoints";
import { formatPostedDate } from "@/lib/utils/dateUtils";
import {
  formatCategory,
  formatCompanyType,
  formatEmployeeCount,
} from "@/lib/utils/companyUtils";
import { formatEmploymentType } from "@/lib/utils/jobUtils";
import { formatLocation } from "@/lib/utils/locationUtils";
import { useSavedJobs } from "@/lib/hooks/useSavedJobs";
import { useAppliedJobs } from "@/lib/hooks/useAppliedJobs";

interface JobDetailsViewProps {
  job: JobResponse;
  isVisited?: boolean;
  isSaved?: boolean;
  hideButtons?: boolean;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string, status: boolean) => void;
  onShare?: () => void;
}

export function JobDetailsView({
  job,
  isVisited,
  isSaved: initialIsSaved,
  hideButtons = false,
  onApply,
  onSave,
  onShare,
}: JobDetailsViewProps) {
  // Use Redux hook for saved jobs
  const { savedJobIds, toggleSaveJob, isToggling } = useSavedJobs();
  // Determine if job is saved from Redux state or prop
  const isJobSaved = initialIsSaved ?? savedJobIds.includes(job.id);
  const [saved, setSaved] = useState(isJobSaved);

  const { appliedJobIds, applyJob, isApplying } = useAppliedJobs();
  const isApplied = appliedJobIds.includes(job.id);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      const d = new Date(dateString);
      const now = new Date();
      const diff = Math.ceil(
        (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diff > 0 ? `${diff} days left` : "Expired";
    } catch {
      return "Not specified";
    }
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `LKR ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `From LKR ${job.salaryMin.toLocaleString()}`;
    if (job.salaryMax) return `Up to LKR ${job.salaryMax.toLocaleString()}`;
    if (job.salaryNegotiable) return "Negotiable";
    return "Not specified";
  };

  const formatTime = (time?: string) => {
    if (!time) return "Not specified";
    try {
      if (time.includes(":")) {
        const parts = time.split(":");
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
      }
      return time;
    } catch {
      return time;
    }
  };

  const formatEducationLevel = (level?: string) => {
    if (!level) return "Not specified";
    const levelMap: Record<string, string> = {
      "high-school": "High School",
      diploma: "Diploma",
      bachelors: "Bachelor's Degree",
      masters: "Master's Degree",
      phd: "PhD",
    };
    return levelMap[level.toLowerCase()] || level;
  };

  const getCompanyInitials = (name?: string) => {
    if (!name) return "C";
    return name.charAt(0).toUpperCase();
  };

  const handleSave = async () => {
    const newStatus = !saved;
    setSaved(newStatus);

    // Use Redux action - the toast will be shown by the Redux action
    // await toggleSaveJob(job.id, saved);

    // Call parent callback if provided
    if (onSave) {
      onSave(job.id, saved);
    }
    // Remove toast from here - it's already shown by the Redux action
  };

  // const handleShare = () => {
  //   if (onShare) {
  //     onShare();
  //   } else {
  //     navigator.clipboard.writeText(window.location.href);
  //     toast.success("Link copied to clipboard");
  //   }
  // };
  const handleShare = () => {
      if (onShare) {
        onShare();
      } else {
        // Get the base URL without any path
        const origin = window.location.origin;
        // Always return the public courses path
        const publicUrl =  `${origin}/jobs/${job.id}`;
  
        // Implement share functionality
        if (navigator.share) {
          navigator.share({
            title: job.jobTitle + ` (${job.companyName}) ` + " - Godayana.lk",
            text: "Godayana.lk",
            url: publicUrl,
          });
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(publicUrl);
          toast.success("Link copied to clipboard");
        }
      }
    };

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    } else {
      toast.success("Application submitted successfully");
    }
  };

  // Build requirements array from job data including skills
  const requirements = [
    job.educationLevel &&
      `Education: ${formatEducationLevel(job.educationLevel)}`,
    job.minExperience && `Experience: ${job.minExperience} years`,
    job.fieldOfStudy && `Field of Study: ${job.fieldOfStudy}`,
    job.minAge && job.maxAge && `Age: ${job.minAge} - ${job.maxAge} years`,
    job.minAge && !job.maxAge && `Min Age: ${job.minAge} years`,
    !job.minAge && job.maxAge && `Max Age: ${job.maxAge} years`,
  ].filter(Boolean) as string[];

  // Add skills as bullet points in requirements
  const skillsList = job.skills || [];
  if (skillsList.length > 0) {
    requirements.push(`Required Skills:`);
    skillsList.forEach((skill) => {
      requirements.push(`  • ${skill}`);
    });
  }

  // Build benefits array from comma-separated string
  const benefitsList = job.benefits
    ? job.benefits
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b)
    : [];

  let flag = "Viewed";
  if (saved) {
    flag = "Saved";
  }
  if (isApplied) {
    flag = "Applied";
  }

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-8 overflow-hidden">
        {/* Visited badge */}
        {isVisited && (
          <div className="absolute top-0 left-0 rounded-br-full px-4 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-xs">
            {flag}
          </div>
        )}
        <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
        <p className="text-lg opacity-90 mt-2">
          {job.company?.companyName || job.companyName || "Company"} -{" "}
          {job.location || "Location not specified"}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <Tag size={14} /> {formatCategory(job.category)}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={14} /> {formatEmploymentType(job.employmentType)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Posted: {formatPostedDate(job.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatDate(job.applicationDeadline)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />{" "}
            {job.type === "overseas" ? "Overseas" : "Local"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:pr-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border py-2 md:hidden sticky top-14 mb-2">
            <div className="px-4 py-2 space-y-4">
              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold"
                  size="lg"
                  disabled={isApplied || hideButtons}
                >
                  {isApplied ? "ALREADY APPLIED" : "APPLY FOR JOB"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
                    disabled={isToggling || hideButtons}
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                    {saved ? "Saved" : "Save Job"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 uppercase text-primary">
              Job Description
            </h2>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {job.jobDescription || "No description provided."}
            </div>
          </div>

          {/* DESCRIPTION IMAGE */}
          {job.descriptionImageUrl && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Description Image
              </h2>
              <div className="relative w-full">
                <Image
                  src={job.descriptionImageUrl}
                  alt="Job description image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg object-contain"
                  unoptimized={!job.descriptionImageUrl.startsWith("http")}
                  onError={() => {
                    console.error(
                      "Failed to load description image:",
                      job.descriptionImageUrl,
                    );
                  }}
                />
              </div>
            </div>
          )}

          {/* REQUIREMENTS with Skills included */}
          {requirements.length > 0 && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Requirements
              </h2>
              <ul className="space-y-3">
                {requirements.map((item, i) => {
                  if (item.startsWith("  • ")) {
                    return (
                      <li key={i} className="flex gap-3 pl-6">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">
                          {item.replace("  • ", "")}
                        </span>
                      </li>
                    );
                  }
                  if (item === "Required Skills:") {
                    return (
                      <li
                        key={i}
                        className="flex gap-3 font-semibold text-primary pt-2"
                      >
                        <span>Required Skills:</span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex gap-3">
                      <CheckCircle
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* WORKING HOURS & SALARY */}
          {(job.startTime ||
            job.endTime ||
            job.salaryMin ||
            job.salaryMax ||
            job.salaryNegotiable) && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Working Hours & Salary
              </h2>
              <div className="space-y-4">
                {(job.startTime || job.endTime) && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon size={18} className="text-primary" />
                      <span className="font-medium">Start:</span>
                      <span className="font-bold">
                        {formatTime(job.startTime) || "Not specified"}
                      </span>
                    </div>
                    <span className="text-muted-foreground">to</span>
                    <div className="flex items-center gap-2">
                      <ClockIcon size={18} className="text-primary" />
                      <span className="font-medium">End:</span>
                      <span className="font-bold">
                        {formatTime(job.endTime) || "Not specified"}
                      </span>
                    </div>
                  </div>
                )}

                {(job.salaryMin || job.salaryMax || job.salaryNegotiable) && (
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <span className="font-medium">Salary:</span>
                    {job.salaryMin && job.salaryMax ? (
                      <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">
                        LKR {job.salaryMin.toLocaleString()} -{" "}
                        {job.salaryMax.toLocaleString()}
                      </span>
                    ) : job.salaryMin ? (
                      <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">
                        From LKR {job.salaryMin.toLocaleString()}
                      </span>
                    ) : job.salaryMax ? (
                      <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">
                        Up to LKR {job.salaryMax.toLocaleString()}
                      </span>
                    ) : job.salaryNegotiable ? (
                      <span className="text-lg font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">
                        Negotiable
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BENEFITS */}
          {benefitsList.length > 0 && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Benefits
              </h2>
              <ul className="space-y-3">
                {benefitsList.map((benefit, i) => (
                  <li key={i} className="flex gap-3">
                    <Award size={18} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMPANY DESCRIPTION - Commented out as it's in sidebar */}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 -top-16 md:-top-44 relative order-first lg:order-last hidden md:block">
          <div className="overflow-visible md:sticky md:top-22 z-12 pb-2">
            <div className="">
              <div className="flex w-full gap-3 justify-between items-center px-2">
                <Button
                  onClick={handleApply}
                  className={`px-6 cursor-pointer text-white font-semibold ${
                    isApplied
                      ? "bg-gray-500 hover:bg-gray-400 cursor-not-allowed opacity-100!"
                      : "bg-primary hover:bg-primary/80"
                  }`}
                  size="lg"
                  disabled={isApplied || hideButtons}
                >
                  {isApplied ? "Already Applied" : "APPLY NOW"}
                </Button>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    onClick={handleSave}
                    className="text-white h-8 w-8 cursor-pointer bg-primary rounded-full"
                    disabled={isToggling || hideButtons}
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-white" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleShare}
                    className="text-white h-8 w-8 cursor-pointer bg-primary rounded-full"
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN APPLICATION CARD */}
          <div className="bg-card shadow-xl rounded-t-xl overflow-visible relative top-14 pb-22 border">
            <div className="px-6 py-2 space-y-4">
              <div className="w-30 h-30 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-xl absolute -top-10 shadow-xl z-10">
                {job.company?.logoUrl ? (
                  <Image
                    src={job.company.logoUrl}
                    alt={job.company.companyName || "Company"}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover w-full h-full"
                  />
                ) : (
                  getCompanyInitials(
                    job.company?.companyName || job.companyName,
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border-l border-r border-b rounded-b-md relative md:sticky md:top-20 z-1 pt-12 pb-2">
            <div className="px-6 pt-2 space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-bold text-lg">{job.jobTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.company?.companyName || job.companyName || "Company"} -{" "}
                  {job.location || "Location not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card relative shadow-xl overflow-visible border-l border-r border-b rounded-b-md">
            <div className="px-6 pb-2 pt-4 space-y-4">
              {/* META INFO */}
              <div className="text-sm space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-primary" />
                  <span>{formatCategory(job.category)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span>{formatLocation(job.location) || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>{formatDate(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" />
                  <span>{formatEmploymentType(job.employmentType)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-primary" />
                  <span>{formatEducationLevel(job.educationLevel)}</span>
                </div>
                {job.startTime && job.endTime && (
                  <div className="flex items-center gap-2">
                    <ClockIcon size={14} className="text-primary" />
                    <span>
                      {formatTime(job.startTime)} - {formatTime(job.endTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* QUICK OVERVIEW */}
              <div className="border-t pt-3">
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground w-24 text-xs">
                      Education
                    </div>
                    <div className="font-medium flex-1">
                      {formatEducationLevel(job.educationLevel) || "Any"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground w-24 text-xs">
                      Experience
                    </div>
                    <div className="font-medium flex-1">
                      {job.minExperience ? `${job.minExperience} years` : "Any"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground w-24 text-xs">
                      Salary
                    </div>
                    <div className="font-medium flex-1 text-primary">
                      {formatSalary()}
                    </div>
                  </div>

                  {(job.minAge || job.maxAge) && (
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground w-24 text-xs">
                        Age Range
                      </div>
                      <div className="font-medium flex-1">
                        {job.minAge && job.maxAge
                          ? `${job.minAge} - ${job.maxAge} years`
                          : job.minAge
                            ? `Min ${job.minAge} years`
                            : job.maxAge
                              ? `Max ${job.maxAge} years`
                              : "Not specified"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 py-2 border-b">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Eye size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{job.viewCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">
                    {job.applicationCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden bg-card rounded-b-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border-l border-r border-b pb-2">
            <div className="px-6 py-2 space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold"
                  size="lg"
                  disabled={isApplied}
                >
                  {isApplied ? "ALREADY APPLIED" : "APPLY FOR JOB"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
                    disabled={isToggling}
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                    {saved ? "Saved" : "Save Job"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY INFO CARD */}
          <Card className="rounded-xl shadow-sm mt-8 mb-4">
            <CardContent className="px-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Company Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">
                    {job.company?.companyName ||
                      job.companyName ||
                      "Not specified"}
                  </span>
                </div>
                {job.company?.industry && (
                  <div className="flex flex-col justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">
                      {formatCategory(job.company.industry)}
                    </span>
                  </div>
                )}
                {job.company?.employeeCount && (
                  <div className="flex flex-col justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="font-medium">
                      {formatEmployeeCount(job.company.employeeCount)}
                    </span>
                  </div>
                )}
                {job.company?.location && (
                  <div className="flex flex-col justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{job.company.location}</span>
                  </div>
                )}
                {job.company?.companyType && (
                  <div className="flex flex-col justify-between">
                    <span className="text-muted-foreground">Company Type</span>
                    <span className="font-medium">
                      {formatCompanyType(job.company.companyType)}
                    </span>
                  </div>
                )}
                {job.company?.website && (
                  <div className="flex flex-col justify-between">
                    <Link
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Visit Website
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* COMPANY DESCRIPTION */}
          {job.company?.description && (
            <Card className="rounded-xl shadow-sm mt-8 mb-4">
              <CardContent className="px-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Company About
                </h3>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {job.company.description}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SHARE MESSAGE */}
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              Unemployment in Sri Lanka is estimated to be over 390,816, share
              this job and help another!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
