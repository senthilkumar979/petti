import { Contact } from "@/types/database";
import { EditDeleteActions } from "../../components/templates/EditDeleteActions";

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
    <div className="flex items-center justify-center gap-2">
      <EditDeleteActions
        onEdit={() => onEditContact(contact)}
        onDelete={() => onDeleteContact(contact)}
      />
    </div>
  );
};
