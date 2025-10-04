export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          picture: string | null;
          addedOn: string;
          lastUpdated: string;
          addedBy: string | null;
          updatedBy: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          picture?: string | null;
          addedOn?: string;
          lastUpdated?: string;
          addedBy?: string | null;
          updatedBy?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          picture?: string | null;
          addedOn?: string;
          lastUpdated?: string;
          addedBy?: string | null;
          updatedBy?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          nameOfSubscription: string;
          periodicity:
            | "Monthly"
            | "Quarterly"
            | "Half-yearly"
            | "Annual"
            | "Bi-annual";
          amount: number;
          currency: string;
          renewalDate: string;
          reminderOne:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderTwo:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderThree:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          category: string;
          paidFor: string;
          lastModified: string;
          modifiedBy: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          nameOfSubscription: string;
          periodicity:
            | "Monthly"
            | "Quarterly"
            | "Half-yearly"
            | "Annual"
            | "Bi-annual";
          amount: number;
          currency: string;
          renewalDate: string;
          reminderOne:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderTwo:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderThree:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          category: string;
          paidFor: string;
          lastModified?: string;
          modifiedBy?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          nameOfSubscription?: string;
          periodicity?:
            | "Monthly"
            | "Quarterly"
            | "Half-yearly"
            | "Annual"
            | "Bi-annual";
          amount?: number;
          currency?: string;
          renewalDate?: string;
          reminderOne?:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderTwo?:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          reminderThree?:
            | "1 day before"
            | "2 days before"
            | "3 days before"
            | "1 week before"
            | "10 days before";
          category?: string;
          paidFor?: string;
          lastModified?: string;
          modifiedBy?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      "subscription-categories": {
        Row: {
          id: string;
          name: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
  };
}

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
export type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];

export type SubscriptionCategory =
  Database["public"]["Tables"]["subscription-categories"]["Row"];
export type SubscriptionCategoryInsert =
  Database["public"]["Tables"]["subscription-categories"]["Insert"];
export type SubscriptionCategoryUpdate =
  Database["public"]["Tables"]["subscription-categories"]["Update"];
