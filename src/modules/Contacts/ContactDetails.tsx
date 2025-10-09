"use client";

import { Badge } from "@/components/atoms/Badge";
import { Contact } from "@/types/database";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Calendar,
  FileText,
  Users,
  Edit,
  Trash2,
} from "lucide-react";

interface ContactDetailsProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: "work" | "personal") => {
    return category === "work" ? "blue" : "green";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
          <div className="mt-3">
            <Badge variant={getCategoryColor(contact.category)} size="small">
              {contact.category === "work" ? "Work" : "Personal"}
            </Badge>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(contact)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit contact"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(contact)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete contact"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Addresses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-400" />
            Email Addresses
          </h3>
          <div className="space-y-3">
            {contact.primaryEmail && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Primary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.primaryEmail}
                  </p>
                </div>
              </div>
            )}
            {contact.secondaryEmail && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Secondary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.secondaryEmail}
                  </p>
                </div>
              </div>
            )}
            {!contact.primaryEmail && !contact.secondaryEmail && (
              <p className="text-sm text-gray-500 italic">No email addresses</p>
            )}
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-400" />
            Phone Numbers
          </h3>
          <div className="space-y-3">
            {contact.primaryPhone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Primary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.primaryPhone}
                  </p>
                </div>
              </div>
            )}
            {contact.secondaryPhone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Secondary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.secondaryPhone}
                  </p>
                </div>
              </div>
            )}
            {!contact.primaryPhone && !contact.secondaryPhone && (
              <p className="text-sm text-gray-500 italic">No phone numbers</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      {(contact.company || contact.designation || contact.location) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400" />
            Professional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contact.company && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.company}
                  </p>
                </div>
              </div>
            )}
            {contact.designation && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.designation}
                  </p>
                </div>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Last Contacted</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(contact.lastContacted)}
              </p>
            </div>
          </div>
          {contact.referrer && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Referrer</p>
                <p className="text-sm font-medium text-gray-900">
                  {contact.referrer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {contact.notes && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            Notes
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {contact.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
