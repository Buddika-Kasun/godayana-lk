// src/components/company/jobs/JobForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Bold, Upload } from "lucide-react";
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

interface JobData {
  id?: number;
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
  workingHours?: string;
  benefits?: string;
  applicationDeadline?: string;
  confirmationEmail?: string;
  type?: "local" | "overseas";
  skills?: string[];
  descriptionImage?: string;
}

interface JobFormProps {
  initialData?: JobData;
  isEditing?: boolean;
}

export function JobForm({ initialData, isEditing }: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [jobType, setJobType] = useState<"local" | "overseas">(
    initialData?.type || "local",
  );
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");
  const [descriptionImage, setDescriptionImage] = useState<string>(
    initialData?.descriptionImage || "",
  );
  const [cvDeliveryOption, setCvDeliveryOption] = useState<
    "direct" | "matched"
  >("direct");
  const [matchingCriteria, setMatchingCriteria] = useState({
    skills: true,
    experience: false,
    education: false,
    location: false,
  });

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
    workingHours: initialData?.workingHours || "",
    benefits: initialData?.benefits || "",
    applicationDeadline: initialData?.applicationDeadline || "",
    confirmationEmail: initialData?.confirmationEmail || "",
  });

  const handleAddSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDescriptionImage(reader.result as string);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setDescriptionImage("");
    toast.success("Image removed");
  };

  const handleSubmit = async (
    e: React.FormEvent,
    action: "publish" | "draft",
  ) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(
      action === "publish"
        ? "Job published successfully!"
        : "Job saved as draft",
    );
    setIsLoading(false);
    router.push("/company/jobs");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "publish")} className="space-y-4">
      {/* Back Button */}
      {/* <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">
          {isEditing ? "Edit Job" : "Post a New Job"}
        </h2>
      </div> */}

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
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT & Software</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="employmentStatus"
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
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-primary"
              >
                Location (District) <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="kandy">Kandy</SelectItem>
                  <SelectItem value="galle">Galle</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
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
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelors">
                    Bachelor&apos;s Degree
                  </SelectItem>
                  <SelectItem value="masters">Master&apos;s Degree</SelectItem>
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
                  <SelectItem value="0">Fresher</SelectItem>
                  <SelectItem value="1">1 Year</SelectItem>
                  <SelectItem value="2">2 Years</SelectItem>
                  <SelectItem value="3">3 Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Required Skills
            </Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                }
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
              Job Description <span className="text-red-500">*</span>
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

          <div>
            <Label
              htmlFor="workingHours"
              className="text-sm font-semibold text-primary"
            >
              Working Hours
            </Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) =>
                setFormData({ ...formData, workingHours: e.target.value })
              }
              placeholder="e.g., 9:00 AM - 5:00 PM"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="benefits"
              className="text-sm font-semibold text-primary"
            >
              Benefits (Optional)
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              placeholder="List employee benefits..."
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="applicationDeadline"
              className="text-sm font-semibold text-primary"
            >
              Application Deadline
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
            />
          </div>
        </div>

        {/* Description Image Upload */}
        <div>
          <Label className="text-sm font-semibold text-primary">
            Description Image (Optional)
          </Label>
          <div className="mt-2">
            {descriptionImage ? (
              <div className="relative inline-block">
                <Image
                  src={descriptionImage}
                  alt="Job description"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG (Max 2MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
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
            disabled={isLoading}
            className="flex-1 cursor-pointer max-w-2xl"
          >
            {isEditing
              ? isLoading
                ? "Updating..."
                : "Save Changes"
              : isLoading
                ? "Publishing..."
                : "Publish Job"}
          </Button>
          {!isEditing && 
            <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="flex-1 cursor-pointer"
                onClick={(e) => handleSubmit(e, "draft")}
            >
                Save as Draft
            </Button>
          }
        </div>
      </div>
    </form>
  );
}
