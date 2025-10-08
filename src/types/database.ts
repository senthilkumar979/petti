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
          provider: string | null;
          note: string | null;
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
          provider?: string | null;
          note?: string | null;
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
          provider?: string | null;
          note?: string | null;
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
      contacts: {
        Row: {
          id: string;
          name: string;
          primaryEmail: string | null;
          secondaryEmail: string | null;
          primaryPhone: string | null;
          secondaryPhone: string | null;
          designation: string | null;
          company: string | null;
          location: string | null;
          lastContacted: string | null;
          notes: string | null;
          category: "work" | "personal";
          referrer: string | null;
          ownedBy: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          primaryEmail?: string | null;
          secondaryEmail?: string | null;
          primaryPhone?: string | null;
          secondaryPhone?: string | null;
          designation?: string | null;
          company?: string | null;
          location?: string | null;
          lastContacted?: string | null;
          notes?: string | null;
          category: "work" | "personal";
          referrer?: string | null;
          ownedBy: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          primaryEmail?: string | null;
          secondaryEmail?: string | null;
          primaryPhone?: string | null;
          secondaryPhone?: string | null;
          designation?: string | null;
          company?: string | null;
          location?: string | null;
          lastContacted?: string | null;
          notes?: string | null;
          category?: "work" | "personal";
          referrer?: string | null;
          ownedBy?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      "note-categories": {
        Row: {
          id: string;
          name: string;
          color: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          heading: string;
          content: string;
          categoryId: string;
          lastUpdatedDate: string;
          lastUpdatedBy: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          heading: string;
          content: string;
          categoryId: string;
          lastUpdatedDate?: string;
          lastUpdatedBy: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          heading?: string;
          content?: string;
          categoryId?: string;
          lastUpdatedDate?: string;
          lastUpdatedBy?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          category: string;
          owner: string;
          lastModifiedDate: string;
          lastModifiedBy: string;
          createdDate: string;
          createdBy: string;
          validity: string | null;
          mimeType: string;
          content: string;
          isPreDefined: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          owner: string;
          lastModifiedDate?: string;
          lastModifiedBy: string;
          createdDate?: string;
          createdBy: string;
          validity?: string | null;
          mimeType: string;
          content: string;
          isPreDefined?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          owner?: string;
          lastModifiedDate?: string;
          lastModifiedBy?: string;
          createdDate?: string;
          createdBy?: string;
          validity?: string | null;
          mimeType?: string;
          content?: string;
          isPreDefined?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      "document-categories": {
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

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export type NoteCategory =
  Database["public"]["Tables"]["note-categories"]["Row"];
export type NoteCategoryInsert =
  Database["public"]["Tables"]["note-categories"]["Insert"];
export type NoteCategoryUpdate =
  Database["public"]["Tables"]["note-categories"]["Update"];

export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
export type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];

export interface NoteWithCategory extends Note {
  note_categories: NoteCategory;
}

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert =
  Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate =
  Database["public"]["Tables"]["documents"]["Update"];

export type DocumentCategory =
  Database["public"]["Tables"]["document-categories"]["Row"];
export type DocumentCategoryInsert =
  Database["public"]["Tables"]["document-categories"]["Insert"];
export type DocumentCategoryUpdate =
  Database["public"]["Tables"]["document-categories"]["Update"];
