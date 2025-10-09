import { Pencil, Trash } from "lucide-react";
import { Button } from "../atoms/Button";

export const EditDeleteActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit();
  };
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };
  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleEdit} variant="outline" size="md">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button onClick={handleDelete} variant="destructive" size="md">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
