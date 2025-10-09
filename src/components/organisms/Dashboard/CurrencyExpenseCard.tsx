"use client";

import { Card } from "@/components/atoms/Card";
import { TrendingUp } from "lucide-react";
import { CurrencyExpenseCardProps } from "./types";

export default function CurrencyExpenseCard({
  currency,
  expenses,
  totalAmount,
}: CurrencyExpenseCardProps) {
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  // Get the maximum amount for scaling the bar chart
  const maxAmount = Math.max(...expenses.map((expense) => expense.amount));

  return (
    <Card className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          {currency} Expenses
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalAmount, currency)}
          </div>
          <div className="text-sm text-gray-500">
            {expenses.reduce((sum, exp) => sum + exp.count, 0)} subscriptions
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No expenses in {currency}
          </p>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const percentage =
                  maxAmount > 0 ? (expense.amount / maxAmount) * 100 : 0;
                const categoryPercentage =
                  totalAmount > 0 ? (expense.amount / totalAmount) * 100 : 0;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {expense.category}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(expense.amount, currency)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {expense.count} subs • {categoryPercentage.toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t border-gray-200 ">
              <div className="grid grid-cols-2 gap-4 text-center ">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {expenses.length}
                  </div>
                  <div className="text-xs text-gray-500">Categories</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {expenses.reduce((sum, exp) => sum + exp.count, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Subscriptions</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
