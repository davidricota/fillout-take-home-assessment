"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPageButtonProps {
  onAdd: () => void;
  className?: string;
  variant?: "inline" | "standalone";
}

export function AddPageButton({
  onAdd,
  className,
  variant = "inline",
}: AddPageButtonProps) {
  if (variant === "standalone") {
    return (
      <button
        onClick={onAdd}
        className={cn("btn-add-page-standalone navbar-constants", className)}
      >
        <Plus className="navbar-icon" />
        <span className="hidden md:block">Add page</span>
      </button>
    );
  }

  return (
    <button onClick={onAdd} className={cn("btn-add-page-inline", className)}>
      <Plus className="h-3 w-3" />
    </button>
  );
}
