import { cn } from "@/lib/utils";
import { TextareaProps } from "@/types";
import React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-black mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "w-full h-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
