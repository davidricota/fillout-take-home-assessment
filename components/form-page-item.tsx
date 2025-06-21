"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { PageIcon } from "./page-icon";
import { AddPageButton } from "./add-page-button";
import { ContextMenu } from "./context-menu";
import type { FormPage, DragItem } from "@/types/form-builder";
import { cn } from "@/lib/utils";

interface FormPageItemProps {
  page: FormPage;
  index: number;
  isLast: boolean;
  onSelect: (pageId: string) => void;
  onAddAfter: (index: number) => void;
  onMove: (dragIndex: number, dropIndex: number) => void;
  onSetAsFirst: (pageId: string) => void;
  onRename: (pageId: string, newName: string) => void;
  onDuplicate: (pageId: string) => void;
  onDelete: (pageId: string) => void;
}

export function FormPageItem({
  page,
  index,
  isLast,
  onSelect,
  onAddAfter,
  onMove,
  onSetAsFirst,
  onRename,
  onDuplicate,
  onDelete,
}: FormPageItemProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Draggable
      draggableId={page.id}
      index={index}
      isDragDisabled={!!page.isFixed}
    >
      {(provided, snapshot) => (
        <div className="navbar-constants group flex items-center">
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              "btn-page-item",
              page.isActive && "active",
              snapshot.isDragging && "opacity-50",
            )}
            onClick={() => onSelect(page.id)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
          >
            <PageIcon
              type={page.icon}
              isActive={page.isActive}
              isFocused={isFocused}
            />
            <span className="navbar-text">{page.name}</span>
            {!page.isFixed && (
              <ContextMenu
                pageId={page.id}
                pageName={page.name}
                isFixed={page.isFixed}
                isActive={page.isActive}
                onSetAsFirst={onSetAsFirst}
                onRename={onRename}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            )}
          </div>
          {!isLast && (
            <AddPageButton onAdd={() => onAddAfter(index)} variant="inline" />
          )}
        </div>
      )}
    </Draggable>
  );
}
