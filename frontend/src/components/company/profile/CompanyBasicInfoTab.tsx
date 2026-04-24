// src/components/company/profile/CompanyBasicInfoTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";

export function CompanyBasicInfoTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.name || "",
    industry: "",
    companyType: "",
    location: "",
    description: "",
    registrationNumber: "",
    companySize: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call to save data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Company information updated successfully");
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      toast.success("Logo uploaded successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Label className="text-lg font-semibold mb-6">Basic Information</Label>

      {/* Upload Logo Section */}
      <div className="flex flex-col items-center space-y-4 pb-6 border-b">
        <div className="relative">
          <Avatar className="w-24 h-24 border-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {formData.companyName?.charAt(0)?.toUpperCase() || "C"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="logo-upload"
            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera className="h-4 w-4 text-white" />
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Upload Logo
          <br />
          PNG or JPG. Max size 2MB
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="companyName"
              className="text-sm font-semibold text-primary"
            >
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="Tech Corp Ltd"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="registrationNumber"
              className="text-sm font-semibold text-primary"
            >
              Business Registration Number
            </Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              placeholder="BR XXXXXXX (Optional)"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="industry"
              className="text-sm font-semibold text-primary"
            >
              Industry/Sector <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) =>
                setFormData({ ...formData, industry: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT & Software</SelectItem>
                <SelectItem value="marketing">
                  Marketing & Advertising
                </SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="companyType"
              className="text-sm font-semibold text-primary"
            >
              Company Type
            </Label>
            <Select
              value={formData.companyType}
              onValueChange={(value) =>
                setFormData({ ...formData, companyType: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Limited</SelectItem>
                <SelectItem value="public">Public Limited</SelectItem>
                <SelectItem value="sole">Sole Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="nonprofit">Non-Profit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="location"
              className="text-sm font-semibold text-primary"
            >
              Company Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Colombo, Sri Lanka"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="companySize"
              className="text-sm font-semibold text-primary"
            >
              Company Size
            </Label>
            <Select
              value={formData.companySize}
              onValueChange={(value) =>
                setFormData({ ...formData, companySize: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-semibold text-primary"
          >
            Company Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Tell us about your company..."
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
