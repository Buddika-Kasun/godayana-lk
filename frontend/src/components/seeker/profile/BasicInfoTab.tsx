// src/components/seeker/profile/BasicInfoTab.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
import { Camera } from "lucide-react";
import { seekerProfileAPI, SeekerProfileData } from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/slices/authSlice";
import { User } from "@/lib/redux/types";

interface BasicInfoTabProps {
  userData: SeekerProfileData | null;
  onSaveComplete?: (message?: string) => void;
}

export function BasicInfoTab({ userData, onSaveComplete }: BasicInfoTabProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    location: "",
    email: "",
  });
  const [selectKey, setSelectKey] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        dateOfBirth: userData.dateOfBirth || "",
        nationality: userData.nationality || "",
        gender: userData.gender || "",
        location: userData.location || "",
        email: userData.email || "",
      });
      setSelectKey((prev) => prev + 1);
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      const updateData = {
        ...userData,
        ...formData,
      };

      const response = await seekerProfileAPI.updateSeekerProfile(updateData);
      const apiResponse = response.data;

      
      if (apiResponse.success && apiResponse.data) {
        const isDeferent = apiResponse.data.fullName != userData?.fullName;

        if (isDeferent) {
          const mappedUser: User = {
            id: apiResponse.data.id!,
            name: apiResponse.data.fullName!,
            email: apiResponse.data.email!,
            phone: apiResponse.data.phone!,
            role: "seeker",
            avatar: apiResponse.data.profilePicUrl,
          };
    
          dispatch(setUser(mappedUser));
        }
      }

      toast.dismiss(loadingToast);
      if (onSaveComplete) {
        await onSaveComplete("Basic information updated successfully");
      } else {
        toast.success("Basic details updated successfully");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setUploadingImage(true);
    const loadingToast = toast.loading("Uploading photo...");

    try {
      const response = await seekerProfileAPI.uploadProfileImage(file);
      const apiResponse = response.data;
      toast.dismiss(loadingToast);
      // toast.success("Photo uploaded successfully");

      if (apiResponse.data && apiResponse.success) {
        // Refresh user data
        if (onSaveComplete) {
          await onSaveComplete("Photo updated successfully");
        }

        const mappedUser: User = {
          id: apiResponse.data.id!,
          name: apiResponse.data.fullName!,
          email: apiResponse.data.email!,
          phone: apiResponse.data.phone!,
          role: "seeker",
          avatar: apiResponse.data.profilePicUrl,
        };

        dispatch(setUser(mappedUser));
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload photo");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getInitials = () => {
    if (formData.fullName) {
      return formData.fullName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Label className="text-lg font-semibold mb-6">Basic Information</Label>

      {/* Upload Photo Section */}
      <div className="flex flex-col items-center space-y-4 pb-6 border-b">
        <div className="relative">
          <Avatar className="w-24 h-24 ring-2 ring-primary/10">
            <AvatarImage src={userData?.profilePicUrl} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className={`absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg ${
              uploadingImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Camera className="h-4 w-4 text-white" />
            <input
              ref={fileInputRef}
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {uploadingImage
            ? "Uploading..."
            : "Upload Photo (Max 2MB, PNG or JPG)"}
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
              Mobile Number{" "}
              <span className="text-red-500 text-xs">(Username)</span>
            </Label>
            <Input
              id="mobileNumber"
              value={userData?.phone || ""}
              placeholder="+94 77 123 4567"
              readOnly
              disabled
              className="mt-1.5"
            />
          </div>
          <div>
            <Label
              htmlFor="mobileNumber"
              className="text-sm font-semibold text-primary"
            >
              E-mail <span className="text-red-500 text-xs">*</span>
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="johndoe@gmail.com"
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
              key={`gender-${selectKey}`}
              value={formData.gender || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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
              key={`nationality-${selectKey}`}
              value={formData.nationality || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, nationality: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select Nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SRI_LANKAN">Sri Lankan</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
