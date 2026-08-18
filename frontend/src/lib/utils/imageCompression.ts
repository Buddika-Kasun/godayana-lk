/**
 * Image compression utility for reducing image file sizes before upload
 */

interface CompressionOptions {
  maxWidth?: number; // Maximum width in pixels
  maxHeight?: number; // Maximum height in pixels
  quality?: number; // JPEG quality (0-1)
  maxSizeMB?: number; // Maximum file size in MB
  outputType?: "image/jpeg" | "image/png" | "image/webp";
}

/**
 * Compress an image file to reduce size
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {},
): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.7,
    maxSizeMB = 5,
    outputType = "image/jpeg",
  } = options;

  // If file is already small enough, return it
  if (file.size / (1024 * 1024) <= maxSizeMB) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          // Scale down if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Create canvas and draw image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Draw image with smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Blob creation failed"));
                return;
              }

              // Get the original file extension
              const originalName = file.name;
              const nameWithoutExt = originalName.replace(/\.[^.]+$/, "");

              // Determine output extension
              let ext = ".jpg";
              if (outputType === "image/png") ext = ".png";
              else if (outputType === "image/webp") ext = ".webp";

              // Create new file with compressed data
              const compressedFile = new File(
                [blob],
                `${nameWithoutExt}_compressed${ext}`,
                { type: outputType },
              );

              console.log(`✅ Compression successful:`);
              console.log(`   Original: ${(file.size / 1024).toFixed(1)}KB`);
              console.log(
                `   Compressed: ${(compressedFile.size / 1024).toFixed(1)}KB`,
              );
              console.log(
                `   Reduction: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`,
              );

              resolve(compressedFile);
            },
            outputType,
            quality,
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
};

/**
 * Compress image with fallback options
 */
export const compressImageWithFallback = async (
  file: File,
  options: CompressionOptions = {},
): Promise<File> => {
  try {
    // Try with default options first
    return await compressImage(file, options);
  } catch (error) {
    console.warn("Compression failed, trying with lower quality:", error);

    // Fallback with lower quality
    return await compressImage(file, {
      ...options,
      quality: 0.5,
      maxWidth: 800,
      maxHeight: 800,
    });
  }
};

/**
 * Get a preview URL for the compressed image
 */
export const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image"));
  });
};
