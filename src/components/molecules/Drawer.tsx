import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { DrawerProps } from "@/types";
import { X } from "lucide-react";
import { Drawer as VaulDrawer } from "vaul";

const DrawerAction = ({
  onClose,
  onConfirm,
  submitLabel,
  cancelLabel,
}: {
  onClose: () => void;
  onConfirm: () => void;
  submitLabel: string;
  cancelLabel: string;
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button variant="secondary" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        {submitLabel}
      </Button>
    </div>
  );
};

const DrawerContent = ({ children }: { children: React.ReactNode }) => {
  return children;
};

const Drawer = Object.assign(
  ({
    isOpen,
    onClose,
    title,
    description,
    children,
    side = "bottom",
  }: DrawerProps) => {
    return (
      <VaulDrawer.Root open={isOpen} onOpenChange={onClose} direction={side}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <VaulDrawer.Content
            className={cn(
              "fixed z-50 flex flex-col rounded-t-[10px] h-[96%] mt-2 mr-2 mb-2 focus:outline-none min-w-[80%] sm:min-w-[60%] lg:min-w-[30%]",
              {
                "left-0 top-0 h-full w-80 rounded-r-[10px] rounded-t-none":
                  side === "left",
                "right-0 top-0 rounded-l-[10px] rounded-t-none":
                  side === "right",
                "top-0 left-0 right-0 h-80 rounded-b-[10px] rounded-t-none":
                  side === "top",
                "bottom-0 left-0 right-0": side === "bottom",
              }
            )}
          >
            <div className="bg-white rounded-[10px] border-radius-5 flex-1 overflow-auto p-5">
              {(title || description) && (
                <div className="mb-4">
                  {title && (
                    <h2 className="text-lg font-bold text-black leading-none tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  )}
                </div>
              )}
              {<DrawerContent>{children}</DrawerContent>}
            </div>
            <VaulDrawer.Close asChild>
              <Button
                variant="primary"
                size="md"
                className="absolute right-4 top-2 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </VaulDrawer.Close>
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    );
  },
  {
    Action: DrawerAction,
    Content: DrawerContent,
  }
);

export default Drawer;
