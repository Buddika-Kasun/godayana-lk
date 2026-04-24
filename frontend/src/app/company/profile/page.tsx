// src/app/company/profile/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyBasicInfoTab } from "@/components/company/profile/CompanyBasicInfoTab";
import { CompanyContactDetailsTab } from "@/components/company/profile/CompanyContactDetailsTab";
import { CompanyAgreementsTab } from "@/components/company/profile/CompanyAgreementsTab";

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="">
      <Card className="bg-primary/4">
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
              <CompanyBasicInfoTab />
            </TabsContent>

            <TabsContent value="contact">
              <CompanyContactDetailsTab />
            </TabsContent>

            <TabsContent value="agreements">
              <CompanyAgreementsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
