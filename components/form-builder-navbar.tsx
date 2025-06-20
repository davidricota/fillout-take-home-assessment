"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormPageItem } from "./form-page-item";
import { AddPageButton } from "./add-page-button";
import { useFormBuilderContext } from "@/contexts/form-builder-context";

export function FormBuilderNavbar() {
  const {
    pages,
    setActivePage,
    addPage,
    reorderPages,
    duplicatePage,
    deletePage,
    renamePage,
    handleSetAsFirst,
  } = useFormBuilderContext();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className=" bg-white py-5 ">
        <div className="w-fit max-w-full  relative z-10 flex gap-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-px before:border-b before:border-dashed before:border-[#C0C0C0] before:top-1/2 before:-z-10">
          <div className="flex  items-center max-w-[calc(100%-theme(spacing.36))] overflow-x-auto">
            {pages.map((page, index) => (
              <FormPageItem
                key={page.id}
                page={page}
                index={index}
                isLast={index === pages.length - 1}
                onSelect={setActivePage}
                onAddAfter={addPage}
                onMove={reorderPages}
                onSetAsFirst={handleSetAsFirst}
                onRename={renamePage}
                onDuplicate={duplicatePage}
                onDelete={deletePage}
              />
            ))}
          </div>
          <AddPageButton onAdd={() => addPage(pages.length - 1)} variant="standalone" />
        </div>
      </div>
    </DndProvider>
  );
}
