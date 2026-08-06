// src/app/seeker/profile/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/seeker/profile/BasicInfoTab";
import { CareerDetailsTab } from "@/components/seeker/profile/CareerDetailsTab";
import { PreferencesTab } from "@/components/seeker/profile/PreferencesTab";
import toast from "react-hot-toast";
import { seekerProfileAPI, SeekerProfileData } from "@/lib/api/endpoints/seeker/seekerProfileEndpoints";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";

export default function SeekerProfile() {
  const [activeTab, setActiveTab] = useState("basic");
  const [user, setUser] = useState<SeekerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (wantLoading: boolean = true) => {
    if (wantLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await seekerProfileAPI.getSeekerProfile();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setUser(apiResponse.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load seeker profile data";
      setError(errorMessage);
      //toast.error(errorMessage);
    } finally {
      if (wantLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSaveComplete = async (message?: string) => {
    await fetchUser(false);
    if(message) {
      toast.success(message);
    }
    else {
      toast.success("Profile updated successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        <Card className="bg-primary/4 min-h-[calc(100vh-150px)]">
          <SubLoadingScreen message="Loading profile..." />
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="bg-primary/4 min-h-[calc(100vh-150px)]">
          <CardContent className="">
            {/* Header */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-primary/10 p-1 rounded-lg w-fit">
                <TabsList className="grid grid-cols-3 p-0 bg-transparent">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-background cursor-pointer text-sm font-semibold py-0 px-3 lg:px-4"
                  >
                    Basic
                  </TabsTrigger>
                  <TabsTrigger
                    value="career"
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-background cursor-pointer text-sm font-semibold py-0 px-3 lg:px-4"
                  >
                    Career
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-background cursor-pointer text-sm font-semibold py-0 px-3 lg:px-4"
                  >
                    Preferences
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="border-b mb-2"></div>

              <TabsContent value="basic">
                <BasicInfoTab
                  userData={user}
                  onSaveComplete={handleSaveComplete}
                />
              </TabsContent>

              <TabsContent value="career">
                <CareerDetailsTab 
                userData={user} 
                onSaveComplete={handleSaveComplete}
                />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesTab 
                userData={user} 
                onSaveComplete={handleSaveComplete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
      </Card>
    </div>
  );
}
