// src/components/sections/Pricing.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, Shield } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";

interface PricingPlan {
  id: string;
  name: string;
  priceLKR: number;
  priceUSD: number;
  validity: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
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
  {
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
    popular: true,
    badge: "Most Popular",
  },
  {
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
  {
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
    badge: "Best Value",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function Pricing() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = (plan: PricingPlan) => {
    setSelectedPlan(plan.id);

    // Check if user is logged in
    if (!isAuthenticated) {
      toast.error("Please login to purchase a plan");
      // Store the plan to redirect back after login
      localStorage.setItem("purchase_plan", plan.id);
      router.push("/auth/login?redirect=/company/plans/checkout?plan=" + plan.id);
      return;
    }

    // Check if user is a company
    if (!(user?.role == "company" || user?.role == "dev")) {
        setSelectedPlan(null); // Reset selected plan
      toast.error("Only company accounts can purchase job posting plans");
      return;
    }

    // Proceed with purchase
    toast.success(`Redirecting to checkout for ${plan.name}...`);
    // Redirect to checkout page
    router.push(`/company/plans/checkout?plan=${plan.id}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8  bg-linear-to-t from-background/20 via-background-cold/50 to-background-cold">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your hiring needs. All plans include
            access to our powerful recruitment tools.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card
                className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 pt-0 ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "hover:shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`p-6 bg-linear-to-r ${plan.color} text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">
                      LKR {plan.priceLKR.toLocaleString()}
                    </span>
                    <p className="text-sm opacity-80 mt-1">
                      (${plan.priceUSD})
                    </p>
                  </div>
                  <span className="text-sm opacity-80">/ {plan.validity}</span>
                </div>

                {/* Plan Features */}
                <CardContent className="flex-1 flex flex-col p-6">
                  <div className="flex-1 space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <div className="mt-6">
                    {plan.popular && (
                      <p className="text-xs text-center text-muted-foreground mb-2">
                        Best value for growing companies
                      </p>
                    )}
                    <Button
                      onClick={() => handlePurchase(plan)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-primary/90 hover:bg-primary"
                      }`}
                      disabled={selectedPlan === plan.id}
                    >
                      {selectedPlan === plan.id ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        "Purchase Plan"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            All prices are in Sri Lankan Rupees (LKR) and US Dollars (USD).
            <br />
            Plans auto-renew unless cancelled. Contact us for enterprise
            customizations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
