// src/components/company/profile/CompanyAgreementsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export function CompanyAgreementsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreements, setAgreements] = useState({
    jobPostingTerms: false,
    cvDeliveryTerms: false,
  });

  const handleAgreementToggle = (key: keyof typeof agreements) => {
    setAgreements({ ...agreements, [key]: !agreements[key] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreements.jobPostingTerms || !agreements.cvDeliveryTerms) {
      toast.error("Please accept all terms and agreements");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Agreements updated successfully");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Terms & Agreements */}
      <div className="space-y-6">
        <Label className="text-lg font-semibold mb-6">
          Terms & Agreements
        </Label>

        {/* Job Posting Terms */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={18} className="text-primary" />
              <Label className="font-semibold">
                Job Posting Terms & Conditions
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              I agree to the job posting terms including non-negotiable fees,
              remote jobs are allowed.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="px-0 mt-2">
                  Read full terms
                  <ExternalLink size={12} className="ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Job Posting Terms & Conditions</DialogTitle>
                  <DialogDescription>
                    Please read the full terms and conditions carefully.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p>
                    1. All job postings are subject to review and approval by
                    our team.
                  </p>
                  <p>
                    2. Fees for job postings are non-refundable once the job is
                    published.
                  </p>
                  <p>3. Remote jobs are allowed and clearly marked as such.</p>
                  <p>
                    4. Companies must provide accurate information about the
                    position.
                  </p>
                  <p>5. Discrimination of any kind is strictly prohibited.</p>
                  <p>
                    6. Job postings will be active for 30 days unless specified
                    otherwise.
                  </p>
                  <p>
                    7. We reserve the right to remove any inappropriate job
                    postings.
                  </p>
                  <p>
                    8. Contact our support team for any questions or concerns.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Switch
            checked={agreements.jobPostingTerms}
            onCheckedChange={() => handleAgreementToggle("jobPostingTerms")}
            className="cursor-pointer"
          />
        </div>

        {/* CV Email Delivery Model Terms */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={18} className="text-primary" />
              <Label className="font-semibold">
                CV Email Delivery Model Terms
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              I understand the CV delivery options and agree to the terms of
              service.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="px-0 mt-2">
                  Read full terms
                  <ExternalLink size={12} className="ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>CV Email Delivery Model Terms</DialogTitle>
                  <DialogDescription>
                    Please read the full terms and conditions carefully.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p>
                    1. CVs will be delivered to the specified email address.
                  </p>
                  <p>2. Companies are responsible for managing received CVs.</p>
                  <p>
                    3. Candidate data should be handled in compliance with
                    privacy laws.
                  </p>
                  <p>
                    4. CV delivery is automated and tracked for quality
                    assurance.
                  </p>
                  <p>5. Companies can opt out of CV delivery at any time.</p>
                  <p>6. Support is available for any delivery issues.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Switch
            checked={agreements.cvDeliveryTerms}
            onCheckedChange={() => handleAgreementToggle("cvDeliveryTerms")}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Account Status */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Account Status</h3>
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle
              className="text-green-600 dark:text-green-400"
              size={20}
            />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">
                Your account is Approved
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                You can now post jobs and access all features.
              </p>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 cursor-pointer"
        >
          {isLoading ? "Updating..." : "Update Agreements"}
        </Button>
      </div>
    </form>
  );
}
