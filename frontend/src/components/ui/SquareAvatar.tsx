// src/components/ui/SquareAvatar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SquareAvatarProps {
  src?: string;
  alt?: string;
  fallback: string | React.ReactNode;
  size?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function SquareAvatar({
  src,
  alt = "Avatar",
  fallback,
  size = 48,
  className = "",
  onLoad,
  onError,
}: SquareAvatarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const containerClass = cn(
    "relative flex-shrink-0 overflow-hidden bg-muted rounded-lg",
    className,
  );

  const renderFallback = () => {
    if (typeof fallback === "string") {
      return (
        <span className="text-lg font-semibold text-primary">
          {fallback.charAt(0).toUpperCase()}
        </span>
      );
    }
    return fallback;
  };

  if (!src || hasError) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center bg-primary/10 rounded-lg",
          className,
        )}
        style={sizeStyle}
      >
        {renderFallback()}
      </div>
    );
  }

  return (
    <div ref={ref} className={containerClass} style={sizeStyle}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          quality={80}
          unoptimized={false}
        />
      )}

      {(!isVisible || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
          {/* {renderFallback()} */}
        </div>
      )}

      {isLoading && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
