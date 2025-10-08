"use client";

import { Card } from "@/components/atoms/Card";
import { Users, CreditCard, FileText, Calendar } from "lucide-react";

interface StatsOverviewProps {
  totalUsers: number;
  totalSubscriptions: number;
  totalContacts: number;
  totalNotes: number;
  totalDocuments: number;
}

export default function StatsOverview({
  totalUsers,
  totalSubscriptions,
  totalContacts,
  totalNotes,
  totalDocuments,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
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
              {totalSubscriptions}
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
            <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
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
            <p className="text-2xl font-bold text-gray-900">{totalNotes}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Documents</p>
            <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
