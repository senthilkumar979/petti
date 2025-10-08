"use client";

import { Input } from "@/components/atoms/Input";
import { RichTextEditor } from "@/components/atoms/RichTextEditor";
import { Select } from "@/components/atoms/Select";
import { SelectOption } from "@/types";
import { Note, NoteCategory, NoteInsert } from "@/types/database";
import { useCallback, useState } from "react";
import Drawer from "../../components/molecules/Drawer";

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Partial<Note>;
  categories: NoteCategory[];
  createNote: (
    data: NoteInsert
  ) => Promise<{ data: Note | null; error: unknown }>;
  updateNote: (
    id: string,
    data: Omit<
      Note,
      "id" | "lastUpdatedBy" | "lastUpdatedDate" | "createdAt" | "updatedAt"
    >
  ) => Promise<{ data: Note | null; error: unknown }>;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  onCancel,
  onSuccess,
  initialData,
  categories,
  createNote,
  updateNote,
}) => {
  const [formData, setFormData] = useState({
    heading: initialData?.heading || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      setLoading(true);
      setSubmitError(null);

      const noteData = {
        heading: formData.heading.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
      };

      let result;
      if (initialData?.id) {
        // Update existing note
        result = await updateNote(initialData.id, noteData);
      } else {
        // Create new note
        result = await createNote(noteData as NoteInsert);
      }

      if (result.error) {
        throw result.error;
      }

      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save note"
      );
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, initialData, createNote, updateNote, onSuccess]);

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          </div>
        </div>
      )}

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
