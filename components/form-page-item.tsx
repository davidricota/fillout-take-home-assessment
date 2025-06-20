"use client";

import { useDrag, useDrop } from "react-dnd";
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
  const [{ isDragging }, drag] = useDrag({
    type: "page",
    item: { id: page.id, index },
    canDrag: !page.isFixed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "page",
    hover: (item: DragItem) => {
      if (item.index !== index && !page.isFixed) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const dragDropRef = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  };

  return (
    <div className="group flex items-center">
      <div
        ref={dragDropRef}
        className={cn(
          "h-8 flex bg-button-inactive text-button-text-inactive items-center gap-2 px-3 rounded-lg  transition-all duration-200 cursor-pointer",
          page.isActive
            ? "bg-button-active text-button-text-active shadow-soft"
            : " focus:text-button-text-active hover:bg-button-hover hover:shadow-soft",
          isDragging && "opacity-50"
        )}
        onClick={() => onSelect(page.id)}
      >
        <PageIcon type={page.icon} isActive={page.isActive} />
        <span className="text-sm font-medium whitespace-nowrap">{page.name}</span>
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

      {!isLast && <AddPageButton onAdd={() => onAddAfter(index)} variant="inline" />}
    </div>
  );
}
