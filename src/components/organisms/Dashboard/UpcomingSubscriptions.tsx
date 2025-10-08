"use client";

import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Subscription } from "@/types/database";
import { Calendar, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpcomingSubscriptionsProps {
  upcomingSubscriptions: Subscription[];
}

export default function UpcomingSubscriptions({
  upcomingSubscriptions,
}: UpcomingSubscriptionsProps) {
  const router = useRouter();

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
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
        {upcomingSubscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No upcoming subscriptions
          </p>
        ) : (
          upcomingSubscriptions.map((subscription) => {
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
                    {formatCurrency(subscription.amount, subscription.currency)}{" "}
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
  );
}
