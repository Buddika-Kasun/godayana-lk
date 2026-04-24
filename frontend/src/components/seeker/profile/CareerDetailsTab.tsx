// src/components/seeker/profile/CareerDetailsTab.tsx
"use client";

import { useState } from "react";
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
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";

export function CareerDetailsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [formData, setFormData] = useState({
    employmentStatus: "",
    currentJobTitle: "",
    experience: "",
    education: "",
    studyField: "",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "",
    resume: "",
    portfolio: "",
    summary: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Career details updated successfully");
    setIsLoading(false);
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
              value={formData.employmentStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, employmentStatus: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
              value={formData.education}
              onValueChange={(value) =>
                setFormData({ ...formData, education: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="bachelors">
                  Bachelor&apos;s Degree
                </SelectItem>
                <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
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
              value={formData.experience}
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
                <SelectItem value="10+">10+ Years</SelectItem>
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

        {/* Skills Section */}
        <div>
          <Label className="text-sm font-semibold text-primary">Skills</Label>
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

        {/* Resume and Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="resume"
              className="text-sm font-semibold text-primary"
            >
              Resume/CV
            </Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-1.5"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  toast.success("Resume uploaded successfully");
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload PDF, DOC, or DOCX (Max 5MB)
            </p>
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
        <Button type="submit" disabled={isLoading} className="px-8 cursor-pointer">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
