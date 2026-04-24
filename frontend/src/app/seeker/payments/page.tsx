// src/app/seeker/payments/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Payment {
  id: number;
  title: string;
  type: "course" | "visa" | "gateway";
  paymentMethod: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  receiptUrl?: string;
}

// Mock data - replace with API call
const allPayments: Payment[] = [
  {
    id: 1,
    title: "Full Stack Web Development Bootcamp",
    type: "course",
    paymentMethod: "Credit Card",
    date: "2025-01-15",
    amount: 75000,
    status: "completed",
  },
  {
    id: 2,
    title: "Work Visa - UAE",
    type: "visa",
    paymentMethod: "Bank Transfer",
    date: "2025-12-20",
    amount: 85000,
    status: "completed",
  },
  {
    id: 3,
    title: "IELTS Preparation",
    type: "course",
    paymentMethod: "Credit Card",
    date: "2025-12-10",
    amount: 45000,
    status: "pending",
  },
  {
    id: 4,
    title: "Canada Express Entry",
    type: "visa",
    paymentMethod: "Credit Card",
    date: "2025-11-05",
    amount: 120000,
    status: "completed",
  },
  {
    id: 5,
    title: "Global Career Gateway",
    type: "gateway",
    paymentMethod: "PayPal",
    date: "2025-10-20",
    amount: 55000,
    status: "refunded",
  },
  {
    id: 6,
    title: "Digital Marketing Masterclass",
    type: "course",
    paymentMethod: "Credit Card",
    date: "2025-09-15",
    amount: 35000,
    status: "completed",
  },
  {
    id: 7,
    title: "UK Skilled Worker Visa",
    type: "visa",
    paymentMethod: "Bank Transfer",
    date: "2025-08-10",
    amount: 95000,
    status: "refunded",
  },
  {
    id: 8,
    title: "Canada Express Entry",
    type: "visa",
    paymentMethod: "Credit Card",
    date: "2025-11-05",
    amount: 120000,
    status: "completed",
  },
  {
    id: 9,
    title: "Global Career Gateway",
    type: "gateway",
    paymentMethod: "PayPal",
    date: "2025-10-20",
    amount: 55000,
    status: "refunded",
  },
  {
    id: 10,
    title: "Digital Marketing Masterclass",
    type: "course",
    paymentMethod: "Credit Card",
    date: "2025-09-15",
    amount: 35000,
    status: "completed",
  },
  {
    id: 11,
    title: "UK Skilled Worker Visa",
    type: "visa",
    paymentMethod: "Bank Transfer",
    date: "2025-08-10",
    amount: 95000,
    status: "refunded",
  },
];

const getStatusConfig = (status: Payment["status"]) => {
  const config = {
    completed: {
      label: "Complete",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: AlertCircle,
    },
    refunded: {
      label: "Refunded",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: CheckCircle,
    },
  };
  return config[status];
};

const getTypeLabel = (type: Payment["type"]) => {
  switch (type) {
    case "course":
      return "Course";
    case "visa":
      return "Visa Service";
    case "gateway":
      return "Gateway";
  }
};

export default function SeekerPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "completed" | "refunded"
  >("all");
  const itemsPerPage = 10;

  // Filter payments based on status
  const getFilteredPayments = () => {
    if (activeFilter === "completed") {
      return allPayments.filter((p) => p.status === "completed");
    }
    if (activeFilter === "refunded") {
      return allPayments.filter((p) => p.status === "refunded");
    }
    return allPayments;
  };

  const filteredPayments = getFilteredPayments();
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = allPayments.length;
  const completedCount = allPayments.filter(
    (p) => p.status === "completed",
  ).length;
  const refundedCount = allPayments.filter(
    (p) => p.status === "refunded",
  ).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadReceipt = (paymentId: number) => {
    toast.success("Receipt downloaded");
    // Implement actual receipt download logic
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            {/* <h2 className="text-2xl font-bold text-foreground">All Payments</h2> */}
            <p className="text-sm text-muted-foreground mt-1">
              View your payment history and download receipts
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("completed");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "completed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <CheckCircle size={16} /> */}
                Completed{" "}
                <span className="hidden md:inline-block">
                  ({completedCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("refunded");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                  activeFilter === "refunded"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <AlertCircle size={16} /> */}
                Refunded{" "}
                <span className="hidden md:inline-block">
                  ({refundedCount})
                </span>
              </button>
            </div>
          </div>

          {/* Refund Policy Section */}
          {activeFilter === "all" && (
            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText
                    className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Refund Policy
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                      <li>
                        • Course/Visa/Gateway enrollment: Refundable only before
                        process initiation
                      </li>
                      <li>
                        • Job posting &amp; ads: Non-refundable once activated
                      </li>
                      <li>
                        • Refunds processed to original payment method within 7-14
                        business days
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments List */}
          <div className="flex-1 space-y-4">
            {currentPayments.map((payment) => {
              const statusConfig = getStatusConfig(payment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {payment.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(payment.type)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            {formatAmount(payment.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CreditCard size={14} />
                          {payment.paymentMethod}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(payment.date)}
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-row md:flex-col items-center gap-3">
                      <Badge
                        className={`${statusConfig.color} flex items-center gap-1 px-3 py-1`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </Badge>
                      {payment.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="gap-2"
                        >
                          <Download size={14} />
                          Receipt
                        </Button>
                      )}
                      {payment.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="gap-2 opacity-50"
                        >
                          <Clock size={14} />
                          Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentPayments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "completed"
                    ? "No completed payments found"
                    : activeFilter === "refunded"
                      ? "No refunded payments found"
                      : "No payments found"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} payments
              </div>
            </div>
          )}

          {/* Refund Policy Section */}
          {/* <div className="mt-8 pt-6 border-t">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText
                  className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Refund Policy
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                    <li>
                      • Course/Visa/Gateway enrollment: Refundable only before
                      process initiation
                    </li>
                    <li>
                      • Job posting &amp; ads: Non-refundable once activated
                    </li>
                    <li>
                      • Refunds processed to original payment method within 7-14
                      business days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
