// src/app/admin/content/stories/create/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { StoryForm } from "@/components/admin/content/StoryForm";

export default function CreateVisaPage() {
  const router = useRouter();

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
        <h2 className="text-xl font-bold">Create New Story</h2>
      </div>

      <Card className="bg-primary/4 p-0">
        <CardContent className="px-6 py-6">
          <StoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
