
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";

type ViewType = "grid" | "list";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentView === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("grid")}
        aria-label="Grid view"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("list")}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
