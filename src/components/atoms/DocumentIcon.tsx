import { cn } from "@/lib/utils";
import React from "react";

export interface DocumentIconProps {
  type: DocumentType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export type DocumentType =
  | "passport"
  | "national-id"
  | "degree-certificate"
  | "birth-certificate"
  | "driving-license"
  | "voter-id"
  | "visa"
  | "insurance-card"
  | "medical-certificate"
  | "tax-document"
  | "work-permit"
  | "contract"
  | "invoice"
  | "bank-statement"
  | "receipt"
  | "other";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  type,
  className,
  size = "md",
}) => {
  const sizeClass = sizeClasses[size];

  const iconProps = {
    className: cn(sizeClass, className),
    fill: "currentColor",
  };

  switch (type) {
    case "passport":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" />
          <circle cx="8" cy="10" r="1" />
          <circle cx="10" cy="10" r="1" />
          <circle cx="12" cy="10" r="1" />
        </svg>
      );

    case "national-id":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="2" fill="currentColor" />
          <rect x="6" y="10" width="8" height="1" fill="currentColor" />
          <rect x="6" y="12" width="10" height="1" fill="currentColor" />
          <rect x="6" y="14" width="6" height="1" fill="currentColor" />
          <circle
            cx="16"
            cy="12"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );

    case "degree-certificate":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M4 3h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h16V5H4zm2 2h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" />
          <path
            d="M8 9h8v1H8V9zm0 2h8v1H8v-1zm0 2h6v1H8v-1z"
            fill="currentColor"
          />
          <circle cx="12" cy="15" r="1" fill="currentColor" />
        </svg>
      );

    case "birth-certificate":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M4 3h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h16V5H4zm2 2h12v1H6V7zm0 2h12v1H6V9zm0 2h8v1H6v-1z" />
          <path
            d="M8 8h8v1H8V8zm0 2h8v1H8v-1zm0 2h6v1H8v-1z"
            fill="currentColor"
          />
          <circle cx="10" cy="14" r="1" fill="currentColor" />
          <circle cx="14" cy="14" r="1" fill="currentColor" />
        </svg>
      );

    case "driving-license":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <circle
            cx="16"
            cy="10"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 15h8v1H8v-1z" fill="currentColor" />
        </svg>
      );

    case "voter-id":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
        </svg>
      );

    case "visa":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M16 15h2v1h-2v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
        </svg>
      );

    case "insurance-card":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
          <path d="M10 16h2v1h-2v-1z" fill="currentColor" />
        </svg>
      );

    case "medical-certificate":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      );

    case "tax-document":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <path d="M10 17h4v1h-4v-1z" fill="currentColor" />
        </svg>
      );

    case "bank-statement":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <path d="M10 17h4v1h-4v-1z" fill="currentColor" />
          <path d="M12 18h2v1h-2v-1z" fill="currentColor" />
        </svg>
      );

    case "contract":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <path d="M10 17h4v1h-4v-1z" fill="currentColor" />
          <path d="M12 18h2v1h-2v-1z" fill="currentColor" />
          <path d="M14 19h2v1h-2v-1z" fill="currentColor" />
        </svg>
      );

    case "invoice":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <path d="M10 17h4v1h-4v-1z" fill="currentColor" />
          <path d="M12 18h2v1h-2v-1z" fill="currentColor" />
          <path d="M14 19h2v1h-2v-1z" fill="currentColor" />
          <path d="M16 20h2v1h-2v-1z" fill="currentColor" />
        </svg>
      );

    case "receipt":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect x="6" y="7" width="12" height="1" fill="currentColor" />
          <rect x="6" y="9" width="8" height="1" fill="currentColor" />
          <rect x="6" y="11" width="10" height="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="1" fill="currentColor" />
          <path d="M14 15h4v1h-4v-1z" fill="currentColor" />
          <path d="M8 16h8v1H8v-1z" fill="currentColor" />
          <path d="M10 17h4v1h-4v-1z" fill="currentColor" />
          <path d="M12 18h2v1h-2v-1z" fill="currentColor" />
          <path d="M14 19h2v1h-2v-1z" fill="currentColor" />
          <path d="M16 20h2v1h-2v-1z" fill="currentColor" />
          <path d="M18 21h2v1h-2v-1z" fill="currentColor" />
        </svg>
      );

    case "other":
    default:
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
  }
};

export default DocumentIcon;
