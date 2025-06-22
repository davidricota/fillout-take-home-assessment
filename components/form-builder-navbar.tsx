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

  const getDynamicScrollAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el || pages.length === 0) return direction === "left" ? -200 : 200;

    // Calcular el ancho promedio por página
    const averagePageWidth = el.scrollWidth / pages.length;

    // Scrollear 1-2 páginas dependiendo del número total
    let pagesToScroll = 1;
    if (pages.length > 10) pagesToScroll = 2;
    if (pages.length > 20) pagesToScroll = 3;

    let scrollAmount = averagePageWidth * pagesToScroll;

    // Verificar que no exceda los límites
    if (direction === "left") {
      const maxScrollLeft = el.scrollLeft;
      scrollAmount = Math.min(scrollAmount, maxScrollLeft);
    } else {
      const maxScrollRight = el.scrollWidth - el.clientWidth - el.scrollLeft;
      scrollAmount = Math.min(scrollAmount, maxScrollRight);
    }

    return direction === "left" ? -scrollAmount : scrollAmount;
  };

  const startContinuousScroll = (amount: number) => {
    if (scrollInterval.current) return;

    // Verificar si se puede scrollear en esa dirección antes de iniciar
    const el = scrollRef.current;
    if (!el) return;

    const canScroll =
      amount < 0
        ? el.scrollLeft > 1
        : el.scrollLeft + el.clientWidth + 1 < el.scrollWidth;

    if (!canScroll) return;

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

  const scrollLeft = () => {
    if (!canScrollLeft) return;
    scrollByAmount(getDynamicScrollAmount("left"));
  };

  const scrollRight = () => {
    if (!canScrollRight) return;
    scrollByAmount(getDynamicScrollAmount("right"));
  };

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Usar una tolerancia pequeña para evitar problemas de precisión
    const tolerance = 1;

    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth + tolerance < el.scrollWidth,
    );
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

    const handleScroll = () => updateScrollButtons();
    const handleResize = () => {
      checkOverflow();
      updateScrollButtons();
    };

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [pages.length]);

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
                onMouseDown={() =>
                  startContinuousScroll(getDynamicScrollAmount("left") / 5)
                }
                onMouseUp={stopContinuousScroll}
                onMouseLeave={stopContinuousScroll}
                onTouchStart={() =>
                  startContinuousScroll(getDynamicScrollAmount("left") / 5)
                }
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
                onMouseDown={() =>
                  startContinuousScroll(getDynamicScrollAmount("right") / 5)
                }
                onMouseUp={stopContinuousScroll}
                onMouseLeave={stopContinuousScroll}
                onTouchStart={() =>
                  startContinuousScroll(getDynamicScrollAmount("right") / 5)
                }
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
