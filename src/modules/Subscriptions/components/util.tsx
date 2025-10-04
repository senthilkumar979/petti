import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge, variants } from "../../../components/atoms/Badge";
import { SubscriptionCategory, User } from "../../../types/database";

// Utility functions
export const getRenewalStatus = (renewalDate: string) => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "renewed";
  if (diffDays <= 7) return "renewing-soon";
  return "active";
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green";
    case "renewing-soon":
      return "orange";
    case "renewed":
      return "red";
    default:
      return "gray";
  }
};

export const getPeriodicityColor = (periodicity: string) => {
  switch (periodicity.toLowerCase()) {
    case "monthly":
      return "blue";
    case "yearly":
      return "purple";
    case "weekly":
      return "green";
    case "daily":
      return "orange";
    default:
      return "gray";
  }
};

export const getReminderColor = (reminder: string) => {
  switch (reminder.toLowerCase()) {
    case "1 day":
      return "red";
    case "3 days":
      return "orange";
    case "1 week":
      return "yellow";
    case "2 weeks":
      return "blue";
    default:
      return "gray";
  }
};

export const getCategoryName = (
  categories: SubscriptionCategory[],
  categoryId: string
) => {
  const category = categories.find((cat) => cat.id === categoryId);
  const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
  const variantIndex = variants[categoryIndex];
  return (
    <Badge variant={variantIndex} size="small">
      {category?.name || "Unknown Category"}
    </Badge>
  );
};

export const getCategoryColor = (
  categories: SubscriptionCategory[],
  categoryId: string
) => {
  const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
  return variants[categoryIndex];
};

export const getUserName = (users: User[], userId: string) => {
  const user = users.find((u) => u.id === userId);
  return user?.name || "Unknown User";
};

export const formatRenewalDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "renewing-soon":
      return <Clock className="h-4 w-4 text-orange-500" />;
    case "renewed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};
