// src/components/admin/content/CountryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Upload,
  Loader2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading,
  Quote,
  DollarSign,
  Briefcase,
  ArrowRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo2,
  Redo2,
  Eraser,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import adminContentEndpoints, {
  CountryRequest,
  CountryResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Country options
const countryOptions = [
  "Japan",
  "United Kingdom",
  "Australia",
  "Canada",
  "USA",
  "Germany",
  "France",
  "Italy",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "Sweden",
  "UAE",
  "Qatar",
  "Singapore",
  "Other",
];

// Visa type options
const visaTypeOptions = [
  { value: "STUDENT", label: "Student Visa" },
  { value: "WORK", label: "Work Visa" },
  { value: "VISIT", label: "Visit Visa" },
  { value: "SSW", label: "Specified Skilled Worker (SSW)" },
  { value: "BUSINESS", label: "Business Visa" },
  { value: "FAMILY", label: "Family Visa" },
  { value: "OTHER", label: "Other" },
];

interface CountryFormProps {
  initialData?: CountryResponse | null;
  isEditing?: boolean;
  countryId?: string;
  setIsLoadingFun?: (loading: boolean) => void;
}

// Custom CSS for the editor
const editorStyles = `
  .tiptap-editor-content {
    min-height: 200px;
    padding: 1rem;
    outline: none;
    font-size: 1rem;
    line-height: 1.75;
  }
  
  .tiptap-editor-content ul,
  .tiptap-editor-content ol {
    padding-left: 1.5rem;
    margin: 0.75rem 0;
  }
  
  .tiptap-editor-content ul {
    list-style-type: disc;
  }
  
  .tiptap-editor-content ul ul {
    list-style-type: circle;
  }
  
  .tiptap-editor-content ul ul ul {
    list-style-type: square;
  }
  
  .tiptap-editor-content ol {
    list-style-type: decimal;
  }
  
  .tiptap-editor-content ol ol {
    list-style-type: lower-alpha;
  }
  
  .tiptap-editor-content ol ol ol {
    list-style-type: lower-roman;
  }
  
  .tiptap-editor-content h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0.75rem 0;
    line-height: 1.2;
  }
  
  .tiptap-editor-content h2 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 0.75rem 0;
    line-height: 1.3;
  }
  
  .tiptap-editor-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.75rem 0;
    line-height: 1.4;
  }
  
  .tiptap-editor-content h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.75rem 0;
    line-height: 1.4;
  }
  
  .tiptap-editor-content h5 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0.75rem 0;
    line-height: 1.4;
  }
  
  .tiptap-editor-content h6 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.75rem 0;
    line-height: 1.4;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .tiptap-editor-content blockquote {
    border-left: 4px solid #3b82f6;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0;
    font-style: italic;
    background: #f8fafc;
    border-radius: 0.25rem;
  }
  
  .tiptap-editor-content p {
    margin: 0.5rem 0;
  }
  
  .tiptap-editor-content a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .tiptap-editor-content a:hover {
    color: #2563eb;
  }
  
  .tiptap-editor-content [style*="text-align: center"] {
    text-align: center;
  }
  
  .tiptap-editor-content [style*="text-align: right"] {
    text-align: right;
  }
  
  .tiptap-editor-content [style*="text-align: left"] {
    text-align: left;
  }
  
  .tiptap-editor-content [style*="text-align: justify"] {
    text-align: justify;
  }
  
  .tiptap-editor-content hr {
    margin: 1.5rem 0;
    border: 0;
    border-top: 2px solid #e5e7eb;
  }
  
  .tiptap-editor-content code {
    background: #f1f5f9;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .tiptap-editor-content pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    margin: 0.5rem 0;
  }
  
  .tiptap-editor-content pre code {
    background: transparent;
    padding: 0;
    color: inherit;
  }
  
  .tiptap-editor-content strong {
    font-weight: 700;
  }
  
  .tiptap-editor-content em {
    font-style: italic;
  }
  
  .tiptap-editor-content u {
    text-decoration: underline;
  }
  
  .tiptap-editor-content mark {
    background: #ffff00;
    padding: 0.125rem 0.25rem;
    border-radius: 0.125rem;
  }
  
  .tiptap-editor-content .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
  }
`;

// Rich Text Editor Toolbar
const Toolbar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const getHeadingLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("heading", { level: 4 })) return "Heading 4";
    if (editor.isActive("heading", { level: 5 })) return "Heading 5";
    if (editor.isActive("heading", { level: 6 })) return "Heading 6";
    if (editor.isActive("paragraph")) return "Paragraph";
    return "Normal";
  };

  const headingLevels = [
    { level: 1 as const, label: "Heading 1" },
    { level: 2 as const, label: "Heading 2" },
    { level: 3 as const, label: "Heading 3" },
    { level: 4 as const, label: "Heading 4" },
    { level: 5 as const, label: "Heading 5" },
    { level: 6 as const, label: "Heading 6" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 rounded-t-lg sticky top-0 z-10">
      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Heading Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-8 px-2 rounded-md flex items-center gap-1 text-sm font-medium hover:bg-muted transition-colors"
          >
            {getHeadingLabel()}
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>
          {headingLevels.map(({ level, label }) => (
            <DropdownMenuItem
              key={level}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
              className={
                editor.isActive("heading", { level }) ? "bg-muted" : ""
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("bold")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("italic")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("underline")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("bulletList")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("orderedList")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Blockquote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("blockquote")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Quote Block"
      >
        <Quote className="h-4 w-4" />
      </button>

      {/* Horizontal Rule */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors hover:bg-muted"
        title="Horizontal Line"
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Link */}
      <button
        type="button"
        onClick={setLink}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive("link")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Insert Link (Ctrl+K)"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      {/* Clear Formatting */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors hover:bg-muted"
        title="Clear Formatting"
      >
        <Eraser className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Color */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            editor.chain().focus().setColor(target.value).run();
          }}
          className="h-6 w-6 p-0 rounded border cursor-pointer"
          defaultValue="#000000"
          title="Text Color"
        />
      </div>

      {/* Highlight Color */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            editor.chain().focus().setHighlight({ color: target.value }).run();
          }}
          className="h-6 w-6 p-0 rounded border cursor-pointer"
          defaultValue="#ffff00"
          title="Highlight Color"
        />
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive({ textAlign: "left" })
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive({ textAlign: "center" })
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive({ textAlign: "right" })
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </button>
    </div>
  );
};

export function CountryForm({
  initialData,
  isEditing,
  countryId,
  setIsLoadingFun,
}: CountryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<CountryResponse>>({
    id: initialData?.id,
    name: initialData?.name || "",
    otherCountry: initialData?.otherCountry || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    salary: initialData?.salary || "",
    visaType: initialData?.visaType || "",
    imageUrl: initialData?.imageUrl || "",
    imageKey: initialData?.imageKey || "",
  });

  // Image states
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [imageKey, setImageKey] = useState<string>(initialData?.imageKey || "");

  // Editor with proper configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: "Write detailed information about the country...",
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      ImageExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content: formData.description || "",
    onUpdate: ({ editor }) => {
      // Only update formData when content changes, not on selection
      const html = editor.getHTML();
      if (html !== formData.description) {
        setFormData((prev) => ({ ...prev, description: html }));
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // This triggers when selection changes - toolbar will update automatically
      // Force a re-render of the toolbar by updating a state
      // The toolbar already uses editor.isActive() which reacts to selection changes
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  // Remove the useEffect that syncs editor content with formData
  // This was causing the feedback loop

  // Fetch country data if editing
  useEffect(() => {
    const fetchCountryData = async () => {
      if (!isEditing || !countryId || initialData) return;

      if (setIsLoadingFun) {
        setIsLoadingFun(true);
      }
      setIsLoading(true);

      try {
        const response =
          await adminContentEndpoints.country.getCountryById(countryId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const country = apiResponse.data;
          setFormData(country);
          setImageUrl(country.imageUrl || "");
          setImageKey(country.imageKey || "");
          if (editor) {
            editor.commands.setContent(country.description || "");
          }
        } else {
          toast.error(apiResponse.message || "Failed to load country");
        }
      } catch (error) {
        console.error("Error fetching country:", error);
        toast.error("Failed to load country details");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
        if (setIsLoadingFun) {
          setIsLoadingFun(false);
        }
      }
    };

    fetchCountryData();
  }, [isEditing, countryId, initialData, router, setIsLoadingFun, editor]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await adminContentEndpoints.country.uploadImage(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setImageUrl(fileUrl);
        setImageKey(fileKey);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(apiResponse.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageKey("");
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      toast.error("Country name is required");
      return false;
    }
    if (formData.name === "Other" && !formData.otherCountry?.trim()) {
      toast.error("Please specify the country");
      return false;
    }
    if (!formData.shortDescription?.trim()) {
      toast.error("Short description is required");
      return false;
    }
    if (!formData.salary) {
      toast.error("Salary range is required");
      return false;
    }
    if (!formData.visaType) {
      toast.error("Visa type is required");
      return false;
    }
    if (!formData.description || formData.description === "<p></p>") {
      toast.error("Detailed description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const finalName =
        formData.name === "Other" ? formData.otherCountry : formData.name;

      const requestData: CountryRequest = {
        name: finalName!,
        shortDescription: formData.shortDescription!,
        description: formData.description!,
        salary: formData.salary!,
        visaType: formData.visaType!,
        imageKey: imageKey || "",
      };

      if (isEditing && countryId) {
        await adminContentEndpoints.country.updateCountry(
          countryId,
          requestData,
        );
        toast.success("Country updated successfully!");
      } else {
        await adminContentEndpoints.country.createCountry(requestData);
        toast.success("Country created successfully!");
      }

      router.push("/admin/content");
    } catch (error) {
      console.error("Error saving country:", error);
      toast.error("Failed to save country");
    } finally {
      setIsLoading(false);
    }
  };

  // Preview data
  const previewData = {
    name:
      formData.name === "Other"
        ? formData.otherCountry
        : formData.name || "Country Name",
    shortDescription:
      formData.shortDescription || "Short description will appear here...",
    salary: formData.salary || "Salary range",
    visaType: formData.visaType || "Visa Type",
    imageUrl: imageUrl,
    description: formData.description || "",
  };

  const getVisaTypeLabel = (value: string) => {
    const found = visaTypeOptions.find((v) => v.value === value);
    return found?.label || value;
  };

  // Show loading while editor is initializing
  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Force toolbar update when selection changes
  // This is handled by the editor's built-in reactivity

  return (
    <>
      {/* Inject custom styles */}
      <style>{editorStyles}</style>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Top Section: Form Fields (Left) + Preview Card (Right) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Fields */}
          <div className="flex-1 space-y-6">
            {/* Country Name & Visa Type */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Label className="text-sm font-semibold">
                  Country Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.name}
                  onValueChange={(value) => {
                    setFormData({ ...formData, name: value });
                  }}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label className="text-sm font-semibold">
                  Visa Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.visaType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, visaType: value })
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Other Country Input - Shows when "Other" is selected */}
            {formData.name === "Other" && (
              <div>
                <Label className="text-sm font-semibold">
                  Please specify country <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.otherCountry || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, otherCountry: e.target.value })
                  }
                  placeholder="Enter country name"
                  className="mt-1.5"
                />
              </div>
            )}

            {/* Short Description */}
            <div>
              <Label className="text-sm font-semibold">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.shortDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Brief description of the country's opportunities..."
                rows={2}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will appear as a preview on the country card
              </p>
            </div>

            {/* Salary */}
            <div>
              <Label className="text-sm font-semibold">
                Salary Range <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.salary || ""}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                placeholder="e.g., LKR 280,000 - 450,000"
                className="mt-1.5"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-semibold">Country Image</Label>
              <div className="mt-2">
                {imageUrl ? (
                  <div className="relative inline-block">
                    <div className="relative w-40 h-40">
                      <Image
                        src={imageUrl}
                        alt="Country image"
                        fill
                        className="rounded-lg object-cover border"
                        unoptimized={!imageUrl.startsWith("http")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 ${
                      isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            Uploading...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload country image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG (Max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Preview Card - Right Side */}
          <div className="lg:w-100 shrink-0">
            <div className="sticky top-24">
              <Label className="text-sm font-semibold block mb-3">
                Live Preview
              </Label>
              <Card className="h-full pt-0 overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                {/* Country Image with Overlay */}
                <div className="relative h-60 overflow-hidden">
                  {previewData.imageUrl ? (
                    <Image
                      src={previewData.imageUrl}
                      alt={previewData.name!}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={!previewData.imageUrl.startsWith("http")}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-700 opacity-90">
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  )}

                  {/* Country Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-10 bg-linear-to-t from-background/90 via-background/50 to-transparent">
                    <h3 className="text-2xl font-bold dark:text-white/95 text-background drop-shadow-xl">
                      {previewData.name}
                    </h3>
                  </div>

                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                  </div>
                </div>

                <CardContent className="px-5 flex flex-col h-full pt-4">
                  <div className="flex-1">
                    {/* Description */}
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {previewData.shortDescription}
                    </p>

                    {/* Salary */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Avg. Salary
                        </span>
                        <span className="text-sm font-semibold">
                          {previewData.salary}
                        </span>
                      </div>
                    </div>

                    {/* Visa Type */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Visa Type
                        </span>
                        <span className="text-sm font-medium">
                          {getVisaTypeLabel(previewData.visaType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Always at bottom */}
                  <div className="mt-auto pt-2">
                    <Link
                      href="#"
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/link transition-colors"
                    >
                      <span>View Details</span>
                      <span className="inline-block ml-2 transition-transform group-hover/link:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Section: Detailed Description Editor - Full Width */}
        <div className="w-full">
          <Label className="text-sm font-semibold">
            Detailed Description <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1.5 border rounded-lg overflow-hidden">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Use the toolbar to format text, add lists, links, colors, and more
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Country" : "Create Country"}</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/content")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
