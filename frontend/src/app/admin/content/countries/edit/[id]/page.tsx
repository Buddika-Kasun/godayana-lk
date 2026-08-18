// src/app/admin/content/visas/edit/[id]/page.tsx
"use client";

import { use, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisaForm } from "@/components/admin/content/VisaForm";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { CountryForm } from "@/components/admin/content/CountryForm";

interface EditVisaPageProps {
  params: Promise<{ id: string }>;
}

export default function EditVisaPage({ params }: EditVisaPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);

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
        <h2 className="text-xl font-bold">Edit Country</h2>
      </div>

      <Card className="bg-primary/4 relative p-0">
        {isLoading && (
          <div className="absolute w-full backdrop-blur-xs h-full z-10 pt-60 md:pt-40">
            <SubLoadingScreen
              message="Loading job details..."
              fullScreen={false}
            />
          </div>
        )}
        <CardContent className="px-6 py-6">
          <CountryForm
            isEditing={true}
            countryId={id}
            setIsLoadingFun={setIsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
