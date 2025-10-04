"use client";

import { Button } from "@/components/atoms/Button";
import { Calendar, Grid3X3, List, Table } from "lucide-react";

type ViewMode = "list" | "table" | "grid" | "calendar";

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={currentView === "calendar" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("calendar")}
        leftIcon={<Calendar className="h-4 w-4" />}
        className="px-3"
      >
        Calendar
      </Button>
      <Button
        variant={currentView === "list" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        leftIcon={<List className="h-4 w-4" />}
        className="px-3"
      >
        List
      </Button>
      <Button
        variant={currentView === "table" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        leftIcon={<Table className="h-4 w-4" />}
        className="px-3"
      >
        Table
      </Button>
      <Button
        variant={currentView === "grid" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        leftIcon={<Grid3X3 className="h-4 w-4" />}
        className="px-3"
      >
        Grid
      </Button>
    </div>
  );
};
