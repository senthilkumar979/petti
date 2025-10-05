"use client";

import { Button } from "@/components/atoms/Button";
import { DatePicker } from "@/components/atoms/DatePicker";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Document, DocumentCategory, User } from "@/types/database";
import { FileText, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface DocumentFormProps {
  onSubmit: (data: DocumentFormData) => Promise<void>;
  onCancel: () => void;
  document?: Document;
  categories: DocumentCategory[];
  users: User[];
  isPreDefined?: boolean;
  preDefinedType?: string;
  isSubmitting?: boolean;
  preSelectedFile?: File | null;
}

export interface DocumentFormData {
  name: string;
  category: string;
  owner: string;
  validity: string | null;
  file: File | null;
  isPreDefined: boolean;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  onSubmit,
  onCancel,
  document,
  categories,
  users,
  isPreDefined = false,
  preDefinedType,
  isSubmitting = false,
  preSelectedFile,
}) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    name: document?.name || preDefinedType || "",
    category: document?.category || "",
    owner: document?.owner || "",
    validity: document?.validity || null,
    file: preSelectedFile || null,
    isPreDefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(
    preSelectedFile || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof DocumentFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleInputChange("file", file);

      // Auto-fill name if it's empty and not pre-defined
      if (!formData.name && !isPreDefined) {
        const fileName = file.name.split(".")[0];
        handleInputChange("name", fileName);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    handleInputChange("file", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Document name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.owner) {
      newErrors.owner = "Owner is required";
    }

    if (!formData.file && !document) {
      newErrors.file = "File is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Document Name */}
        <div className="">
          <Input
            label="Document Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter document name"
            error={errors.name}
            disabled={isPreDefined}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            options={categoryOptions}
            placeholder="Select category"
            error={errors.category}
            required
          />
        </div>

        {/* Owner */}
        <div>
          <Select
            label="Owner"
            value={formData.owner}
            onChange={(e) => handleInputChange("owner", e.target.value)}
            options={userOptions}
            placeholder="Select owner"
            error={errors.owner}
            required
          />
        </div>

        {/* Validity Date */}
        <div>
          <DatePicker
            label="Validity Date (Optional)"
            value={formData.validity || ""}
            onChange={(date) => handleInputChange("validity", date)}
            placeholder="Select validity date"
            helperText="Leave empty if document doesn't expire"
          />
        </div>
      </div>
      {/* File Upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-black mb-1">
          File Upload
        </label>

        {!selectedFile && !document ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile?.name || document?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "Existing file"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        {errors.file && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.file}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {document ? "Update Document" : "Upload Document"}
        </Button>
      </div>
    </form>
  );
};

export default DocumentForm;
