import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useEffect, useRef, useState } from "react";

interface OptimizedAvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  height?: number;
  width?: number;
  className?: string;
  rounded?: boolean;
}

export function OptimizedAvatar({
  src,
  alt,
  fallback,
  height = 48,
  width = 48,
  className = "",
}: OptimizedAvatarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!avatarRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(avatarRef.current);

    return () => {
      if (avatarRef.current) {
        observer.unobserve(avatarRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const sizeStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  if (!src || hasError) {
    return (
      <Avatar className={`${className}`} style={sizeStyle}>
        <AvatarFallback className="bg-primary/10 text-primary">
          {fallback.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div ref={avatarRef} className={`relative ${className}`} style={sizeStyle}>
      <Avatar className="w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-full">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {isVisible && (
          <AvatarImage
            src={src}
            alt={alt || "Avatar"}
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <AvatarFallback className="bg-primary/10 text-primary">
          {fallback.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
