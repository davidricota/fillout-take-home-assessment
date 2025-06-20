"use client";

import { useState, useCallback } from "react";
import type { FormPage } from "@/types/form-builder";

export function useFormBuilder() {
  const [pages, setPages] = useState<FormPage[]>([
    { id: "1", name: "Info", icon: "info", isActive: true, isFixed: true },
    { id: "2", name: "Details", icon: "document" },
    { id: "3", name: "Other", icon: "document" },
    { id: "4", name: "Ending", icon: "check", isFixed: true },
  ]);

  const [activePageId, setActivePageId] = useState("1");

  const setActivePage = useCallback((pageId: string) => {
    setActivePageId(pageId);
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        isActive: page.id === pageId,
      })),
    );
  }, []);

  const addPage = useCallback(
    (afterIndex: number) => {
      // No permitir agregar después de la última página (Ending)
      const maxIndex = pages.length - 2;
      const insertIndex = Math.min(afterIndex, maxIndex);

      const newPage: FormPage = {
        id: Date.now().toString(),
        name: `Page ${pages.length - 1}`, // -1 porque Info y Ending no cuentan
        icon: "document",
      };

      setPages((prev) => {
        const newPages = [...prev];
        newPages.splice(insertIndex + 1, 0, newPage);
        return newPages;
      });
    },
    [pages.length],
  );

  const reorderPages = useCallback((startIndex: number, endIndex: number) => {
    setPages((prev) => {
      // No permitir mover Info (índice 0) o Ending (último índice)
      if (startIndex === 0 || startIndex === prev.length - 1) return prev;
      if (endIndex === 0 || endIndex === prev.length - 1) return prev;

      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const duplicatePage = useCallback((pageId: string) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.id === pageId);
      if (pageIndex === -1) return prev;

      const originalPage = prev[pageIndex];

      // No permitir duplicar Info o Ending
      if (originalPage.isFixed) return prev;

      const duplicatedPage: FormPage = {
        ...originalPage,
        id: Date.now().toString(),
        name: `${originalPage.name} Copy`,
        isActive: false,
      };

      const newPages = [...prev];
      // Insertar antes de Ending
      const insertIndex = Math.min(pageIndex + 1, newPages.length - 1);
      newPages.splice(insertIndex, 0, duplicatedPage);
      return newPages;
    });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setPages((prev) => {
      const page = prev.find((p) => p.id === pageId);
      // No permitir eliminar páginas fijas
      if (page?.isFixed) return prev;

      return prev.filter((p) => p.id !== pageId);
    });
  }, []);

  const renamePage = useCallback((pageId: string, newName: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: newName } : p)),
    );
  }, []);

  const handleSetAsFirst = useCallback((pageId: string) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.id === pageId);
      if (pageIndex <= 1) return prev; // Ya está en primera posición disponible

      const page = prev[pageIndex];
      if (page.isFixed) return prev;

      const newPages = [...prev];
      newPages.splice(pageIndex, 1);
      newPages.splice(1, 0, page); // Insertar después de Info
      return newPages;
    });
  }, []);

  return {
    pages,
    activePageId,
    setActivePage,
    addPage,
    reorderPages,
    duplicatePage,
    deletePage,
    renamePage,
    handleSetAsFirst,
  };
}
