"use client";

import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

interface ContactsHeaderProps {
  onAddContact: () => void;
}

export const ContactsHeader = ({ onAddContact }: ContactsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal and professional contacts
        </p>
      </div>
      <Button
        onClick={onAddContact}
        leftIcon={<Plus className="h-4 w-4" />}
        className="shrink-0"
      >
        Add Contact
      </Button>
    </div>
  );
};
