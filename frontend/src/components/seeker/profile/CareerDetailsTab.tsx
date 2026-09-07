// src/components/seeker/profile/CareerDetailsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, FileText, ExternalLink } from "lucide-react";
import { seekerProfileAPI, SeekerProfileData } from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import toast from "react-hot-toast";

interface CareerDetailsTabProps {
  userData: SeekerProfileData | null;
  onSaveComplete?: (message?: string) => void;
}

export function CareerDetailsTab({
  userData,
  onSaveComplete,
}: CareerDetailsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [selectKey, setSelectKey] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [formData, setFormData] = useState({
    employmentStatus: "",
    currentJobTitle: "",
    experience: "",
    education: "",
    studyField: "",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "",
    // resume: "",
    portfolio: "",
    summary: "",
  });

  // Populate form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        employmentStatus: userData.employmentStatus || "",
        currentJobTitle: userData.currentJobTitle || "",
        experience: userData.experienceYears?.toString() || "",
        education: userData.education || "",
        studyField: userData.studyField || "",
        currentSalary: userData.currentSalary?.toString() || "",
        expectedSalary: userData.expectedSalary?.toString() || "",
        noticePeriod: userData.noticePeriod?.toString() || "",
        // resume: userData.resumeUrl || "",
        portfolio: userData.portfolioUrl || "",
        summary: userData.professionalSummary || "",
      });

      setResumeUrl(userData.resumeUrl!)

      // Set skills if available
      if (userData.skills && Array.isArray(userData.skills)) {
        setSkills(userData.skills);
      }

      // Force Select components to re-render with new values
      setSelectKey((prev) => prev + 1);
    }
  }, [userData]);

  const handleAddSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF, DOC, or DOCX files only");
      return;
    }

    setResumeFile(file);
    setIsUploading(true);
    const loadingToast = toast.loading("Uploading resume...");

    try {
      // Upload the resume using your API
      const response = await seekerProfileAPI.uploadResume(file);
      const apiResponse = response.data;
      
      if (apiResponse.success && apiResponse.data) {
        setResumeUrl(apiResponse.data.resumeUrl!);
      }

      toast.dismiss(loadingToast);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload resume");
      setResumeFile(null);
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Updating career details...");

    try {
      // Prepare data for API
      const updateData = {
        ...userData,
        employmentStatus: formData.employmentStatus,
        currentJobTitle: formData.currentJobTitle,
        education: formData.education,
        studyField: formData.studyField,
        experienceYears: parseInt(formData.experience) || 0,
        expectedSalary: parseInt(formData.expectedSalary) || 0,
        noticePeriod: parseInt(formData.noticePeriod) || 0,
        portfolioUrl: formData.portfolio,
        professionalSummary: formData.summary,
        // resumeUrl: formData.resume,
        skills: skills,
      };

      await seekerProfileAPI.updateSeekerProfile(updateData);
      toast.dismiss(loadingToast);

      if (onSaveComplete) {
        await onSaveComplete("Career details updated successfully");
      } else {
        toast.success("Career details updated successfully");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update career details");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user's full name
  const getUserFullName = () => {
    if (!userData) return "User";
    const fullName = userData.fullName || "";
    return `${fullName}`.trim() || "User";
  };

  // Helper function to get file icon based on extension
  const getFileIcon = (url: string) => {
    if (!url) return <FileText className="h-4 w-4" />;
    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "pdf")
      return <FileText className="h-4 w-4 text-red-500" />;
    if (["doc", "docx"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold mb-6">Career Information</Label>

        {/* Employment Status and Current/Last Job Title - One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="employmentStatus"
              className="text-sm font-semibold text-primary"
            >
              Employment Status <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`employment-status-${selectKey}`}
              value={formData.employmentStatus || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, employmentStatus: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYED">Employed</SelectItem>
                <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="currentJobTitle"
              className="text-sm font-semibold text-primary"
            >
              Current / Last Job Title
            </Label>
            <Input
              id="currentJobTitle"
              value={formData.currentJobTitle}
              onChange={(e) =>
                setFormData({ ...formData, currentJobTitle: e.target.value })
              }
              placeholder="e.g., Senior Software Engineer"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Education and Field of Study */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="education"
              className="text-sm font-semibold text-primary"
            >
              Highest Education <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`education-${selectKey}`}
              value={formData.education || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, education: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                <SelectItem value="DIPLOMA">Diploma</SelectItem>
                <SelectItem value="BACHELORS">
                  Bachelor&apos;s Degree
                </SelectItem>
                <SelectItem value="MASTERS">Master&apos;s Degree</SelectItem>
                <SelectItem value="PHD">PhD</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="studyField"
              className="text-sm font-semibold text-primary"
            >
              Field of Study <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studyField"
              value={formData.studyField}
              onChange={(e) =>
                setFormData({ ...formData, studyField: e.target.value })
              }
              placeholder="e.g., Computer Science"
              required
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Experience and Expected Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="experience"
              className="text-sm font-semibold text-primary"
            >
              Years of Experience <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`experience-${selectKey}`}
              value={formData.experience || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, experience: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Fresher</SelectItem>
                <SelectItem value="1">1 Year</SelectItem>
                <SelectItem value="2">2 Years</SelectItem>
                <SelectItem value="3">3 Years</SelectItem>
                <SelectItem value="4">4 Years</SelectItem>
                <SelectItem value="5">5 Years</SelectItem>
                <SelectItem value="6">6 Years</SelectItem>
                <SelectItem value="7">7 Years</SelectItem>
                <SelectItem value="8">8 Years</SelectItem>
                <SelectItem value="9">9 Years</SelectItem>
                <SelectItem value="10">10+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="expectedSalary"
              className="text-sm font-semibold text-primary"
            >
              Expected Salary (LKR)
            </Label>
            <Input
              id="expectedSalary"
              type="number"
              value={formData.expectedSalary}
              onChange={(e) =>
                setFormData({ ...formData, expectedSalary: e.target.value })
              }
              placeholder="e.g., 200000"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Notice Period */}
        <div>
          <Label
            htmlFor="noticePeriod"
            className="text-sm font-semibold text-primary"
          >
            Notice Period (Days)
          </Label>
          <Input
            id="noticePeriod"
            type="number"
            value={formData.noticePeriod}
            onChange={(e) =>
              setFormData({ ...formData, noticePeriod: e.target.value })
            }
            placeholder="e.g., 30"
            className="mt-1.5"
          />
        </div>

        {/* Skills Section */}
        <div>
          <Label className="text-sm font-semibold text-primary">Skills</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No skills added yet. Add your skills above.
              </p>
            )}
          </div>
        </div>

        {/* Resume and Portfolio - Updated Resume Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="resume"
              className="text-sm font-semibold text-primary"
            >
              Resume/CV <span className="text-red-500">*</span>
          </Label>

            {/* Show resume file if exists */}
            {resumeUrl ? (
              <div className="mt-1.5 p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(resumeUrl)}
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate flex items-center gap-1"
                      title={`${getUserFullName()}_CV.pdf`}
                    >
                      {`${getUserFullName()}_CV.pdf`}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Trigger file input click to change resume
                        document.getElementById("resume-upload")?.click();
                      }}
                      className="ml-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Change
                    </Button>
                    {/* Hidden file input - only visible when Change button is clicked */}
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden" // Hide the input
                      onChange={handleResumeUpload}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                {isUploading && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Uploading...
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Click the filename to view in new tab
                </p>
              </div>
            ) : (
              /* File upload input when no resume exists */
              <div className="mt-1.5">
                <div className="flex items-center gap-2">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="flex-1"
                    onChange={handleResumeUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="text-sm text-muted-foreground">
                      Uploading...
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload PDF, DOC, or DOCX (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <div>
            <Label
              htmlFor="portfolio"
              className="text-sm font-semibold text-primary"
            >
              Portfolio URL (Optional)
            </Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) =>
                setFormData({ ...formData, portfolio: e.target.value })
              }
              placeholder="https://your-portfolio.com"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <Label
            htmlFor="summary"
            className="text-sm font-semibold text-primary"
          >
            Professional Summary
          </Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            placeholder="Tell us about yourself, your experience, and career goals..."
            rows={4}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="px-8 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
