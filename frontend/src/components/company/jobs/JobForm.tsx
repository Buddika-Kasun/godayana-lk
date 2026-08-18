"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import Image from "next/image";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import companyJobEndpoints, {
  JobRequest,
} from "@/lib/api/endpoints/company/companyJobEndpoints";
import {
  educationLevels,
  employmentTypes,
  experienceLevels,
  jobCategories,
  locations,
} from "@/types/job";

export interface JobData {
  id?: string;
  jobTitle?: string;
  category?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  salaryNegotiable?: boolean;
  educationLevel?: string;
  minExperience?: string;
  employmentType?: string;
  fieldOfStudy?: string;
  minAge?: string;
  maxAge?: string;
  jobDescription?: string;
  startTime?: string;
  endTime?: string;
  benefits?: string;
  applicationDeadline?: string;
  confirmationEmail?: string;
  type?: "local" | "overseas";
  skills?: string[];
  descriptionImageFileKey?: string;
  descriptionImageUrl?: string;
  cvDeliveryOption?: "direct" | "matched";
  matchingCriteria?: {
    skills: boolean;
    experience: boolean;
    education: boolean;
    location: boolean;
  };
}

interface JobFormProps {
  initialData?: JobData | null;
  isEditing?: boolean;
  jobId?: string;
  setIsLoadingFun?: (loading: boolean) => void;
}

export function JobForm({
  initialData,
  isEditing,
  jobId,
  setIsLoadingFun,
}: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [jobType, setJobType] = useState<"local" | "overseas">(
    initialData?.type || "local",
  );

  // Skills state
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");

  // Benefits state
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits
      ? initialData.benefits.split(",").map((b) => b.trim())
      : [],
  );
  const [currentBenefit, setCurrentBenefit] = useState("");

  const [descriptionImageUrl, setDescriptionImageUrl] = useState<string>(
    initialData?.descriptionImageUrl || "",
  );
  const [descriptionImageFileKey, setDescriptionImageFileKey] =
    useState<string>(initialData?.descriptionImageFileKey || "");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [cvDeliveryOption, setCvDeliveryOption] = useState<
    "direct" | "matched"
  >(initialData?.cvDeliveryOption || "direct");
  const [matchingCriteria, setMatchingCriteria] = useState(
    initialData?.matchingCriteria || {
      skills: true,
      experience: false,
      education: false,
      location: false,
    },
  );

  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || "",
    category: initialData?.category || "",
    location: initialData?.location || "",
    salaryMin: initialData?.salaryMin || "",
    salaryMax: initialData?.salaryMax || "",
    salaryNegotiable: initialData?.salaryNegotiable || false,
    educationLevel: initialData?.educationLevel || "",
    minExperience: initialData?.minExperience || "",
    employmentType: initialData?.employmentType || "",
    fieldOfStudy: initialData?.fieldOfStudy || "",
    minAge: initialData?.minAge || "",
    maxAge: initialData?.maxAge || "",
    jobDescription: initialData?.jobDescription || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    applicationDeadline: initialData?.applicationDeadline || "",
    confirmationEmail: initialData?.confirmationEmail || "",
    descriptionImageFileKey: initialData?.descriptionImageFileKey || "",
  });

  // Fetch job data if editing and no initialData provided
  useEffect(() => {
    const fetchJobData = async () => {
      if (!isEditing || !jobId || initialData) return;

      setIsLoadingFun && setIsLoadingFun(true);

      try {
        const response = await companyJobEndpoints.getCompanyJobById(jobId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const job = apiResponse.data;
          // Populate form with fetched data
          setFormData({
            jobTitle: job.jobTitle || "",
            category: job.category || "",
            location: job.location || "",
            salaryMin: job.salaryMin?.toString() || "",
            salaryMax: job.salaryMax?.toString() || "",
            salaryNegotiable: job.salaryNegotiable || false,
            educationLevel: job.educationLevel || "",
            minExperience: job.minExperience || "",
            employmentType: job.employmentType || "",
            fieldOfStudy: job.fieldOfStudy || "",
            minAge: job.minAge?.toString() || "",
            maxAge: job.maxAge?.toString() || "",
            jobDescription: job.jobDescription || "",
            startTime: job.startTime || "",
            endTime: job.endTime || "",
            applicationDeadline: job.applicationDeadline?.split("T")[0] || "",
            confirmationEmail: job.confirmationEmail || "",
            descriptionImageFileKey: job.descriptionImageFileKey || "",
          });
          setJobType(job.type || "local");
          setSkills(job.skills || []);
          setBenefits(
            job.benefits ? job.benefits.split(",").map((b) => b.trim()) : [],
          );
          setDescriptionImageUrl(job.descriptionImageUrl || "");
          setDescriptionImageFileKey(job.descriptionImageFileKey || "");
          setCvDeliveryOption(job.cvDeliveryOption || "direct");
          if (job.matchingCriteria) {
            setMatchingCriteria(job.matchingCriteria);
          }
        } else {
          toast.error(apiResponse.message || "Failed to load job data");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoadingFun && setIsLoadingFun(false);
      }
    };

    fetchJobData();
  }, [isEditing, jobId, initialData]);

  // Skills handlers
  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Benefits handlers
  const handleAddBenefit = () => {
    if (currentBenefit.trim() && !benefits.includes(currentBenefit.trim())) {
      setBenefits([...benefits, currentBenefit.trim()]);
      setCurrentBenefit("");
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit));
  };

  const handleBenefitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddBenefit();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);

    try {
      const response = await companyJobEndpoints.uploadJobImage(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setDescriptionImageUrl(fileUrl);
        setDescriptionImageFileKey(fileKey);
        setIsImageChanged(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(apiResponse.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setDescriptionImageUrl("");
    setDescriptionImageFileKey("");
    setIsImageChanged(true);
    toast.success("Image removed");
  };

  // Helper function to validate form
  const validateForm = (): boolean => {
    if (!formData.jobTitle.trim()) {
      toast.error("Job title is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Job category is required");
      return false;
    }
    if (!formData.employmentType) {
      toast.error("Employment type is required");
      return false;
    }
    // if (!formData.location.trim()) {
    //   toast.error("Location is required");
    //   return false;
    // }
    if (!formData.jobDescription.trim()) {
      toast.error("Job description is required");
      return false;
    }
    if (
      formData.applicationDeadline <= new Date().toISOString().split("T")[0]
    ) {
      toast.error("Application deadline must be after the current date");
      return false;
    }
    if (!formData.confirmationEmail.trim()) {
      toast.error("Confirmation email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    action: "publish" | "draft",
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let fileKeyToSend: string | undefined;

      if (isImageChanged) {
        fileKeyToSend = descriptionImageFileKey || undefined;
      } else {
        fileKeyToSend = formData.descriptionImageFileKey || undefined;
      }

      const requestData: JobRequest = {
        jobTitle: formData.jobTitle,
        category: formData.category,
        location: formData.location,
        salaryMin: formData.salaryMin
          ? parseFloat(formData.salaryMin)
          : undefined,
        salaryMax: formData.salaryMax
          ? parseFloat(formData.salaryMax)
          : undefined,
        salaryNegotiable: formData.salaryNegotiable,
        educationLevel: formData.educationLevel,
        minExperience: formData.minExperience,
        employmentType: formData.employmentType,
        fieldOfStudy: formData.fieldOfStudy,
        minAge: formData.minAge ? parseInt(formData.minAge) : undefined,
        maxAge: formData.maxAge ? parseInt(formData.maxAge) : undefined,
        jobDescription: formData.jobDescription,
        startTime: formData.startTime,
        endTime: formData.endTime,
        benefits: benefits.join(", "),
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline).toISOString()
          : undefined,
        confirmationEmail: formData.confirmationEmail,
        type: jobType,
        skills: skills,
        descriptionImageFileKey: fileKeyToSend,
        cvDeliveryOption: cvDeliveryOption,
        matchingCriteria:
          cvDeliveryOption === "matched" ? matchingCriteria : undefined,
        status: action === "publish" ? "PENDING" : "DRAFT",
      };

      let response;
      if (isEditing && jobId) {
        response = await companyJobEndpoints.updateJob(jobId, requestData);
        toast.success("Job updated successfully!");
      } else {
        response = await companyJobEndpoints.createJob(requestData);
        toast.success(
          action === "publish"
            ? "Job published successfully!"
            : "Job saved as draft",
        );
      }

      router.push("/company/jobs");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save job. Please try again.";
      console.error("Error saving job:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "publish")} className="space-y-4">
      <div className="space-y-8">
        {/* Job Type Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Job Type</h3>
          <RadioGroup
            value={jobType}
            onValueChange={(value) => setJobType(value as "local" | "overseas")}
            className="flex gap-4 lg:gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="local" id="local" />
              <Label htmlFor="local" className="cursor-pointer">
                Local Job
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overseas" id="overseas" />
              <Label htmlFor="overseas" className="cursor-pointer">
                Overseas Job
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Job Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Job Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="jobTitle"
                className="text-sm font-semibold text-primary"
              >
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="e.g., Senior Software Engineer"
                required
                className="mt-1.5"
                disabled={isEditing}
              />
            </div>

            <div>
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-primary"
              >
                Job Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
                disabled={isEditing}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="it">IT & Software</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="other">Other</SelectItem> */}
                  {jobCategories.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="employmentType"
                className="text-sm font-semibold text-primary"
              >
                Employment Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) =>
                  setFormData({ ...formData, employmentType: value })
                }
                required
                disabled={isEditing}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem> */}
                  {employmentTypes.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-primary"
              >
                Location (District)
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
                // required
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="kandy">Kandy</SelectItem>
                  <SelectItem value="galle">Galle</SelectItem>
                  <SelectItem value="kegalle">Kegalle</SelectItem>
                  <SelectItem value="matara">Matara</SelectItem>
                  <SelectItem value="jaffna">Jaffna</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="other">Other</SelectItem> */}
                  {locations.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Salary Range
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-1.5">
              <Input
                type="number"
                value={formData.salaryMin}
                onChange={(e) =>
                  setFormData({ ...formData, salaryMin: e.target.value })
                }
                placeholder="Min (LKR)"
              />
              <Input
                type="number"
                value={formData.salaryMax}
                onChange={(e) =>
                  setFormData({ ...formData, salaryMax: e.target.value })
                }
                placeholder="Max (LKR)"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={formData.salaryNegotiable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, salaryNegotiable: checked })
                }
                className="cursor-pointer"
              />
              <Label className="text-sm">Salary Negotiable</Label>
            </div>
          </div>
        </div>

        {/* Candidate Requirements */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Candidate Requirements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="educationLevel"
                className="text-sm font-semibold text-primary"
              >
                Education Level
              </Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, educationLevel: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelors">
                    Bachelor&apos;s Degree
                  </SelectItem>
                  <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem> */}
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="minExperience"
                className="text-sm font-semibold text-primary"
              >
                Minimum Experience
              </Label>
              <Select
                value={formData.minExperience}
                onValueChange={(value) =>
                  setFormData({ ...formData, minExperience: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="0">Fresher</SelectItem>
                  <SelectItem value="1">1 Year</SelectItem>
                  <SelectItem value="2">2 Years</SelectItem>
                  <SelectItem value="3">3 Years</SelectItem>
                  <SelectItem value="4">4 Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem> */}
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills - Bullet Style with Border Box */}
          <div>
            <Label className="text-sm font-semibold text-primary">
              Required Skills
            </Label>
            <div className="flex gap-2 mt-1.5">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  •
                </span>
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="pl-6"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddSkill}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{skill}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-muted-foreground group-hover:text-red-500 transition-colors opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No skills added yet
                </p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="fieldOfStudy"
              className="text-sm font-semibold text-primary"
            >
              Field of Study
            </Label>
            <Input
              id="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={(e) =>
                setFormData({ ...formData, fieldOfStudy: e.target.value })
              }
              placeholder="e.g., Computer Science"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Age Range (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              value={formData.minAge}
              onChange={(e) =>
                setFormData({ ...formData, minAge: e.target.value })
              }
              placeholder="Min age"
            />
            <Input
              type="number"
              value={formData.maxAge}
              onChange={(e) =>
                setFormData({ ...formData, maxAge: e.target.value })
              }
              placeholder="Max age"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Job Description & Benefits</h3>

          <div>
            <Label
              htmlFor="jobDescription"
              className="text-sm font-semibold text-primary"
            >
              Job Description
              {/* <span className="text-red-500">*</span> */}
            </Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) =>
                setFormData({ ...formData, jobDescription: e.target.value })
              }
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={5}
              required
              className="mt-1.5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">
              Working Hours
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="startTime"
                  className="text-xs text-muted-foreground"
                >
                  Start
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <span className="text-muted-foreground mt-4">to</span>
              <div className="flex-1">
                <Label
                  htmlFor="endTime"
                  className="text-xs text-muted-foreground"
                >
                  End
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Benefits - Bullet Style with Border Box */}
          <div>
            <Label className="text-sm font-semibold text-primary">
              Benefits (Optional)
            </Label>
            <div className="flex gap-2 mt-1.5">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  •
                </span>
                <Input
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyDown={handleBenefitKeyDown}
                  placeholder="Type a benefit and press Enter"
                  className="pl-6"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddBenefit}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{benefit}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(benefit)}
                    className="text-muted-foreground group-hover:text-red-500 transition-colors opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {benefits.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No benefits added yet
                </p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="applicationDeadline"
              className="text-sm font-semibold text-primary"
            >
              Application Deadline <span className="text-red-500">*</span>
            </Label>
            <Input
              id="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicationDeadline: e.target.value,
                })
              }
              className="mt-1.5"
              required
            />
          </div>
        </div>

        {/* Description Image Upload */}
        <div>
          <Label className="text-sm font-semibold text-primary">
            Description Image (Optional)
          </Label>
          <div className="mt-2">
            {descriptionImageUrl ? (
              <div className="relative inline-block">
                <div className="relative w-50 h-70">
                  <Image
                    src={descriptionImageUrl}
                    alt="Job description"
                    fill
                    className="rounded-lg object-cover border"
                    unoptimized={!descriptionImageUrl.startsWith("http")}
                    sizes="(max-width: 200px) 100vw, 200px"
                    priority={false}
                    loading="lazy"
                    onError={() => {
                      console.error(
                        "Failed to load image:",
                        descriptionImageUrl,
                      );
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully");
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={isUploadingImage}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 transition-colors ${isUploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Uploading...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            )}
          </div>
        </div>

        {/* CV Delivery Options */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">CV Delivery Options</h3>

          <RadioGroup
            value={cvDeliveryOption}
            onValueChange={(value) =>
              setCvDeliveryOption(value as "direct" | "matched")
            }
            className="space-y-3"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="direct" id="direct" className="mt-1" />
              <div>
                <Label
                  htmlFor="direct"
                  className="font-semibold cursor-pointer"
                >
                  Send all CVs directly to company email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive all applications via email as they come in
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="matched" id="matched" className="mt-1" />
              <div>
                <Label
                  htmlFor="matched"
                  className="font-semibold cursor-pointer"
                >
                  Forward only matched CVs
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only receive CVs that match your specified criteria
                </p>
              </div>
            </div>
          </RadioGroup>

          {cvDeliveryOption === "matched" && (
            <div className="pl-6 space-y-2">
              <Label className="text-sm font-semibold">
                CV Matching Criteria
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={matchingCriteria.skills}
                    onCheckedChange={(checked) =>
                      setMatchingCriteria({
                        ...matchingCriteria,
                        skills: checked,
                      })
                    }
                    className="cursor-pointer"
                  />
                  <Label>Match required skills</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={matchingCriteria.experience}
                    onCheckedChange={(checked) =>
                      setMatchingCriteria({
                        ...matchingCriteria,
                        experience: checked,
                      })
                    }
                    className="cursor-pointer"
                  />
                  <Label>Match experience years</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={matchingCriteria.education}
                    onCheckedChange={(checked) =>
                      setMatchingCriteria({
                        ...matchingCriteria,
                        education: checked,
                      })
                    }
                    className="cursor-pointer"
                  />
                  <Label>Match education level</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={matchingCriteria.location}
                    onCheckedChange={(checked) =>
                      setMatchingCriteria({
                        ...matchingCriteria,
                        location: checked,
                      })
                    }
                    className="cursor-pointer"
                  />
                  <Label>Match location</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Email */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <Label
              htmlFor="confirmationEmail"
              className="text-sm font-semibold text-primary"
            >
              Confirmation Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmationEmail"
              type="email"
              value={formData.confirmationEmail}
              onChange={(e) =>
                setFormData({ ...formData, confirmationEmail: e.target.value })
              }
              placeholder="hr@techcorp.com"
              required
              disabled={isEditing}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Post confirmation will be sent to this email
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t justify-end">
          <Button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="flex-1 cursor-pointer max-w-2xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>{isEditing ? "Save Changes" : "Publish Job"}</>
            )}
          </Button>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading || isUploadingImage}
              className="flex-1 cursor-pointer"
              onClick={(e) => handleSubmit(e, "draft")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
