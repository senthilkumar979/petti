"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SubscriptionExpense {
  category: string;
  amount: number;
  count: number;
}

interface SubscriptionExpensesProps {
  subscriptionExpenses: SubscriptionExpense[];
}

export default function SubscriptionExpenses({
  subscriptionExpenses,
}: SubscriptionExpensesProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
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
        {subscriptionExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            <Image
              src="/logo.png"
              alt="Petti"
              width="50"
              height="50"
              className="mb-5"
            />
            No subscription expenses
          </p>
        ) : (
          subscriptionExpenses.map((expense, index) => {
            const totalAmount = subscriptionExpenses.reduce(
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
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% of total
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
