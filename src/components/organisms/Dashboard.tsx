"use client";

import { Card } from "@/components/atoms/Card";
import { useAuth } from "@/lib/auth-context";
import { Contact, Note, Subscription } from "@/types/database";
import { useCallback, useEffect, useState } from "react";
import DocumentStats from "./Dashboard/DocumentStats";
import RecentContacts from "./Dashboard/RecentContacts";
import RecentNotes from "./Dashboard/RecentNotes";
import StatsOverview from "./Dashboard/StatsOverview";
import SubscriptionExpenses from "./Dashboard/SubscriptionExpenses";
import { SubscriptionExpense } from "./Dashboard/types";
import UpcomingSubscriptions from "./Dashboard/UpcomingSubscriptions";
import { expensesByCurrency } from "./Dashboard/utils";

interface DashboardStats {
  totalUsers: number;
  totalSubscriptions: number;
  totalContacts: number;
  totalNotes: number;
  totalDocuments: number;
  upcomingSubscriptions: Subscription[];
  recentContacts: Contact[];
  recentNotes: Note[];
  subscriptionExpenses: Array<{
    category: string;
    amount: number;
    currency: string;
    count: number;
  }>;
  documentStats: Array<{ category: string; count: number }>;
  missingTables: string[];
}

export default function Dashboard() {
  const {
    user,
    loading: authLoading,
    fetchContacts,
    fetchNotes,
    fetchDocuments,
    fetchSubscriptions,
    fetchAllUsers,
    fetchSubscriptionCategories,
    fetchDocumentCategories,
    fetchNoteCategories,
  } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel using auth context methods
      const [
        usersResult,
        subscriptionsResult,
        contactsResult,
        notesResult,
        documentsResult,
        subscriptionCategoriesResult,
        documentCategoriesResult,
        noteCategoriesResult,
      ] = await Promise.all([
        fetchAllUsers(),
        fetchSubscriptions(),
        fetchContacts(),
        fetchNotes(),
        fetchDocuments(),
        fetchSubscriptionCategories(),
        fetchDocumentCategories(),
        fetchNoteCategories(),
      ]);

      // Check for critical errors (users and subscriptions are required)
      if (usersResult.error) throw new Error("Failed to load users");
      if (subscriptionsResult.error)
        throw new Error("Failed to load subscriptions");

      // Log warnings for optional tables but don't fail
      const missingTables = [];
      if (contactsResult.error) {
        missingTables.push("contacts");
      }
      if (notesResult.error) {
        missingTables.push("notes");
      }
      if (documentsResult.error) {
        missingTables.push("documents");
      }
      if (subscriptionCategoriesResult.error) {
        missingTables.push("subscription-categories");
      }
      if (documentCategoriesResult.error) {
        missingTables.push("document-categories");
      }
      if (noteCategoriesResult.error) {
        missingTables.push("note-categories");
      }

      const users = usersResult.data || [];
      const subscriptions = subscriptionsResult.data || [];
      const contacts = contactsResult.error
        ? []
        : (contactsResult.data || []).slice(0, 5);
      const notes = notesResult.error
        ? []
        : (notesResult.data || []).slice(0, 5);
      const documents = documentsResult.error ? [] : documentsResult.data || [];
      const subscriptionCategories = subscriptionCategoriesResult.error
        ? []
        : subscriptionCategoriesResult.data || [];
      const documentCategories = documentCategoriesResult.error
        ? []
        : documentCategoriesResult.data || [];

      // Calculate upcoming subscriptions (next 30 days)
      const now = new Date();
      const thirtyDaysFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      const upcomingSubscriptions = subscriptions
        .filter((sub) => {
          const renewalDate = new Date(sub.renewalDate);
          return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
        })
        .sort(
          (a, b) =>
            new Date(a.renewalDate).getTime() -
            new Date(b.renewalDate).getTime()
        );

      // Calculate subscription expenses by category and currency
      const subscriptionExpenses =
        subscriptionCategories.length > 0
          ? subscriptionCategories
              .map((category) => {
                const categorySubscriptions = subscriptions.filter(
                  (sub) => sub.category === category.id
                );

                // Group by currency to avoid mixing different currencies
                const expensesByCurrency = categorySubscriptions.reduce(
                  (acc, sub) => {
                    const currency = sub.currency || "USD";
                    if (!acc[currency]) {
                      acc[currency] = { amount: 0, count: 0 };
                    }
                    acc[currency].amount += sub.amount;
                    acc[currency].count += 1;
                    return acc;
                  },
                  {} as Record<string, { amount: number; count: number }>
                );

                // Return expenses grouped by currency
                return Object.entries(expensesByCurrency).map(
                  ([currency, data]) => ({
                    category: category.name,
                    amount: data.amount,
                    currency: currency,
                    count: data.count,
                  })
                );
              })
              .flat()
              .filter((expense) => expense.count > 0)
          : [];

      // Calculate document stats by category
      const documentStats =
        documentCategories.length > 0
          ? documentCategories
              .map((category) => {
                const categoryDocuments = documents.filter(
                  (doc) => doc.category === category.id
                );
                return {
                  category: category.name,
                  count: categoryDocuments.length,
                };
              })
              .filter((stat) => stat.count > 0)
          : [];

      setStats({
        totalUsers: users.length,
        totalSubscriptions: subscriptions.length,
        totalContacts: contacts.length,
        totalNotes: notes.length,
        totalDocuments: documents.length,
        upcomingSubscriptions: upcomingSubscriptions.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
        recentNotes: notes.slice(0, 5),
        subscriptionExpenses,
        documentStats,
        missingTables,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [
    fetchAllUsers,
    fetchSubscriptions,
    fetchContacts,
    fetchNotes,
    fetchDocuments,
    fetchSubscriptionCategories,
    fetchDocumentCategories,
    fetchNoteCategories,
  ]);

  const currenciesUsed = () => {
    return Object.entries(
      expensesByCurrency(stats?.subscriptionExpenses || [])
    ).map(([currency, currencyExpenses]) => {
      return {
        currency,
        amount: currencyExpenses.reduce(
          (sum: number, expense: SubscriptionExpense) => sum + expense.amount,
          0
        ),
      };
    });
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user, loadDashboardData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view the dashboard.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Missing Tables Info */}
      {stats.missingTables.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Some features are not available because the following tables are
                not set up: <strong>{stats.missingTables.join(", ")}</strong>.
                The dashboard will show available data only.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Overview Stats */}
      <StatsOverview
        totalUsers={stats.totalUsers}
        totalSubscriptions={stats.totalSubscriptions}
        totalContacts={stats.totalContacts}
        totalNotes={stats.totalNotes}
        totalDocuments={stats.totalDocuments}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingSubscriptions
          upcomingSubscriptions={stats.upcomingSubscriptions}
        />
        <RecentContacts recentContacts={stats.recentContacts} />
      </div>

      {currenciesUsed().length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <RecentNotes recentNotes={stats.recentNotes} />
          <DocumentStats documentStats={stats.documentStats} />
        </div>
      )}

      {currenciesUsed().length > 1 && (
        <SubscriptionExpenses
          subscriptionExpenses={stats.subscriptionExpenses}
        />
      )}

      {/* Charts Section */}
      {currenciesUsed().length <= 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubscriptionExpenses
            subscriptionExpenses={stats.subscriptionExpenses}
          />
          <DocumentStats documentStats={stats.documentStats} />
        </div>
      )}
    </div>
  );
}
