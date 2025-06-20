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
        className={cn(
          "flex h-8 w-32 items-center gap-2 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-soft transition-colors hover:text-gray-900",
          className,
        )}
      >
        <Plus className="h-5 w-5" />
        Add page
      </button>
    );
  }

  return (
    <button
      onClick={onAdd}
      className={cn(
        "mx-2 flex h-0 w-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 opacity-0 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700 group-hover:h-4 group-hover:w-4 group-hover:opacity-100",
        className,
      )}
    >
      <Plus className="h-3 w-3" />
    </button>
  );
}
