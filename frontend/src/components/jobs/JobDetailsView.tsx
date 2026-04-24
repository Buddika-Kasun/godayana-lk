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
} from "lucide-react";
import toast from "react-hot-toast";

interface JobDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  category: string;
  experience: string;
  salary: string;
  deadline: string;
  applicants?: number;
  views?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: {
    education: string;
    experience: string;
    salaryRange: string;
  };
  companyDescription: string;
  companySize?: string;
  companyWebsite?: string;
  industry?: string;
  postedDate: string;
  isSaved?: boolean;
  isApplied?: boolean;
}

interface JobDetailsViewProps {
  job: JobDetails;
  onApply?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function JobDetailsView({
  job,
  onApply,
  onSave,
  onShare,
}: JobDetailsViewProps) {
  const [saved, setSaved] = useState(job.isSaved || false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil(
      (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? `${diff} days left` : "Expired";
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave();
    } else {
      toast.success(saved ? "Removed from saved" : "Saved successfully");
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      toast.success("Application submitted successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-lg opacity-90 mt-2">
          {job.company} - {job.location}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <Briefcase size={14} /> {job.type}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Posted:{" "}
            {new Date(job.postedDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatDate(job.deadline)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:pr-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          <div className="bg-card rounded-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border py-2 md:hidden sticky top-14 mb-2">
            <div className="px-4 py-2 space-y-4">
              <div className="space-y-3">
                {/* ACTION BUTTONS */}
                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold"
                  size="lg"
                >
                  APPLY FOR JOB
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
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
          <div className=" rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 uppercase text-primary">
              Job Description
            </h2>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* REQUIREMENTS */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RESPONSIBILITIES / JOB PROFILE */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                Job Profile
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* QUALIFICATIONS */}
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 uppercase text-primary">
              Qualifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Education</p>
                <p className="font-medium">
                  {job.qualifications?.education || "Not specified"}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium">
                  {job.qualifications?.experience || "Not specified"}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Salary Range</p>
                <p className="font-medium">
                  {job.qualifications?.salaryRange || "Negotiable"}
                </p>
              </div>
            </div>
          </div>

          {/* COMPANY DESCRIPTION */}
          {job.companyDescription && (
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                About {job.company}
              </h2>
              <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {job.companyDescription}
              </div>
              {job.companyWebsite && (
                <Link
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 mt-4"
                >
                  Visit Website
                  <ExternalLink size={14} />
                </Link>
              )}
            </div>
          )}

          {/* WHAT WE OFFER */}
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 uppercase text-primary">
              What We Offer
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
                <span className="text-muted-foreground">
                  Attractive remuneration package based on qualifications and
                  experience
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
                <span className="text-muted-foreground">
                  Excellent career development opportunities
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
                <span className="text-muted-foreground">
                  Pleasant and professional work environment
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
                <span className="text-muted-foreground">
                  Work with world-leading IT brands
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 -top-16 md:-top-44 relative order-first lg:order-last hidden md:block">
          {/* MAIN APPLICATION CARD */}
          <div className="bg-card shadow-xl rounded-t-xl overflow-visible relative top-24 pb-40 border">
            <div className="px-6 py-2 space-y-4">
              {/* LOGO + TITLE */}
              <div className="w-30 h-30 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-xl absolute -top-10 shadow-xl z-10">
                {job.company.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="bg-card border-l border-r relative md:sticky md:top-18 z-1 py-2">
            <div className="px-6 py-2 space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.company} - {job.location}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card relative shadow-xl overflow-visible border-l border-r">
            <div className="px-6 py-2 space-y-4">
              {/* META INFO */}
              <div className="text-sm space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>{formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" />
                  <span>{job.type}</span>
                </div>
              </div>

              {/* QUICK OVERVIEW */}
              <div className="border-t pt-3">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="align-top">
                      <td className="text-muted-foreground w-24 py-1">
                        Education
                      </td>
                      <td className="font-medium py-1">
                        {job.qualifications?.education || "Any"}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="text-muted-foreground w-24 py-1">
                        Experience
                      </td>
                      <td className="font-medium py-1">
                        {job.qualifications?.experience || "Any"}
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="text-muted-foreground w-24 py-1">
                        Salary
                      </td>
                      <td className="font-medium py-1 text-primary">
                        {job.qualifications?.salaryRange || "Negotiable"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 py-2 border-b">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Eye size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{job.views || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{job.applicants || 0}</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-b-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border-l border-r border-b pb-2">
            <div className="px-6 py-2 space-y-4">
              <div className="space-y-3">
                {/* ACTION BUTTONS */}
                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold"
                  size="lg"
                >
                  APPLY FOR JOB
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
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
          <Card className="rounded-xl shadow-sm my-8">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Company Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{job.company}</span>
                </div>
                {job.industry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{job.industry}</span>
                  </div>
                )}
                {job.companySize && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="font-medium">{job.companySize}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
