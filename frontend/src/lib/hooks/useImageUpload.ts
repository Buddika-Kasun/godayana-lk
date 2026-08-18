import { useState } from "react";
import { compressImage, getImagePreview } from "@/lib/utils/imageCompression";
import toast from "react-hot-toast";

interface UseImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
  autoCompress?: boolean;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.7,
    maxSizeMB = 5,
    autoCompress = true,
  } = options;

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return null;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be less than 20MB");
      return null;
    }

    setOriginalFile(file);
    setIsCompressing(true);

    try {
      let finalFile = file;

      // Auto compress if enabled and file is large
      if (autoCompress && file.size > 1 * 1024 * 1024) {
        const compressed = await compressImage(file, {
          maxWidth,
          maxHeight,
          quality,
          maxSizeMB,
        });
        finalFile = compressed;
        setCompressedFile(compressed);
        toast.success(
          `Image compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`,
        );
      }

      // Generate preview
      const previewUrl = await getImagePreview(finalFile);
      setPreview(previewUrl);

      return finalFile;
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Failed to process image");
      return null;
    } finally {
      setIsCompressing(false);
    }
  };

  const reset = () => {
    setOriginalFile(null);
    setCompressedFile(null);
    setPreview("");
    setUploadProgress(0);
  };

  return {
    originalFile,
    compressedFile,
    preview,
    isCompressing,
    uploadProgress,
    setUploadProgress,
    handleFileSelect,
    reset,
  };
};
