"use client";

import { useState } from "react";
import { MoreHorizontal, Flag, Edit3, Copy, Files, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RenameModal } from "./rename-modal";

interface ContextMenuProps {
  pageId: string;
  pageName: string;
  isFixed?: boolean;
  isActive?: boolean;
  onSetAsFirst: (pageId: string) => void;
  onRename: (pageId: string, newName: string) => void;
  onDuplicate: (pageId: string) => void;
  onDelete: (pageId: string) => void;
}

export function ContextMenu({
  pageId,
  pageName,
  isFixed,
  isActive,
  onSetAsFirst,
  onRename,
  onDuplicate,
  onDelete,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const handleRename = () => {
    setOpen(false);
    setRenameModalOpen(true);
  };

  const handleRenameSubmit = (newName: string) => {
    onRename(pageId, newName);
    setRenameModalOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-0 overflow-hidden p-0 opacity-0 transition-all duration-200 ease-out data-[active=true]:w-6 data-[active=true]:px-1 data-[active=true]:opacity-100"
            data-active={isActive}
          >
            <MoreHorizontal className="h-3 w-3 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 -translate-y-2 p-0">
          <div className="bg-card-header-title p-3 text-base font-medium text-gray-900">
            Settings
          </div>

          {!isFixed && (
            <DropdownMenuItem
              onClick={() => onSetAsFirst(pageId)}
              className="group cursor-pointer"
            >
              <Flag className="mr-2 h-4 w-4 group-hover:text-blue-500" />
              Set as first page
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleRename}
            className="group cursor-pointer"
          >
            <Edit3 className="mr-2 h-4 w-4 group-hover:text-blue-500" />
            Rename
          </DropdownMenuItem>
          {!isFixed && (
            <DropdownMenuItem
              onClick={() => onDuplicate(pageId)}
              className="group cursor-pointer"
            >
              <Files className="mr-2 h-4 w-4 group-hover:text-blue-500" />
              Duplicate
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {!isFixed && (
            <DropdownMenuItem
              onClick={() => onDelete(pageId)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameModal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        currentName={pageName}
        onRename={handleRenameSubmit}
      />
    </>
  );
}
