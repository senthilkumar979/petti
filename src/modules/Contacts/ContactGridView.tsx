"use client";

import { Contact } from "@/types/database";
import { ContactAction } from "./ContactAction";

interface ContactGridViewProps {
  contacts: Contact[];
  onViewContact: (contact: Contact) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

export const ContactGridView = ({
  contacts,
  onViewContact,
  onEditContact,
  onDeleteContact,
}: ContactGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onViewContact(contact)}
          className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors contact-grid-item"
        >
          <div className="text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{contact.name}</h4>
            {contact.designation && (
              <p className="text-sm text-gray-500 mb-2">
                {contact.designation}
              </p>
            )}
            {contact.company && (
              <p className="text-sm text-gray-500 mb-3">{contact.company}</p>
            )}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                contact.category === "work"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {contact.category}
            </span>
          </div>
          <div className="">
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
