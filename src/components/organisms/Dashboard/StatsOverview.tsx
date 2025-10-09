"use client";

import { Card } from "@/components/atoms/Card";
import {
  CreditCard,
  File,
  FileText,
  User,
  User2,
  UserCheck2Icon,
  Users,
  UserSquare2,
  UsersRound,
  UserStar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatsOverviewProps } from "./types";

const StatCard = ({
  icon,
  bgColor,
  title,
  count,
  handleClick,
}: {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  title: string;
  count: number;
  handleClick: () => void;
}) => (
  <Card
    className="py-4 px-3 flex items-center cursor-pointer"
    onClick={handleClick}
  >
    <div className="p-2 rounded-lg" style={{ backgroundColor: bgColor }}>
      {icon}
    </div>
    <div className="ml-2 lg:ml-4">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  </Card>
);

export default function StatsOverview({
  totalUsers,
  totalSubscriptions,
  totalContacts,
  totalNotes,
  totalDocuments,
}: StatsOverviewProps) {
  const router = useRouter();

  const handleClick = (page: string) => {
    router.push(`/${page.toLowerCase()}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <StatCard
        icon={<UserStar className="h-6 w-6 text-blue-600" />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
        title="Users"
        count={totalUsers}
        handleClick={() => handleClick("settings")}
      />

      <StatCard
        icon={<CreditCard className="h-6 w-6 text-green-600" />}
        bgColor="bg-green-100"
        textColor="text-green-600"
        title="Subscriptions"
        count={totalSubscriptions}
        handleClick={() => handleClick("subscriptions")}
      />

      <StatCard
        icon={<File className="h-6 w-6 text-indigo-600" />}
        bgColor="bg-indigo-100"
        textColor="text-indigo-600"
        title="Documents"
        count={totalDocuments}
        handleClick={() => handleClick("documents")}
      />

      <StatCard
        icon={<Users className="h-6 w-6 text-purple-600" />}
        bgColor="bg-purple-100"
        textColor="text-purple-600"
        title="Contacts"
        count={totalContacts}
        handleClick={() => handleClick("contacts")}
      />

      <StatCard
        icon={<FileText className="h-6 w-6 text-yellow-600" />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-600"
        title="Notes"
        count={totalNotes}
        handleClick={() => handleClick("notes")}
      />
    </div>
  );
}
