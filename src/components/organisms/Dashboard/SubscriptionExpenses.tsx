"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CurrencyExpenseCard from "./CurrencyExpenseCard";
import { expensesByCurrency } from "./utils";
import { SubscriptionExpense, SubscriptionExpensesProps } from "./types";

export default function SubscriptionExpenses({
  subscriptionExpenses,
}: SubscriptionExpensesProps) {
  const router = useRouter();

  if (subscriptionExpenses.length === 0) {
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
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Subscription Expenses by Currency
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/subscriptions")}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-center">
          {Object.entries(expensesByCurrency(subscriptionExpenses ?? [])).map(
            ([currency, currencyExpenses]) => {
              const totalAmountForCurrency = currencyExpenses.reduce(
                (sum: number, expense: SubscriptionExpense) =>
                  sum + expense.amount,
                0
              );

              return (
                <CurrencyExpenseCard
                  key={currency}
                  currency={currency}
                  expenses={currencyExpenses}
                  totalAmount={totalAmountForCurrency}
                />
              );
            }
          )}
        </div>
      </div>
    </Card>
  );
}
