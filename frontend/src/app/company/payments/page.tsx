// src/app/company/payments/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  CheckCircle,
  FileText,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Payment {
  id: number;
  title: string;
  type: "job_posting" | "featured_ad";
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  recipient: string;
  description?: string;
}

// Mock data - replace with API call
const allPayments: Payment[] = [
  {
    id: 1,
    title: "Job Posting - Senior Software Engineer",
    type: "job_posting",
    date: "2026-02-10",
    amount: 5000,
    status: "completed",
    recipient: "Tech Corp",
  },
  {
    id: 2,
    title: "Featured Job Ad - Digital Marketing Manager",
    type: "featured_ad",
    date: "2026-02-05",
    amount: 8000,
    status: "completed",
    recipient: "Creative Agency",
  },
  {
    id: 3,
    title: "Job Posting - Construction Worker",
    type: "job_posting",
    date: "2026-01-28",
    amount: 5000,
    status: "completed",
    recipient: "Build Masters",
  },
  {
    id: 4,
    title: "Job Posting - Sales Executive",
    type: "job_posting",
    date: "2026-01-20",
    amount: 5000,
    status: "completed",
    recipient: "Sales Hub",
  },
  {
    id: 5,
    title: "Featured Job Ad - Frontend Developer",
    type: "featured_ad",
    date: "2026-01-15",
    amount: 8000,
    status: "pending",
    recipient: "WebTech",
  },
];

const getTypeLabel = (type: Payment["type"]) => {
  switch (type) {
    case "job_posting":
      return "Job Posting";
    case "featured_ad":
      return "Featured Ad";
  }
};

const getStatusConfig = (status: Payment["status"]) => {
  const config = {
    completed: {
      label: "Completed",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: null,
    },
    failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: null,
    },
  };
  return config[status];
};

export default function CompanyPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = allPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = allPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadReceipt = (paymentId: number) => {
    toast.success("Receipt downloaded");
    console.log("Downloading receipt for payment:", paymentId);
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
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mt-1">
              View your payment transactions
            </p>
          </div>

          {/* Payment Policy Section */}
          <div className="border-b mb-6 pb-3">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText
                  className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Payment Policy
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Job posting and advertising fees are non-refundable once the
                    job is activated. All payments are final and cannot be
                    reversed.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                          <Calendar size={14} />
                          {formatDate(payment.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 size={14} />
                          {payment.recipient}
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Status & Action */}
                    <div className="flex flex-row md:flex-col items-center gap-3">
                      {StatusIcon ? (
                        <Badge
                          className={`${statusConfig.color} flex items-center gap-1 px-3 py-1`}
                        >
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </Badge>
                      ) : (
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      )}
                      {payment.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="gap-2 cursor-pointer"
                        >
                          <Download size={14} />
                          Receipt
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
                <p className="text-muted-foreground">No payments found</p>
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
                {totalItems} transactions
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} transactions
            </div>
          )}

          {/* Payment Policy Section */}
          {/* <div className="mt-8 pt-6 border-t">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText
                  className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Payment Policy
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Job posting and advertising fees are non-refundable once the
                    job is activated. All payments are final and cannot be
                    reversed.
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
