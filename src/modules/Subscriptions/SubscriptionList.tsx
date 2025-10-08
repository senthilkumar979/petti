"use client";

import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { CreditCard } from "lucide-react";
import React from "react";

import {
  CalendarView,
  GridView,
  ListView,
  TableView,
  ViewModeSelector,
} from "./components";

type ViewMode = "list" | "table" | "grid" | "calendar";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];
  users: User[];
  loading?: boolean;
  error?: string;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const SubscriptionList = ({
  subscriptions,
  categories,
  users,
  loading = false,
  error,
  onEdit,
  onDelete,
  viewMode,
  onViewModeChange,
}: SubscriptionListProps) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading subscriptions
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          No subscriptions yet
        </h4>
        <p className="text-gray-500 mb-4">
          Get started by adding your first subscription.
        </p>
      </div>
    );
  }

  // Client-only wrapper for calendar to prevent hydration issues
  const ClientOnlyCalendar = () => {
    if (!isClient) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </div>
      );
    }
    return (
      <CalendarView
        subscriptions={subscriptions}
        categories={categories}
        users={users}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Subscriptions ({subscriptions.length})
          </h3>
        </div>
        <ViewModeSelector
          currentView={viewMode}
          onViewChange={onViewModeChange}
        />
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" && (
        <ListView
          subscriptions={subscriptions}
          categories={categories}
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {viewMode === "table" && (
        <TableView
          subscriptions={subscriptions}
          categories={categories}
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {viewMode === "grid" && (
        <GridView
          subscriptions={subscriptions}
          categories={categories}
          users={users}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {viewMode === "calendar" && <ClientOnlyCalendar />}
    </div>
  );
};
