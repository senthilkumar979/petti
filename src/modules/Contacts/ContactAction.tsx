import { Contact } from "@/types/database";
import { Edit, Trash2 } from "lucide-react";

export const ContactAction = ({
  contact,
  onEditContact,
  onDeleteContact,
}: {
  contact: Contact;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}) => {
  return (
    <div className="flex items-center justify-center mt-4 gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditContact(contact);
        }}
        className="p-1 text-gray-400 hover:text-blue-600"
        title="Edit contact"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteContact(contact);
        }}
        className="p-1 text-gray-400 hover:text-red-600"
        title="Delete contact"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
