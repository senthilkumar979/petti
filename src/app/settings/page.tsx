"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "../../components/atoms/Card";
import { Header } from "../../components/organisms/Header/Header";
import { CategoriesTab } from "../../components/templates/CategoriesTab";
import { UsersList } from "../../components/molecules/UsersList";
import { UserInviteForm } from "../../components/molecules/UserInviteForm";
import Drawer from "../../components/molecules/Drawer";
import { useUsers } from "../../hooks/useUsers";
import EmailSettings from "../../components/organisms/EmailSettings";

type TabType = "users" | "subscription" | "document" | "notes" | "email";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");

  const {
    users,
    isLoading: usersLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    inviteUser,
    isInviting,
    inviteError,
  } = useUsers();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    {
      id: "users" as TabType,
      label: "Users",
      description: "Manage team members and invitations",
    },
    {
      id: "subscription" as TabType,
      label: "Subscription Categories",
      description: "Manage subscription categories",
    },
    {
      id: "document" as TabType,
      label: "Document Categories",
      description: "Manage document categories",
    },
    {
      id: "notes" as TabType,
      label: "Notes Categories",
      description: "Manage note categories and colors",
    },
    {
      id: "email" as TabType,
      label: "Email Settings",
      description: "Configure SMTP settings for subscription reminders",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your application categories and preferences
          </p>
        </div>

        <Card className="p-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "users" && (
              <UsersList
                users={users}
                loading={usersLoading}
                onInviteUser={() => setIsDrawerOpen(true)}
              />
            )}
            {activeTab === "subscription" && (
              <CategoriesTab
                tableName="subscription-categories"
                title="Subscription Categories"
                description="Manage the categories for your subscriptions and recurring expenses."
              />
            )}
            {activeTab === "document" && (
              <CategoriesTab
                tableName="document-categories"
                title="Document Categories"
                description="Manage the categories for organizing your documents and files."
              />
            )}
            {activeTab === "notes" && (
              <CategoriesTab
                tableName="note-categories"
                title="Notes Categories"
                description="Manage the categories and colors for organizing your notes."
              />
            )}
            {activeTab === "email" && <EmailSettings />}
          </div>
        </Card>
      </div>

      {/* User Invitation Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Invite New User"
        description="Add a new team member to your organization"
        side="right"
      >
        <UserInviteForm
          onSubmit={inviteUser}
          loading={isInviting}
          error={inviteError}
        />
      </Drawer>
    </div>
  );
}
