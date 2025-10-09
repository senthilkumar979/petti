"use client";

import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { DatePicker } from "@/components/atoms/DatePicker";
import { SelectOption } from "@/types";
import { Contact, ContactInsert } from "@/types/database";
import { useCallback, useState } from "react";
import Drawer from "../../components/molecules/Drawer";

interface ContactFormProps {
  onSubmit: (
    data: Omit<ContactInsert, "id" | "ownedBy" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Contact>;
}

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
];

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    primaryEmail: initialData?.primaryEmail || "",
    secondaryEmail: initialData?.secondaryEmail || "",
    primaryPhone: initialData?.primaryPhone || "",
    secondaryPhone: initialData?.secondaryPhone || "",
    designation: initialData?.designation || "",
    company: initialData?.company || "",
    location: initialData?.location || "",
    lastContacted: initialData?.lastContacted
      ? new Date(initialData.lastContacted).toISOString().split("T")[0]
      : "",
    notes: initialData?.notes || "",
    category: initialData?.category || "personal",
    referrer: initialData?.referrer || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      formData.primaryEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)
    ) {
      newErrors.primaryEmail = "Please enter a valid email address";
    }

    if (
      formData.secondaryEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondaryEmail)
    ) {
      newErrors.secondaryEmail = "Please enter a valid email address";
    }

    if (
      formData.primaryPhone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.primaryPhone.replace(/\s/g, ""))
    ) {
      newErrors.primaryPhone = "Please enter a valid phone number";
    }

    if (
      formData.secondaryPhone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.secondaryPhone.replace(/\s/g, ""))
    ) {
      newErrors.secondaryPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        primaryEmail: formData.primaryEmail.trim() || null,
        secondaryEmail: formData.secondaryEmail.trim() || null,
        primaryPhone: formData.primaryPhone.trim() || null,
        secondaryPhone: formData.secondaryPhone.trim() || null,
        designation: formData.designation.trim() || null,
        company: formData.company.trim() || null,
        location: formData.location.trim() || null,
        lastContacted: formData.lastContacted || null,
        notes: formData.notes.trim() || null,
        category: formData.category as "work" | "personal",
        referrer: formData.referrer.trim() || null,
      });
    } catch (error) {
      console.error("Error submitting contact:", error);
    }
  }, [formData, validateForm, onSubmit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
            required
          />
        </div>

        {/* Primary Email */}
        <div>
          <Input
            label="Primary Email"
            type="email"
            value={formData.primaryEmail}
            onChange={(e) => handleInputChange("primaryEmail", e.target.value)}
            placeholder="Enter primary email"
            error={errors.primaryEmail}
          />
        </div>

        {/* Secondary Email */}
        <div>
          <Input
            label="Secondary Email"
            type="email"
            value={formData.secondaryEmail}
            onChange={(e) =>
              handleInputChange("secondaryEmail", e.target.value)
            }
            placeholder="Enter secondary email"
            error={errors.secondaryEmail}
          />
        </div>

        {/* Primary Phone */}
        <div>
          <Input
            label="Primary Phone"
            type="tel"
            value={formData.primaryPhone}
            onChange={(e) => handleInputChange("primaryPhone", e.target.value)}
            placeholder="Enter primary phone"
            error={errors.primaryPhone}
          />
        </div>

        {/* Secondary Phone */}
        <div>
          <Input
            label="Secondary Phone"
            type="tel"
            value={formData.secondaryPhone}
            onChange={(e) =>
              handleInputChange("secondaryPhone", e.target.value)
            }
            placeholder="Enter secondary phone"
            error={errors.secondaryPhone}
          />
        </div>

        {/* Designation */}
        <div>
          <Input
            label="Designation"
            value={formData.designation}
            onChange={(e) => handleInputChange("designation", e.target.value)}
            placeholder="Enter job title/designation"
            error={errors.designation}
          />
        </div>

        {/* Company */}
        <div>
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Enter company name"
            error={errors.company}
          />
        </div>

        {/* Location */}
        <div>
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location/city"
            error={errors.location}
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            options={CATEGORY_OPTIONS}
            error={errors.category}
            required
          />
        </div>

        {/* Last Contacted */}
        <div>
          <DatePicker
            label="Last Contacted"
            value={formData.lastContacted}
            onChange={(date) => handleInputChange("lastContacted", date)}
            placeholder="Select last contacted date"
            error={errors.lastContacted}
          />
        </div>

        {/* Referrer */}
        <div>
          <Input
            label="Referrer"
            value={formData.referrer}
            onChange={(e) => handleInputChange("referrer", e.target.value)}
            placeholder="Who referred this contact?"
            error={errors.referrer}
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Add any additional notes about this contact"
            error={errors.notes}
          />
        </div>
      </div>

      <Drawer.Action
        onClose={onCancel}
        onConfirm={handleSubmit}
        submitLabel={loading ? "Saving..." : "Save Contact"}
        cancelLabel="Cancel"
      />
    </div>
  );
};
