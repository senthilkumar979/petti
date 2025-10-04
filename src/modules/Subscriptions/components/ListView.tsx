"use client";

import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { EditDeleteActions } from "@/components/templates/EditDeleteActions";
import { formatCurrency } from "@/lib/utils";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { Calendar, DollarSign, User as UserIcon } from "lucide-react";
import {
  formatRenewalDate,
  getCategoryName,
  getPeriodicityColor,
  getReminderColor,
  getRenewalStatus,
  getStatusColor,
  getUserName,
} from "./util";

interface ListViewProps {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];
  users: User[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  subscriptions,
  categories,
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => {
        const renewalStatus = getRenewalStatus(subscription.renewalDate);
        const statusColor = getStatusColor(renewalStatus);

        return (
          <Card
            key={subscription.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {subscription.nameOfSubscription}
                  </h3>
                  <Badge
                    variant={getPeriodicityColor(subscription.periodicity)}
                    size="small"
                  >
                    {subscription.periodicity}
                  </Badge>
                  <Badge variant={statusColor} size="small">
                    {renewalStatus === "renewed"
                      ? "Renewed"
                      : renewalStatus === "renewing-soon"
                      ? "Renewing Soon"
                      : "Active"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatCurrency(
                        subscription.amount,
                        subscription.currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatRenewalDate(subscription.renewalDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-600">C</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {getCategoryName(categories, subscription.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {getUserName(users, subscription.paidFor)}
                    </span>
                  </div>

                  {subscription.provider && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-300 flex items-center justify-center">
                        <span className="text-xs text-blue-600">P</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {subscription.provider}
                      </span>
                    </div>
                  )}
                </div>

                {subscription.note && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <span className="font-medium">Note: </span>
                    {subscription.note}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
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

              <div className="ml-4 flex-shrink-0">
                <EditDeleteActions
                  onEdit={() => onEdit(subscription)}
                  onDelete={() => onDelete(subscription)}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
