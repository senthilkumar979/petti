import { SubscriptionExpense } from "./types";

export const expensesByCurrency = (
  subscriptionExpenses: SubscriptionExpense[]
) => {
  return subscriptionExpenses.reduce((acc, expense) => {
    if (!acc[expense.currency]) {
      acc[expense.currency] = [];
    }
    acc[expense.currency].push(expense);
    return acc;
  }, {} as Record<string, SubscriptionExpense[]>);
};
