import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types";
import { cva } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-black/90 focus-visible:ring-black",
        secondary:
          "bg-white text-black border border-black hover:bg-black/5 focus-visible:ring-black",
        tertiary:
          "bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-gray-500",
        ghost: "hover:bg-black/10 focus-visible:ring-black",
        destructive:
          "bg-red-400 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "bg-white text-black hover:bg-gray-500 hover:text-white focus-visible:ring-black",
      },
      size: {
        sm: "h-6 px-3 text-xs",
        md: "h-8 px-4 py-2",
        lg: "h-10 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon && <span className={cn(children && "mr-2")}>{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className={cn(children && "ml-2")}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
