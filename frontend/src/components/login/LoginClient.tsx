"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [ isLoading, setIsloading ] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const redirectTo = searchParams.get("redirect") || "/";

  // Simple: if starts with 0, replace with +94
  const formatPhoneNumber = (value: string): string => {
    if (value.startsWith("0")) {
      return "+94" + value.substring(1);
    }
    return value;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    let processedValue = rawValue;

    // Check if it's a phone number (starts with 0) and not email
    if (rawValue.startsWith("0") && !rawValue.includes("@")) {
      processedValue = formatPhoneNumber(rawValue);
    }

    setFormData((prev) => ({ ...prev, identifier: processedValue }));

    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: "" }));
    }
  };

  const validateIdentifier = (identifier: string) => {
    if (!identifier) return "Email or phone number is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+94\d{9}$/;

    if (identifier.includes("@")) {
      if (!emailRegex.test(identifier)) {
        return "Please enter a valid email address";
      }
    } else if (!phoneRegex.test(identifier)) {
      return "Please enter a valid phone number (e.g., +94712345678)";
    }

    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "identifier":
        return validateIdentifier(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "identifier") {
      handleIdentifierChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);
    
    const newErrors: Record<string, string> = {};
    if (identifierError) newErrors.identifier = identifierError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    setTouched({ identifier: true, password: true });
    
    if (Object.keys(newErrors).length === 0) {
      const loadingToast = toast.loading("Logging in...");
      
      try {
        setIsloading(true);

        let submitIdentifier = formData.identifier;

        // Ensure +94 format
        if (submitIdentifier && !submitIdentifier.includes("@")) {
          if (submitIdentifier.startsWith("0")) {
            submitIdentifier = "+94" + submitIdentifier.substring(1);
          } else if (!submitIdentifier.startsWith("+")) {
            submitIdentifier = "+94" + submitIdentifier;
          }
        }

        await login(submitIdentifier, formData.password);

        toast.dismiss(loadingToast);
        // setIsloading(false);
        const toastId = toast.success("Login successful!");
        setFormData({ identifier: "", password: "" });

        setTimeout(() => {
          toast.dismiss(toastId);
          // router.push(redirectTo);
          const url = new URL(redirectTo, window.location.origin);
          // url.searchParams.set("login_success", "true");
          // router.push(url.toString());
          window.location.href = url.toString();
        }, 1000);

        // const url = new URL(redirectTo, window.location.origin);
        // url.searchParams.set("login_success", "true");
        // window.location.href = url.toString();
      } catch (error) {
        // setIsloading(false);
        toast.dismiss(loadingToast);

        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Login failed. Please try again.";

        toast.error(errorMessage);
      }
      finally {
        setIsloading(false);
      }
    }
  };

  const gotoRegister = () => {
    const url = new URL("/auth/register", window.location.origin);
    if (redirectTo) {
      url.searchParams.set("redirect", redirectTo);
    }
    window.location.href = url.toString();
  };

  const getIdentifierIcon = () => {
    if (formData.identifier.includes("@")) {
      return <Mail size={18} />;
    } else if (formData.identifier.length > 0) {
      return <Phone size={18} />;
    }
    return <Mail size={18} />;
  };

  return (
    <>
      <Toaster />
      <div className="pt-22 pb-20 bg-primary/10 flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Enter your details to access your account
            </p>
            {redirectTo && (
              <p className="text-xs text-primary/70 mt-2">
                Please login to continue to the requested page
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary/80 block">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/60">
                  {getIdentifierIcon()}
                </div>
                <input
                  type="text"
                  name="identifier"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-primary/20 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all text-primary ${
                    touched.identifier && errors.identifier
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder="e.g. john@example.com or 0712345678"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
              </div>
              {touched.identifier && errors.identifier && (
                <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-primary/80 block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary/70 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/60">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className={`w-full pl-10 pr-12 py-3 bg-primary/20 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all text-primary ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/60 hover:text-primary"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary/80 text-white py-3.5 rounded-xl font-bold hover:bg-primary cursor-pointer transform active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-primary/20 pt-6">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={gotoRegister}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
