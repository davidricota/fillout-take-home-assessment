"use client";

import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    reorderPages(result.source.index, result.destination.index);
  }

  // Scroll helpers
  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const startContinuousScroll = (amount: number) => {
    if (scrollInterval.current) return;
    scrollInterval.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      // Verificar si se puede scrollear más en la dirección sin exceder el 100%
      const canScroll =
        amount < 0
          ? el.scrollLeft > 0
          : el.scrollLeft + el.clientWidth < el.scrollWidth;

      if (!canScroll) {
        stopContinuousScroll();
        return;
      }
      scrollByAmount(amount);
    }, 50);
  };

  const stopContinuousScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const scrollLeft = () => scrollByAmount(-200);
  const scrollRight = () => scrollByAmount(200);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const checkOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollWidth > el.clientWidth);
  };

  // Verificar overflow cuando cambie el número de páginas
  useEffect(() => {
    // Usar setTimeout para asegurar que el DOM se haya actualizado
    const timeoutId = setTimeout(() => {
      checkOverflow();
      updateScrollButtons();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkOverflow();
    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", () => {
      checkOverflow();
      updateScrollButtons();
    });

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", () => {
        checkOverflow();
        updateScrollButtons();
      });
    };
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative z-10 flex w-fit max-w-full gap-4 py-5 before:absolute before:bottom-0 before:left-0 before:top-1/2 before:-z-10 before:h-px before:w-full before:border-b before:border-dashed before:border-[#C0C0C0] before:content-['']">
        <Droppable droppableId="navbar" direction="horizontal">
          {(provided) => (
            <div
              className={`scrollbar-hide flex max-w-[calc(100%-theme(spacing.32))] items-center overflow-x-scroll transition-all duration-200 md:max-w-[calc(100%-theme(spacing.36))]`}
              ref={(el) => {
                scrollRef.current = el;
                provided.innerRef(el);
              }}
              {...provided.droppableProps}
            >
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="w-50 flex gap-2">
          {isOverflowing && (
            <>
              <button
                onClick={scrollLeft}
                onMouseDown={() => startContinuousScroll(-40)}
                onMouseUp={stopContinuousScroll}
                onMouseLeave={stopContinuousScroll}
                onTouchStart={() => startContinuousScroll(-40)}
                onTouchEnd={stopContinuousScroll}
                onTouchCancel={stopContinuousScroll}
                disabled={!canScrollLeft}
                className="btn-scroll navbar-constants"
                aria-label="Scroll left"
              >
                <ChevronLeft className="navbar-icon text-gray-600" />
              </button>

              <button
                onClick={scrollRight}
                onMouseDown={() => startContinuousScroll(40)}
                onMouseUp={stopContinuousScroll}
                onMouseLeave={stopContinuousScroll}
                onTouchStart={() => startContinuousScroll(40)}
                onTouchEnd={stopContinuousScroll}
                onTouchCancel={stopContinuousScroll}
                disabled={!canScrollRight}
                className="btn-scroll navbar-constants"
                aria-label="Scroll right"
              >
                <ChevronRight className="navbar-icon text-gray-600" />
              </button>
            </>
          )}

          <AddPageButton
            onAdd={() => addPage(pages.length - 1)}
            variant="standalone"
          />
        </div>
      </div>
    </DragDropContext>
  );
}
