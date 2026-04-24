// src/components/seeker/profile/BasicInfoTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function BasicInfoTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    mobileNumber: user?.phone || "",
    email: user?.email || "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call to save data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully");
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      // Handle image upload
      toast.success("Photo uploaded successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Label className="text-lg font-semibold mb-6">Basic Information</Label>

      {/* Upload Photo Section */}
      <div className="flex flex-col items-center space-y-4 pb-6 border-b">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera className="h-4 w-4 text-white" />
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Upload Photo
          <br />
          (If not in PNG, Make sure 2MB)
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="fullName"
            className="text-sm font-semibold text-primary"
          >
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="John Doe"
            required
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="mobileNumber"
              className="text-sm font-semibold text-primary"
            >
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
              placeholder="+94 77 123 4567"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-primary"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john.doe@example.com"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="location"
              className="text-sm font-semibold text-primary"
            >
              Location (City/District) <span className="text-red-500">*</span>
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
            <Label htmlFor="dob" className="text-sm font-semibold text-primary">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="gender"
              className="text-sm font-semibold text-primary"
            >
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="nationality"
              className="text-sm font-semibold text-primary"
            >
              Nationality <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.nationality}
              onValueChange={(value) =>
                setFormData({ ...formData, nationality: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select Nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sri-lankan">Sri Lankan</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
