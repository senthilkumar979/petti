"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/Avatar";
import { User, UserPlus, Mail, Calendar, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types/database";

interface UsersListProps {
  users: UserType[];
  loading?: boolean;
  onInviteUser: () => void;
}

export const UsersList = ({
  users,
  loading = false,
  onInviteUser,
}: UsersListProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-16 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Invite Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-600">
            {users.length} {users.length === 1 ? "member" : "members"}
          </p>
        </div>
        <Button onClick={onInviteUser} variant="primary" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your team by inviting the first user.
          </p>
          <Button onClick={onInviteUser} variant="primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite First User
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  {user.picture ? (
                    <AvatarImage src={user.picture} alt={user.name} />
                  ) : (
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </h4>
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      Added {formatDate(user.addedOn)}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
