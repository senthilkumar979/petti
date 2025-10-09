// Dashboard component types
import { Contact, Note, Subscription } from "@/types/database";

// Data structure types
export interface SubscriptionExpense {
  category: string;
  amount: number;
  currency: string;
  count: number;
}

export interface CurrencyExpense {
  category: string;
  amount: number;
  count: number;
}

export interface DocumentStat {
  category: string;
  count: number;
}

// Component props interfaces
export interface CurrencyExpenseCardProps {
  currency: string;
  expenses: CurrencyExpense[];
  totalAmount: number;
}

export interface DocumentStatsProps {
  documentStats: DocumentStat[];
}

export interface RecentContactsProps {
  recentContacts: Contact[];
}

export interface RecentNotesProps {
  recentNotes: Note[];
}

export interface StatsOverviewProps {
  totalUsers: number;
  totalSubscriptions: number;
  totalContacts: number;
  totalNotes: number;
  totalDocuments: number;
}

export interface SubscriptionExpensesProps {
  subscriptionExpenses: SubscriptionExpense[];
}

export interface UpcomingSubscriptionsProps {
  upcomingSubscriptions: Subscription[];
}
