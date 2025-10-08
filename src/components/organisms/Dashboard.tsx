"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { useAuth } from "@/lib/auth-context";
import { Contact, Note, Subscription } from "@/types/database";
import { Calendar, CreditCard, FileText, PieChart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { stripHtml } from "../../modules/Notes/noteUtils";

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
    count: number;
  }>;
  documentStats: Array<{ category: string; count: number }>;
  missingTables: string[];
}

export default function Dashboard() {
  const router = useRouter();
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
        console.warn(
          "Contacts table not accessible:",
          contactsResult.error instanceof Error
            ? contactsResult.error.message
            : "Unknown error"
        );
        missingTables.push("contacts");
      }
      if (notesResult.error) {
        console.warn(
          "Notes table not accessible:",
          notesResult.error instanceof Error
            ? notesResult.error.message
            : "Unknown error"
        );
        missingTables.push("notes");
      }
      if (documentsResult.error) {
        console.warn(
          "Documents table not accessible:",
          documentsResult.error instanceof Error
            ? documentsResult.error.message
            : "Unknown error"
        );
        missingTables.push("documents");
      }
      if (subscriptionCategoriesResult.error) {
        console.warn(
          "Subscription categories not accessible:",
          subscriptionCategoriesResult.error instanceof Error
            ? subscriptionCategoriesResult.error.message
            : "Unknown error"
        );
        missingTables.push("subscription-categories");
      }
      if (documentCategoriesResult.error) {
        console.warn(
          "Document categories not accessible:",
          documentCategoriesResult.error instanceof Error
            ? documentCategoriesResult.error.message
            : "Unknown error"
        );
        missingTables.push("document-categories");
      }
      if (noteCategoriesResult.error) {
        console.warn(
          "Note categories not accessible:",
          noteCategoriesResult.error instanceof Error
            ? noteCategoriesResult.error.message
            : "Unknown error"
        );
        missingTables.push("note-categories");
      }

      if (missingTables?.length > 0) {
        console.info("Missing tables detected:", missingTables.join(", "));
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

      // Calculate subscription expenses by category
      const subscriptionExpenses =
        subscriptionCategories.length > 0
          ? subscriptionCategories
              .map((category) => {
                const categorySubscriptions = subscriptions.filter(
                  (sub) => sub.category === category.id
                );
                const totalAmount = categorySubscriptions.reduce(
                  (sum, sub) => sum + sub.amount,
                  0
                );
                return {
                  category: category.name,
                  amount: totalAmount,
                  count: categorySubscriptions.length,
                };
              })
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

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user, loadDashboardData]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    const now = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <Button onClick={loadDashboardData}>Try Again</Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSubscriptions}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalContacts}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalNotes}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDocuments}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Subscriptions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Subscriptions
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/subscriptions")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.upcomingSubscriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No upcoming subscriptions
              </p>
            ) : (
              stats.upcomingSubscriptions.map((subscription) => {
                const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {subscription.nameOfSubscription}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(
                          subscription.amount,
                          subscription.currency
                        )}{" "}
                        • {subscription.periodicity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {daysUntil === 0 ? "Today" : `${daysUntil} days`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(subscription.renewalDate)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent Contacts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Recent Contacts
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/contacts")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentContacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No contacts yet</p>
            ) : (
              stats.recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">
                      {contact.primaryEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Notes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-yellow-600" />
              Recent Notes
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/notes")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentNotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              stats.recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {note.heading}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {stripHtml(note.content?.slice(0, 200) ?? "")}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Subscription Expenses Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-600" />
              Subscription Expenses
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/subscriptions")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.subscriptionExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No subscription expenses
              </p>
            ) : (
              stats.subscriptionExpenses.map((expense, index) => {
                const totalAmount = stats.subscriptionExpenses.reduce(
                  (sum, e) => sum + e.amount,
                  0
                );
                const percentage =
                  totalAmount > 0 ? (expense.amount / totalAmount) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {expense.count} subscriptions
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}%</span>
                      <span>{formatCurrency(expense.amount, "USD")}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Document Categories Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-600" />
            Documents by Category
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/documents")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.documentStats.length === 0 ? (
            <p className="text-gray-500 text-center py-4 col-span-full">
              No documents yet
            </p>
          ) : (
            stats.documentStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stat.category}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {stat.count}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (stat.count /
                          Math.max(
                            ...stats.documentStats.map((s) => s.count)
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
