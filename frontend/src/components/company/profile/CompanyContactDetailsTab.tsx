// src/components/company/profile/CompanyContactDetailsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  Globe,
  Facebook,
  Linkedin,
  Instagram,
  User,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

export function CompanyContactDetailsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyEmail: "",
    hotlineNumber: "",
    website: "",
    facebookUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    contactPersonName: "",
    designation: "",
    cvDeliveryEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Contact information updated successfully");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold mb-6">
          Contact Information
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="companyEmail"
              className="text-sm font-semibold text-primary"
            >
              Company Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) =>
                  setFormData({ ...formData, companyEmail: e.target.value })
                }
                placeholder="hr@techcorp.com"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="hotlineNumber"
              className="text-sm font-semibold text-primary"
            >
              Hotline Number
            </Label>
            <div className="relative mt-1.5">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                id="hotlineNumber"
                value={formData.hotlineNumber}
                onChange={(e) =>
                  setFormData({ ...formData, hotlineNumber: e.target.value })
                }
                placeholder="+94 00 XXXX XXXX"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label
            htmlFor="website"
            className="text-sm font-semibold text-primary"
          >
            Company Website
          </Label>
          <div className="relative mt-1.5">
            <Globe
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://www.example.com"
              className="pl-10"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-3 pt-2">
          <Label className="text-sm font-semibold text-primary">
            Social Media Links
          </Label>

          <div className="relative">
            <Facebook
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              size={18}
            />
            <Input
              value={formData.facebookUrl}
              onChange={(e) =>
                setFormData({ ...formData, facebookUrl: e.target.value })
              }
              placeholder="Facebook URL"
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Linkedin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700"
              size={18}
            />
            <Input
              value={formData.linkedinUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkedinUrl: e.target.value })
              }
              placeholder="LinkedIn URL"
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Instagram
              className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600"
              size={18}
            />
            <Input
              value={formData.instagramUrl}
              onChange={(e) =>
                setFormData({ ...formData, instagramUrl: e.target.value })
              }
              placeholder="Instagram URL"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* HR/Contact Person Details */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-lg font-semibold mb-6">
          HR/Contact Person Details
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="contactPersonName"
              className="text-sm font-semibold text-primary"
            >
              Contact Person Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPersonName: e.target.value,
                  })
                }
                placeholder="Sarah Johnson"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="designation"
              className="text-sm font-semibold text-primary"
            >
              Designation <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Briefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                placeholder="HR Manager"
                required
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label
            htmlFor="cvDeliveryEmail"
            className="text-sm font-semibold text-primary"
          >
            Direct Email for CV Delivery <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="cvDeliveryEmail"
              type="email"
              value={formData.cvDeliveryEmail}
              onChange={(e) =>
                setFormData({ ...formData, cvDeliveryEmail: e.target.value })
              }
              placeholder="jobs@techcorp.com"
              required
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            CVs will be sent to this email address
          </p>
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
