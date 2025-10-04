"use client";

import { Input } from "@/components/atoms/Input";
import { RichTextEditor } from "@/components/atoms/RichTextEditor";
import { Select } from "@/components/atoms/Select";
import { SelectOption } from "@/types";
import { Note, NoteCategory, NoteInsert } from "@/types/database";
import { useCallback, useState } from "react";
import Drawer from "../../components/molecules/Drawer";

interface NoteFormProps {
  onSubmit: (
    data: Omit<
      NoteInsert,
      "id" | "lastUpdatedBy" | "lastUpdatedDate" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Note>;
  categories: NoteCategory[];
}

export const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState({
    heading: initialData?.heading || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

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

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
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
        heading: formData.heading.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
      });
    } catch (error) {
      console.error("Error submitting note:", error);
    }
  }, [formData, validateForm, onSubmit]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <Input
            label="Note Heading"
            value={formData.heading}
            onChange={(e) => handleInputChange("heading", e.target.value)}
            placeholder="Enter a descriptive heading for your note"
            error={errors.heading}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
            options={categoryOptions}
            error={errors.categoryId}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => handleInputChange("content", content)}
            placeholder="Write your note content here..."
            error={errors.content}
          />
        </div>
      </div>

      <Drawer.Action
        onClose={onCancel}
        onConfirm={handleSubmit}
        submitLabel={loading ? "Saving..." : "Save Note"}
        cancelLabel="Cancel"
      />
    </div>
  );
};
