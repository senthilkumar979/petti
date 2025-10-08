"use client";

import { Button } from "@/components/atoms/Button";
import { Plus, Users } from "lucide-react";

interface ContactsEmptyStateProps {
  hasFilters: boolean;
  onAddContact: () => void;
}

export const ContactsEmptyState = ({
  hasFilters,
  onAddContact,
}: ContactsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h4 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? "No contacts found" : "No contacts yet"}
      </h4>
      <p className="text-gray-500 mb-4">
        {hasFilters
          ? "Try adjusting your search terms"
          : "Get started by adding your first contact."}
      </p>
      {!hasFilters && (
        <Button onClick={onAddContact} leftIcon={<Plus className="h-4 w-4" />}>
          Add Contact
        </Button>
      )}
    </div>
  );
};
