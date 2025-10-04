"use client";

import { Card } from "@/components/atoms/Card";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types/database";
import Image from "next/image";
import React from "react";

interface UsersListProps {
  users: User[];
  loading: boolean;
}

export const UsersList: React.FC<UsersListProps> = ({ users, loading }) => {
  const { signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">
              Manage your organization&apos;s users
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {user.picture ? (
                    <Image
                      className="h-12 w-12 rounded-full"
                      src={user.picture}
                      alt={user.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Added on {new Date(user.addedOn).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Users will appear here once they register for your organization.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
