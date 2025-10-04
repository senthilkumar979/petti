import { Pencil, Trash } from "lucide-react";
import { Button } from "../atoms/Button";

export const EditDeleteActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onEdit} variant="outline" size="md">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button onClick={onDelete} variant="destructive" size="md">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
