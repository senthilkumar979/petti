import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
    size?: "sm" | "md" | "lg" | "xl" | "full";
  }
>(({ className, children, size = "md", ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        {
          "max-w-sm": size === "sm",
          "max-w-md": size === "md",
          "max-w-lg": size === "lg",
          "max-w-xl": size === "xl",
          "max-w-full h-full": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
));

ModalContent.displayName = Dialog.Content.displayName;

export const DeleteModalAction = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  );
};

const DeleteModal = Object.assign(
  ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
  }: ModalProps) => {
    return (
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <ModalContent size={size}>
          {(title || description) && (
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              {title && (
                <Dialog.Title className="text-lg font-medium tracking-wide text-red-500 leading-none tracking-tight">
                  {title}
                </Dialog.Title>
              )}
            </div>
          )}
          <div className="flex-1">
            {description && (
              <Dialog.Description className="text-md text-black pt-4 pb-4">
                {description}
              </Dialog.Description>
            )}
            {children}
          </div>
          <Dialog.Close asChild>
            <Button
              variant="destructive"
              size="md"
              className="absolute right-4 top-4 rounded-sm ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </Dialog.Close>
        </ModalContent>
      </Dialog.Root>
    );
  },
  {
    Action: DeleteModalAction,
  }
);

export default DeleteModal;
