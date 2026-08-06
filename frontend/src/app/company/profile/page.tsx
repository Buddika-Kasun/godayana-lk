// src/app/company/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyBasicInfoTab } from "@/components/company/profile/CompanyBasicInfoTab";
import { CompanyContactDetailsTab } from "@/components/company/profile/CompanyContactDetailsTab";
import { CompanyAgreementsTab } from "@/components/company/profile/CompanyAgreementsTab";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import toast from "react-hot-toast";
import { companyProfileAPI, CompanyProfileData } from "@/lib/api/endpoints/company/companyProfileEndpoints";

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("basic");
  const [company, setCompany] = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = async (wantLoading: boolean = true) => {
    if (wantLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await companyProfileAPI.getCompanyProfile();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCompany(apiResponse.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load company profile data";
      setError(errorMessage);
      // You can show error toast if needed
      // toast.error(errorMessage);
    } finally {
      if (wantLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSaveComplete = async (message?: string) => {
    await fetchCompany(false);
    if (message) {
      toast.success(message);
    } else {
      toast.success("Profile updated successfully");
    }
  };

  return (
    <div className="relative">
      <Card className="bg-primary/4 min-h-[calc(100vh-150px)]">
        {isLoading ? (
          <SubLoadingScreen message="Loading company profile..." />
        ) : (
          <CardContent className="">
            {/* Header */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mt-1">
                Manage your company details, contact information, and agreements
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
                    value="contact"
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-background cursor-pointer text-sm font-semibold py-0 px-3 lg:px-4"
                  >
                    Contact
                  </TabsTrigger>
                  <TabsTrigger
                    value="agreements"
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-background cursor-pointer text-sm font-semibold py-0 px-3 lg:px-4"
                  >
                    Agreements
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="border-b mb-2"></div>

              <TabsContent value="basic">
                <CompanyBasicInfoTab
                  companyData={company}
                  onSaveComplete={handleSaveComplete}
                />
              </TabsContent>

              <TabsContent value="contact">
                <CompanyContactDetailsTab
                  companyData={company}
                  onSaveComplete={handleSaveComplete}
                />
              </TabsContent>

              <TabsContent value="agreements">
                <CompanyAgreementsTab
                  companyData={company}
                  onSaveComplete={handleSaveComplete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
