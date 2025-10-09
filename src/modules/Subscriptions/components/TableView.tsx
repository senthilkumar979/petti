"use client";

import { Badge } from "@/components/atoms/Badge";
import { EditDeleteActions } from "@/components/templates/EditDeleteActions";
import { formatCurrency } from "@/lib/utils";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { Calendar, User as UserIcon } from "lucide-react";
import {
  formatRenewalDate,
  getCategoryName,
  getPeriodicityColor,
  getUserName,
} from "./util";

interface TableViewProps {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];
  users: User[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  subscriptions,
  categories,
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subscription
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Periodicity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Renewal Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid For
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 min-w-full">
          {subscriptions.map((subscription) => {
            return (
              <tr key={subscription.id} className="hover:bg-gray-50 m-4">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.nameOfSubscription
                          ?.charAt(0)
                          .toUpperCase() +
                          subscription.nameOfSubscription?.slice(1)}
                        <div className="mt-2">
                          {getCategoryName(categories, subscription.category)}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={getPeriodicityColor(subscription.periodicity)}
                    size="small"
                  >
                    {subscription.periodicity}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatRenewalDate(subscription.renewalDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {getUserName(users, subscription.paidFor)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {subscription.provider || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <EditDeleteActions
                    onEdit={() => onEdit(subscription)}
                    onDelete={() => onDelete(subscription)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
