// src/components/company/profile/CompanyBasicInfoTab.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
import { Camera } from "lucide-react";
import { companyProfileAPI, CompanyProfileData } from "@/lib/api/endpoints/company/companyProfileEndpoints";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/redux/store";
// import { User } from "@/lib/api/endpoints/public/authEndpoints";
import { setUser } from "@/lib/redux/slices/authSlice";
import { User } from "@/lib/redux/types";

interface CompanyBasicInfoTabProps {
  companyData: CompanyProfileData | null;
  onSaveComplete?: (message?: string) => void;
}

export function CompanyBasicInfoTab({
  companyData,
  onSaveComplete,
}: CompanyBasicInfoTabProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectKey, setSelectKey] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    registrationNumber: "",
    industry: "",
    companyType: "",
    employeeCount: "",
    location: "",
    description: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form data when companyData changes
  useEffect(() => {
    if (companyData) {
      setFormData({
        companyName: companyData.companyName || "",
        companyEmail: companyData.companyEmail || "",
        registrationNumber: companyData.registrationNumber || "",
        industry: companyData.industry || "",
        companyType: companyData.companyType || "",
        employeeCount: companyData.employeeCount?.toString() || "",
        location: companyData.location || "",
        description: companyData.description || "",
      });
      setSelectKey((prev) => prev + 1);
    }
  }, [companyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Updating company profile...");

    try {
      const updateData = {
        ...companyData,
        ...formData,
        employeeCount: formData.employeeCount
          ? parseInt(formData.employeeCount)
          : undefined,
      };

      const response = await companyProfileAPI.updateCompanyProfile(updateData);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const isDifferent =
          apiResponse.data.companyName !== companyData?.companyName;

        if (isDifferent) {
          const mappedUser: User = {
            id: apiResponse.data.userId!,
            name: apiResponse.data.companyName!,
            email:
              apiResponse.data.companyEmail || companyData?.companyEmail || "",
            phone:
              apiResponse.data.hotlineNumber ||
              companyData?.hotlineNumber ||
              "",
            role: "company",
            avatar: apiResponse.data.logoUrl,
          };

          dispatch(setUser(mappedUser));
        }
      }

      toast.dismiss(loadingToast);
      if (onSaveComplete) {
        await onSaveComplete("Company information updated successfully");
      } else {
        toast.success("Company information updated successfully");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update company profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG or PNG image");
      return;
    }

    setUploadingLogo(true);
    const loadingToast = toast.loading("Uploading logo...");

    try {
      const response = await companyProfileAPI.uploadLogo(file);
      const apiResponse = response.data;

      toast.dismiss(loadingToast);

      if (apiResponse.data && apiResponse.success) {
        // Refresh company data
        if (onSaveComplete) {
          await onSaveComplete("Logo updated successfully");
        }

        // Update user in Redux store
        const mappedUser: User = {
          id: apiResponse.data.userId!,
          name: apiResponse.data.companyName || companyData?.companyName || "",
          email:
            apiResponse.data.companyEmail || companyData?.companyEmail || "",
          phone:
            apiResponse.data.hotlineNumber || companyData?.hotlineNumber || "",
          role: "company",
          avatar: apiResponse.data.logoUrl,
        };

        dispatch(setUser(mappedUser));
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getInitials = () => {
    if (formData.companyName) {
      return formData.companyName.charAt(0).toUpperCase();
    }
    return "C";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Label className="text-lg font-semibold mb-6">Basic Information</Label>

      {/* Upload Logo Section */}
      <div className="flex flex-col items-center space-y-4 pb-6 border-b">
        <div className="relative">
          <Avatar className="w-24 h-24 ring-2 ring-primary/10">
            <AvatarImage src={companyData?.logoUrl} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="logo-upload"
            className={`absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg ${
              uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Camera className="h-4 w-4 text-white" />
            <input
              ref={fileInputRef}
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {uploadingLogo ? "Uploading..." : "Upload Logo (Max 2MB, PNG or JPG)"}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="companyEmail"
              className="text-sm font-semibold text-primary"
            >
              Company Email{" "}
              <span className="text-red-500 text-xs">(Username)</span>
            </Label>
            <Input
              id="companyEmail"
              value={formData.companyEmail}
              placeholder="techcrop@gmail.com"
              disabled
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
              key={`industry-${selectKey}`}
              value={formData.industry || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, industry: value })
              }
              required
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT & Software</SelectItem>
                <SelectItem value="MARKETING">
                  Marketing & Advertising
                </SelectItem>
                <SelectItem value="FINANCE">Finance & Banking</SelectItem>
                <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                <SelectItem value="HOSPITALITY">Hospitality</SelectItem>
                <SelectItem value="RETAIL">Retail</SelectItem>
                <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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
              key={`companyType-${selectKey}`}
              value={formData.companyType || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, companyType: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Private Limited</SelectItem>
                <SelectItem value="PUBLIC">Public Limited</SelectItem>
                <SelectItem value="SOLE">Sole Proprietorship</SelectItem>
                <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="NONPROFIT">Non-Profit</SelectItem>
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
              htmlFor="employeeCount"
              className="text-sm font-semibold text-primary"
            >
              Company Size
            </Label>
            <Select
              key={`employeeCount-${selectKey}`}
              value={formData.employeeCount || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, employeeCount: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-10 employees</SelectItem>
                <SelectItem value="2">11-50 employees</SelectItem>
                <SelectItem value="3">51-200 employees</SelectItem>
                <SelectItem value="4">201-500 employees</SelectItem>
                <SelectItem value="5">501-1000 employees</SelectItem>
                <SelectItem value="6">1000+ employees</SelectItem>
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
        <Button
          type="submit"
          disabled={isLoading || uploadingLogo}
          className="px-8 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
