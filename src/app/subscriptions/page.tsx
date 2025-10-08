"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Header } from "@/components/organisms/Header/Header";
import { useAuth } from "@/lib/auth-context";
import { SubscriptionForm } from "@/modules/Subscriptions/SubscriptionForm";
import { SubscriptionList } from "@/modules/Subscriptions/SubscriptionList";
import { Subscription, SubscriptionCategory, User } from "@/types/database";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SubscriptionsPage() {
  const {
    user,
    loading: authLoading,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    fetchSubscriptionCategories,
    fetchAllUsers,
  } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<SubscriptionCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<Subscription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<
    "list" | "table" | "grid" | "calendar"
  >("calendar");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [subscriptionsResult, categoriesResult, usersResult] =
        await Promise.all([
          fetchSubscriptions(),
          fetchSubscriptionCategories(),
          fetchAllUsers(),
        ]);

      if (subscriptionsResult.error) {
        throw subscriptionsResult.error;
      }
      if (categoriesResult.error) {
        throw categoriesResult.error;
      }
      if (usersResult.error) {
        throw usersResult.error;
      }

      setSubscriptions(subscriptionsResult.data || []);
      setCategories(categoriesResult.data || []);
      setUsers(usersResult.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load subscriptions"
      );
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchSubscriptionCategories, fetchAllUsers]);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleAddSubscription = useCallback(() => {
    setEditingSubscription(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEditSubscription = useCallback((subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsDrawerOpen(true);
  }, []);

  const handleDeleteSubscription = useCallback((subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
    setDeleteModalOpen(true);
  }, []);

  const handleSubmitSubscription = useCallback(
    async (
      data: Omit<
        Subscription,
        "id" | "lastModified" | "modifiedBy" | "createdAt" | "updatedAt"
      >
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        let result;
        if (editingSubscription) {
          result = await updateSubscription(editingSubscription.id, data);
        } else {
          result = await createSubscription(data);
        }

        if (result.error) {
          throw result.error;
        }

        // Update local state instead of refetching
        if (editingSubscription) {
          // Update existing subscription in local state
          setSubscriptions((prev) =>
            prev.map((sub) =>
              sub.id === editingSubscription.id
                ? { ...sub, ...data, updatedAt: new Date().toISOString() }
                : sub
            )
          );
        } else {
          // Add new subscription to local state
          if (result.data) {
            setSubscriptions((prev) => [...prev, result.data as Subscription]);
          }
        }

        // Close the drawer
        setIsDrawerOpen(false);
        setEditingSubscription(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save subscription"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingSubscription, createSubscription, updateSubscription]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!subscriptionToDelete) return;

    try {
      setError(null);
      const { error } = await deleteSubscription(subscriptionToDelete.id);

      if (error) {
        throw error;
      }

      // Remove subscription from local state
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.id !== subscriptionToDelete.id)
      );

      setDeleteModalOpen(false);
      setSubscriptionToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete subscription"
      );
    }
  }, [subscriptionToDelete, deleteSubscription]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingSubscription(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  }, []);

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.nameOfSubscription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subscription.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.periodicity
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (subscription.provider &&
        subscription.provider
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (subscription.note &&
        subscription.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-2">
              Manage your recurring subscriptions and expenses
            </p>
          </div>
          <Button
            onClick={handleAddSubscription}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shrink-0"
          >
            Add Subscription
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subscriptions..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        <Card className="px-6">
          <div className="flex items-center justify-between mb-6">
            {searchQuery && (
              <p className="text-sm text-gray-500 py-6">
                Showing results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>

          <SubscriptionList
            subscriptions={filteredSubscriptions}
            categories={categories}
            users={users}
            loading={loading}
            error={error || undefined}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Card>

        {/* Add/Edit Subscription Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          title={
            editingSubscription ? "Edit Subscription" : "Add New Subscription"
          }
          description={
            editingSubscription
              ? "Update your subscription details"
              : "Fill in the details to add a new subscription"
          }
          side="right"
        >
          <SubscriptionForm
            onSubmit={handleSubmitSubscription}
            onCancel={handleCloseDrawer}
            loading={isSubmitting}
            initialData={editingSubscription || undefined}
            categories={categories}
            users={users}
          />
        </Drawer>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Delete Subscription"
          description={`Are you sure you want to delete "${subscriptionToDelete?.nameOfSubscription}"? This action cannot be undone.`}
        >
          <DeleteModal.Action
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
          />
        </DeleteModal>
      </div>
    </div>
  );
}
