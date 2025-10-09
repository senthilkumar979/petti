"use client";

import { Contact } from "@/types/database";
import { Briefcase, Building2, Mail, PhoneCall } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
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
  const { isMobile, isTablet } = useMediaQuery();

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onViewContact(contact)}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="">
                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                <div className="flex flex-row md:gap-6 gap-8 mt-1">
                  <div className="flex items-center md:gap-2 gap-8 text-sm text-gray-500">
                    {contact.designation && (
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />{" "}
                        {contact.designation}
                      </span>
                    )}
                    {contact.company && (
                      <span className="font-bold flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-green-500" />{" "}
                        {contact.company}
                      </span>
                    )}
                  </div>
                  {!isMobile && !isTablet && (
                    <div className="flex items-center md:gap-2 gap-8 text-sm text-gray-500">
                      {contact.primaryEmail && (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-500" />{" "}
                          {contact.primaryEmail}
                        </span>
                      )}
                      {contact.primaryPhone && (
                        <span className="flex items-center gap-2">
                          <PhoneCall className="h-4 w-4 text-green-500" />{" "}
                          {contact.primaryPhone}
                        </span>
                      )}
                    </div>
                  )}
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
