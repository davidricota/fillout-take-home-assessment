"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (newName: string) => void;
}

export function RenameModal({
  isOpen,
  onClose,
  currentName,
  onRename,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
    }
    onClose();
  };

  const handleClose = () => {
    setNewName(currentName); // Reset to original name
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page-name">Page Name</Label>
              <Input
                id="page-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter page name"
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newName.trim() || newName.trim() === currentName}
            >
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
