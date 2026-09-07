// src/app/company/jobs/create/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JobForm } from "@/components/company/jobs/JobForm";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PostJobPage() {
  const router = useRouter();
  const [availableJobSlots, setAvailableJobSlots] = useState<number>(0);

  return (
    <div className="space-y-2">
      {/* Back Button */}
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
        <h2 className="text-xl font-bold">Post a New Job</h2>
      </div>

      {/* Available Slots Warning */}
      {availableJobSlots === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 px-4 py-3 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                No Job Slots Available
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Purchase a plan or renew your current plan to continue.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/company/plans">
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Purchase Plan
              </Button>
            </Link>
            <Link href="/company/plans">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Renew Plan
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold text-green-600 dark:text-green-300">
            Available Job Slots:{" "}
            <span className="text-2xl">{availableJobSlots}</span>
          </p>
        </div>
      )}

      <Card
        className={`bg-primary/4 ${availableJobSlots === 0 ? "pointer-events-none select-none opacity-40 border" : ""}`}
      >
        <CardContent className="px-6 pb-6">
          <JobForm />
        </CardContent>
      </Card>
    </div>
  );
}
