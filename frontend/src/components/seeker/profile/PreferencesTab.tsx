// src/components/seeker/profile/PreferencesTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { seekerProfileAPI, SeekerProfileData } from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import toast from "react-hot-toast";

interface PreferencesTabProps {
  userData: SeekerProfileData | null;
  onSaveComplete?: (message?: string) => void;
}

const jobCategories = [
  "IT & Software",
  "Marketing",
  "Finance",
  "Sales",
  "Customer Service",
  "Engineering",
  "Healthcare",
  "Education",
  "Administration",
  "Hospitality",
];

export function PreferencesTab({
  userData,
  onSaveComplete,
}: PreferencesTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showShareCV, setShowShareCV] = useState(false);
  const [allowContact, setAllowContact] = useState(true);

  // Populate form data when userData changes
  useEffect(() => {
    if (userData) {
      // Set preferred job categories
      if (
        userData.preferredJobCategories &&
        Array.isArray(userData.preferredJobCategories)
      ) {
        setSelectedCategories(userData.preferredJobCategories);
      }

      // Set share CV preference
      if (userData.shareCv !== undefined) {
        setShowShareCV(userData.shareCv);
      }
    }
  }, [userData]);

  const handleAddCategory = (category: string) => {
    if (
      !selectedCategories.includes(category) &&
      selectedCategories.length < 3
    ) {
      setSelectedCategories([...selectedCategories, category]);
    } else if (selectedCategories.length >= 3) {
      toast.error("You can select maximum 3 categories");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const handleDeleteAccount = async () => {
    const loadingToast = toast.loading("Deleting account...");
    setIsLoading(true);
    try {
      // API call to delete account
      // await authAPI.deleteAccount();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.dismiss(loadingToast);
      toast.success("Account deletion requested");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Saving preferences...");

    try {
      const updateData = {
        ...userData,
        preferredJobCategories: selectedCategories,
        shareCv: showShareCV,
      };

      // API call to save preferences
      await seekerProfileAPI.updateSeekerProfile(updateData);

      toast.dismiss(loadingToast);

      if (onSaveComplete) {
        await onSaveComplete("Preferences saved successfully");
      } else {
        toast.success("Preferences saved successfully");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Job Preferences */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold mb-6">Job Preferences</Label>
          <p className="text-base font-semibold mb-2 text-primary">
            Preferred Job Categories (Max 3)
          </p>

          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {category}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedCategories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories selected. Add up to 3 categories.
              </p>
            )}
          </div>

          {/* Add Category Dropdown */}
          <div className="relative">
            <select
              className="w-full p-2 border rounded-lg bg-background"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCategory(e.target.value);
                  e.target.value = "";
                }
              }}
              value=""
              disabled={selectedCategories.length >= 3}
            >
              <option value="">
                {selectedCategories.length >= 3
                  ? "Maximum categories reached"
                  : "Add Category"}
              </option>
              {jobCategories
                .filter((cat) => !selectedCategories.includes(cat))
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            {selectedCategories.length >= 3 && (
              <p className="text-xs text-amber-500 mt-1">
                You&apos;ve reached the maximum of 3 categories
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-primary">
              Share my CV with Employers
            </Label>
            <p className="text-sm text-muted-foreground pr-2">
              Allow employers to view your CV and contact you
            </p>
          </div>
          <Switch
            checked={showShareCV}
            onCheckedChange={setShowShareCV}
            className="cursor-pointer"
          />
        </div>

        {/* Uncomment if you want to add this feature */}
        {/* <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-primary">
              Allow employers to contact you directly
            </Label>
            <p className="text-sm text-muted-foreground pr-2">
              Employers can reach you via email or phone
            </p>
          </div>
          <Switch 
            checked={allowContact} 
            onCheckedChange={setAllowContact} 
            className="cursor-pointer"
          />
        </div> */}
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSavePreferences}
          disabled={isLoading}
          className="px-8 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
