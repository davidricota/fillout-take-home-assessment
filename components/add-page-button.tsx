"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPageButtonProps {
  onAdd: () => void;
  className?: string;
  variant?: "inline" | "standalone";
}

export function AddPageButton({ onAdd, className, variant = "inline" }: AddPageButtonProps) {
  if (variant === "standalone") {
    return (
      <button
        onClick={onAdd}
        className={cn(
          "w-32 h-8 bg-white shadow-soft flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors",
          className
        )}
      >
        <Plus className="w-5 h-5" />
        Add page
      </button>
    );
  }

  return (
    <button
      onClick={onAdd}
      className={cn(
        "mx-2 flex items-center justify-center w-0 h-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:w-4 group-hover:h-4",
        className
      )}
    >
      <Plus className="w-3 h-3" />
    </button>
  );
}
