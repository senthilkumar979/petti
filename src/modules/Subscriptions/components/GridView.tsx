"use client";

import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { EditDeleteActions } from "@/components/templates/EditDeleteActions";
import { formatCurrency } from "@/lib/utils";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { CreditCard } from "lucide-react";
import {
  formatRenewalDate,
  getCategoryName,
  getPeriodicityColor,
  getReminderColor,
  getRenewalStatus,
  getStatusColor,
  getStatusIcon,
  getUserName,
} from "./util";

interface GridViewProps {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];
  users: User[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  subscriptions,
  categories,
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {subscriptions.map((subscription) => {
        const renewalStatus = getRenewalStatus(subscription.renewalDate);
        const statusColor = getStatusColor(renewalStatus);

        return (
          <Card
            key={subscription.id}
            className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(renewalStatus)}
                <Badge variant={statusColor} size="small">
                  {renewalStatus === "renewed"
                    ? "Renewed"
                    : renewalStatus === "renewing-soon"
                    ? "Renewing Soon"
                    : "Active"}
                </Badge>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {subscription.nameOfSubscription}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Periodicity</span>
                <Badge
                  variant={getPeriodicityColor(subscription.periodicity)}
                  size="small"
                >
                  {subscription.periodicity}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Renewal</span>
                <span className="text-sm text-gray-900">
                  {formatRenewalDate(subscription.renewalDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm text-gray-900">
                  {getCategoryName(categories, subscription.category)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Paid For</span>
                <span className="text-sm text-gray-900">
                  {getUserName(users, subscription.paidFor)}
                </span>
              </div>

              {subscription.provider && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Provider</span>
                  <span className="text-sm text-gray-900">
                    {subscription.provider}
                  </span>
                </div>
              )}

              {subscription.note && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-gray-500">Note</span>
                  <span className="text-sm text-gray-900 text-right max-w-32 truncate">
                    {subscription.note}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-gray-500">Reminders</div>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={getReminderColor(subscription.reminderOne)}
                  size="small"
                >
                  {subscription.reminderOne}
                </Badge>
                <Badge
                  variant={getReminderColor(subscription.reminderTwo)}
                  size="small"
                >
                  {subscription.reminderTwo}
                </Badge>
                <Badge
                  variant={getReminderColor(subscription.reminderThree)}
                  size="small"
                >
                  {subscription.reminderThree}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-center">
              <EditDeleteActions
                onEdit={() => onEdit(subscription)}
                onDelete={() => onDelete(subscription)}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
