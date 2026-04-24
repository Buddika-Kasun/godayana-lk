// src/app/company/jobs/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { JobDetailsView } from "@/components/jobs/JobDetailsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the JobDetails interface
interface JobDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote" | "internship";
  category: string;
  experience: string;
  salary: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  deadline: string;
  applicants?: number;
  views?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: {
    education: string;
    experience: string;
    salaryRange: string;
  };
  companyDescription: string;
  companySize?: string;
  companyWebsite?: string;
  industry?: string;
  postedDate: string;
  isSaved?: boolean;
  isApplied?: boolean;
}

// Mock data - replace with API call
const getJobDetails = (jobId: number): JobDetails => {
  return {
    id: jobId,
    title: "Software Engineers",
    company: "Data Management Systems (Pvt) Ltd",
    location: "Colombo",
    type: "full-time",
    category: "IT & Software",
    experience: "1-3 years",
    salary: "Negotiable",
    deadline: "2024-05-07",
    applicants: 45,
    views: 320,
    description: `Data Management Systems (Pvt) Ltd, (DMS) is a pioneering IT Company in Sri Lanka, now in its 45th year of operations. DMS represents the world's leading IT brands and specializes in Systems Integration and Customized Software Solutions for Sri Lankan and overseas markets.

DMS is an equal opportunity employer that provides the excitement of working with the world's leading IT brands, financial solutions and learning from the most experienced managers and professionals in the IT industry.

DMS represents Diebold Nixdorf Inc. USA, the world leader in Automated Teller Machines (ATMs) and Bulk Cash Recyclers (CRMs / CDMs) and DMS-DN have implemented pioneering projects such as First Branch and Networked Bulk Cash Recyclers & Bulk Cash Depositories in Asia Pacific, First Envelope-less Bulk Cheque Deposit ATMs in Asia Pacific, First Networked Foreign Currency Conversion ATMs which accept foreign currency and dispense Sri Lanka Currency and Coins. DMS is the market leader supporting an installed base of over 2000 ATMs in Sri Lanka and the Maldives.

DMS also represents Entrust USA, The Global Leader in Identities, Payments and Data Protection (i.e. Secure ID's, Digital signature enablement, EMV Credit Cards, Debit Cards, Smart Cards, ePassports etc.).

DMS-Entrust has implemented pioneering projects such as First Turnkey (End-to-End) EMV Smart Card Solution in the region, First In-line Card Delivery and Envelope Insertion System in the region, First Modular/High Volume Card Issuance System in Sri Lanka, First In-House EMV Smart Card Issuance System in Sri Lanka, First and preferred vendor for Instant Insurance Policy Issuance Systems in Sri Lanka with over 90% Market Share, First Instantly Issued Loyalty Card Issuance System in Sri Lanka and the Largest Secure ID Solutions provider to Govt. and Corporate Sectors.

DMS is also the Sri Lankan partner for Panini S.p.A of Italy the world leader in distributed cheque processing systems. DMS has implemented many cheque truncation and postdated cheque management application systems in Sri Lanka.`,
    requirements: [
      "Working knowledge in C#, .NET Framework, Web Forms, JavaScript, HTML5, CSS3 and PostgreSQL",
      "A willingness to learn new things, and have the ability to UNDERSTAND PROGRAMMING LOGIC",
      "Strong ability to reverse engineer code and the ability to read and understand code written by others",
      "A good grasp of OOP design concepts and FUNCTIONAL programming concepts",
      "Ability to come up with own innovative ideas and find solutions to problems on their own",
      "Have the ability to interpret new SDK references and documentation",
      "Experience in using Linux and Microsoft Windows servers, drivers, their functions etc.",
      "Should possess the capacity to learn new syntaxes and other programming languages",
      "Ability to be trained to satisfy all other requirements",
    ],
    responsibilities: [
      "Customer requirement gathering",
      "Planning, Design and Implementation of software applications, including UI design and writing code according to given specifications",
      "Working as part of a team, which may be established purely for a particular project",
      "Preparing documentation for developed programs",
      "Testing sample data-sets to check that the program works as intended",
      "General IT related tasks",
    ],
    qualifications: {
      education: "Degree in Computer/Software from a recognized university",
      experience: "Similar Industry Experience",
      salaryRange: "Negotiable",
    },
    companyDescription: `Data Management Systems (Pvt) Ltd, (DMS) is a pioneering IT Company in Sri Lanka, now in its 45th year of operations. DMS represents the world's leading IT brands and specializes in Systems Integration and Customized Software Solutions for Sri Lankan and overseas markets.

DMS is an equal opportunity employer that provides the excitement of working with the world's leading IT brands, financial solutions and learning from the most experienced managers and professionals in the IT industry.

Career advancement is based on performance and merit and the following vacancies exist due to unprecedented growth in our ATM business.`,
    companySize: "500+ employees",
    companyWebsite: "https://www.dms.lk",
    industry: "IT Services and Consulting",
    postedDate: "2024-04-23",
    isSaved: false,
    isApplied: false,
  };
};

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchJob = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const jobId = parseInt(params.id as string);
        const jobData = getJobDetails(jobId);
        setJob(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold">View Job Post</h2>
        </div>

        <div className="space-y-6 p-4">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold">View Job Post</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">View Job Post</h2>
      </div>

      <div className="bg-primary/4 rounded-4xl p-4 border border-primary/14">
        <JobDetailsView job={job} />
      </div>
    </div>
  );
}
