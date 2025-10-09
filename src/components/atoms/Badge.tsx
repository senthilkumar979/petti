import React from "react";

export const variants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "subtle",
  "teal",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "gray",
  "white",
  "black",
  "transparent",
  "light",
  "dark",
  "muted",
  "accent",
  "popover",
  "card",
  "border",
  "input",
  "ring",
  "background",
  "foreground",
];

export interface BadgeProps {
  size: "xs" | "small" | "medium" | "large";
  variant: string;
  className?: string;
  children: React.ReactNode;
  isBlock?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  size,
  variant,
  className,
  children,
  isBlock = false,
}) => {
  const sizeClasses = {
    xs: "px-1 py-0.5 text-xs",
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  const variantClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-cyan-500 text-white",
    subtle: "bg-gray-100 text-gray-900",
    teal: "bg-teal-50 text-teal-900",
    orange: "bg-orange-50 text-orange-900",
    pink: "bg-pink-50 text-pink-900",
    purple: "bg-purple-50 text-purple-900",
    red: "bg-red-50 text-red-900",
    yellow: "bg-yellow-50 text-yellow-900",
    green: "bg-green-50 text-green-900",
    blue: "bg-blue-50 text-blue-900",
    indigo: "bg-indigo-50 text-indigo-900",
    violet: "bg-violet-50 text-violet-900",
    gray: "bg-gray-50 text-gray-900",
    white: "bg-white text-black",
    black: "bg-black text-white",
    transparent: "bg-transparent text-black",
    light: "bg-light-50 text-light-900",
    dark: "bg-dark-50 text-dark-900",
    muted: "bg-muted-50 text-muted-900",
    accent: "bg-accent-50 text-accent-900",
    popover: "bg-popover-50 text-popover-900",
    card: "bg-card-50 text-card-900",
    border: "bg-border-50 text-border-900",
    input: "bg-input-50 text-input-900",
    ring: "bg-ring-50 text-ring-900",
    background: "bg-background-50 text-background-900",
    foreground: "bg-foreground-50 text-foreground-900",
  };

  const baseClasses =
    "items-center font-medium rounded-lg w-fit gap-2 flex"
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
};
