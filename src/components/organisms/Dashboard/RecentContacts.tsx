"use client";

import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { RecentContactsProps } from "./types";

export default function RecentContacts({
  recentContacts,
}: RecentContactsProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
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
        {recentContacts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent contacts</p>
        ) : (
          recentContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.primaryEmail}</p>
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
  );
}
