import { Contact } from "@/types/database";

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const filterContacts = (contacts: Contact[], searchQuery: string) => {
  return contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.primaryEmail
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.designation
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sorting
};
