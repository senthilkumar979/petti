"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/Avatar";
import { UserPlus, Upload, X } from "lucide-react";

const userInviteSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  picture: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "Picture size must be less than 2MB"
    ),
});

type UserInviteFormData = z.infer<typeof userInviteSchema>;

interface UserInviteFormProps {
  onSubmit: (data: UserInviteFormData) => Promise<unknown>;
  loading?: boolean;
  error?: string;
}

export const UserInviteForm = ({
  onSubmit,
  loading = false,
  error,
}: UserInviteFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserInviteFormData>({
    resolver: zodResolver(userInviteSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("picture", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemovePicture = () => {
    setValue("picture", undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFormSubmit = async (data: UserInviteFormData) => {
    try {
      await onSubmit(data);
      reset();
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Error handling is done in parent component
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Avatar Preview */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile preview" />
          ) : (
            <AvatarFallback>
              {watch("name") ? (
                getInitials(watch("name"))
              ) : (
                <UserPlus className="h-6 w-6" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Picture
            </Button>
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePicture}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Optional. Max size: 2MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Name Field */}
      <div>
        <Input
          {...register("name")}
          label="Full Name"
          placeholder="Enter full name"
          error={errors.name?.message}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <Input
          {...register("email")}
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          error={errors.email?.message}
          required
        />
      </div>

      {/* File Size Error */}
      {errors.picture && (
        <div className="text-sm text-red-600">{errors.picture.message}</div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Sending Invitation..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
};
