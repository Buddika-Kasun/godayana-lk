// src/app/company/plans/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle,
  Loader2,
  Zap,
  Sparkles,
  Crown,
  Shield,
  DollarSign,
  Construction,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  id: string;
  name: string;
  priceLKR: number;
  priceUSD: number;
  validity: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const pricingPlans: Record<string, PricingPlan> = {
  starter: {
    id: "starter",
    name: "Starter Plan",
    priceLKR: 3500,
    priceUSD: 25,
    validity: "30 Days",
    features: [
      "1 Job Advertisement",
      "Employer Dashboard",
      "ATS",
      "Candidate Filtering",
      "Application Management",
      "Unlimited filtered CVs",
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
  },
  growth: {
    id: "growth",
    name: "Growth Plan",
    priceLKR: 15000,
    priceUSD: 99,
    validity: "6 Months",
    features: [
      "Up to 5 Job Advertisements",
      "Employer Dashboard",
      "ATS",
      "Candidate Filtering",
      "Application Management",
      "Social Media Publishing",
      "Unlimited filtered CVs",
    ],
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
  },
  professional: {
    id: "professional",
    name: "Professional Plan",
    priceLKR: 25000,
    priceUSD: 169,
    validity: "12 Months",
    features: [
      "Up to 10 Job Advertisements",
      "Employer Dashboard",
      "ATS",
      "Advanced Filtering",
      "Interview Notes",
      "Application Management",
      "Social Media Publishing",
      "Featured Employer Badge",
      "Recruitment Analytics Dashboard",
      "Unlimited filtered CVs",
    ],
    icon: <Crown className="h-6 w-6" />,
    color: "from-amber-500 to-amber-600",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Plan",
    priceLKR: 45000,
    priceUSD: 299,
    validity: "12 Months",
    features: [
      "Unlimited Job Advertisements",
      "Employer Dashboard",
      "ATS",
      "Advanced Candidate Filtering",
      "Interview Notes",
      "Candidate Profile",
      "Application Reporting",
      "Social Media Publishing",
      "Featured Employer Badge",
      "Priority Listing Placement",
      "Analytics Dashboard",
      "Dedicated Support",
      "Unlimited filtered CVs",
    ],
    icon: <Shield className="h-6 w-6" />,
    color: "from-emerald-500 to-emerald-600",
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const planId = searchParams.get("plan") || "starter";

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const plan = pricingPlans[planId] || pricingPlans.starter;

  // Redirect if not authenticated or not company
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/company/plans/checkout?plan=" + planId);
      return;
    }
    if (!(user?.role == "company" || user?.role == "dev")) {
      toast.error("Only company accounts can purchase plans");
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = "Expiry date is required";
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Successfully purchased ${plan.name}!`);
      router.push("/company/dashboard");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      if (value.length >= 2) {
        setFormData({
          ...formData,
          expiryMonth: value.slice(0, 2),
          expiryYear: value.slice(2, 4),
        });
      } else {
        setFormData({ ...formData, expiryMonth: value, expiryYear: "" });
      }
    }
  };

  const getExpiryDisplay = () => {
    if (formData.expiryMonth || formData.expiryYear) {
      return `${formData.expiryMonth}${formData.expiryYear ? `/${formData.expiryYear}` : ""}`;
    }
    return "";
  };

  // Get current year and month for expiry validation
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  const isExpiryValid = () => {
    if (!formData.expiryMonth || !formData.expiryYear) return true;
    const month = parseInt(formData.expiryMonth);
    const year = parseInt(formData.expiryYear);
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    return true;
  };

  if (!isAuthenticated || !(user?.role == "company" || user?.role == "dev")) {
    return null;
  }

  return (
    // <div className="min-h-screen bg-background py-2 px-4 sm:px-6 lg:px-4 xl:px-8">
      <div className="space-y-2 p-0">
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
          <h2 className="text-xl font-bold">Checkout</h2>
        </div>

        <div className="relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 backdrop-blur-xs z-10 rounded-xl flex flex-col items-center pt-20 border border-black/10">
            <div className="text-center max-w-md px-6 py-8 rounded-lg shadow-lg bg-background/80  border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-4">
                We&apos;re working hard to bring you a seamless payment
                experience.
              </p>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Under Development
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pt-1 pb-4">
            {/* <div className=""/> make this as overlay */}
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  {/* Plan Details */}
                  <div
                    className={`bg-linear-to-r ${plan.color} p-4 rounded-lg text-white mb-4`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm opacity-80">{plan.validity}</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-2xl font-bold">
                        LKR {plan.priceLKR.toLocaleString()}
                      </span>
                      <span className="text-sm opacity-80">
                        (USD {plan.priceUSD})
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm">
                      What&apos;s included:
                    </h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      LKR {plan.priceLKR.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    Including all taxes and fees
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Name */}
                    <div>
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-semibold"
                      >
                        Company Name
                      </Label>
                      <div className="relative mt-1.5">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          value={user?.name || ""}
                          readOnly
                          className="pl-10 bg-muted/50"
                        />
                      </div>
                    </div>

                    {/* Card Number */}
                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="text-sm font-semibold"
                      >
                        Card Number
                      </Label>
                      <div className="relative mt-1.5">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(formData.cardNumber)}
                          onChange={handleCardNumberChange}
                          className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                          maxLength={19}
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Card Holder */}
                    <div>
                      <Label
                        htmlFor="cardHolder"
                        className="text-sm font-semibold"
                      >
                        Card Holder Name
                      </Label>
                      <Input
                        id="cardHolder"
                        type="text"
                        placeholder="John Doe"
                        value={formData.cardHolder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardHolder: e.target.value,
                          })
                        }
                        className={`mt-1.5 ${errors.cardHolder ? "border-red-500" : ""}`}
                      />
                      {errors.cardHolder && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.cardHolder}
                        </p>
                      )}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="expiry"
                          className="text-sm font-semibold"
                        >
                          Expiry Date
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="expiry"
                            type="text"
                            placeholder="MM/YY"
                            value={getExpiryDisplay()}
                            onChange={handleExpiryChange}
                            className={`pl-10 ${errors.expiry ? "border-red-500" : ""}`}
                            maxLength={5}
                          />
                        </div>
                        {errors.expiry && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.expiry}
                          </p>
                        )}
                        {!isExpiryValid() &&
                          formData.expiryMonth &&
                          formData.expiryYear && (
                            <p className="text-xs text-red-500 mt-1">
                              Card has expired
                            </p>
                          )}
                      </div>

                      <div>
                        <Label htmlFor="cvv" className="text-sm font-semibold">
                          CVV
                        </Label>
                        <div className="relative mt-1.5">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) =>
                              setFormData({ ...formData, cvv: e.target.value })
                            }
                            className={`pl-10 ${errors.cvv ? "border-red-500" : ""}`}
                            maxLength={4}
                            inputMode="numeric"
                          />
                        </div>
                        {errors.cvv && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full text-lg py-6"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Pay LKR {plan.priceLKR.toLocaleString()}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Your payment is secure and encrypted. We do not store
                        your card details.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}
