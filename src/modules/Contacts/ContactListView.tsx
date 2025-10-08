"use client";

import { Contact } from "@/types/database";
import { ContactAction } from "./ContactAction";

interface ContactListViewProps {
  contacts: Contact[];
  onViewContact: (contact: Contact) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

export const ContactListView = ({
  contacts,
  onViewContact,
  onEditContact,
  onDeleteContact,
}: ContactListViewProps) => {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onViewContact(contact)}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {contact.designation && <span>{contact.designation}</span>}
                  {contact.company && <span>at {contact.company}</span>}
                </div>
              </div>
            </div>
            <ContactAction
              contact={contact}
              onEditContact={onEditContact}
              onDeleteContact={onDeleteContact}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
