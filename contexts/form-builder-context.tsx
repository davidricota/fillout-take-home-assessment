"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { FormPage } from "@/types/form-builder";

interface FormBuilderContextType {
  pages: FormPage[];
  activePageId: string;
  setActivePage: (pageId: string) => void;
  addPage: (afterIndex: number) => void;
  reorderPages: (startIndex: number, endIndex: number) => void;
  duplicatePage: (pageId: string) => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, newName: string) => void;
  handleSetAsFirst: (pageId: string) => void;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined,
);

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<FormPage[]>([
    { id: "1", name: "Info", icon: "info", isActive: true, isFixed: true },
    { id: "2", name: "Details", icon: "document", isActive: false },
    { id: "3", name: "Other", icon: "document", isActive: false },
    { id: "4", name: "Ending", icon: "check", isActive: false, isFixed: true },
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

  const addPage = useCallback((afterIndex: number) => {
    setPages((prev) => {
      const maxIndex = prev.length - 2;
      const insertIndex = Math.min(afterIndex, maxIndex);

      const newPage: FormPage = {
        id: Date.now().toString(),
        name: `Page ${prev.length - 1}`,
        icon: "document",
        isActive: false,
      };

      const newPages = [...prev];
      newPages.splice(insertIndex + 1, 0, newPage);
      return newPages;
    });
  }, []);

  const reorderPages = useCallback((startIndex: number, endIndex: number) => {
    setPages((prev) => {
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
      if (originalPage.isFixed) return prev;

      const duplicatedPage: FormPage = {
        ...originalPage,
        id: Date.now().toString(),
        name: `${originalPage.name} Copy`,
        isActive: false,
      };

      const newPages = [...prev];
      const insertIndex = Math.min(pageIndex + 1, newPages.length - 1);
      newPages.splice(insertIndex, 0, duplicatedPage);
      return newPages;
    });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setPages((prev) => {
      const page = prev.find((p) => p.id === pageId);
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
      if (pageIndex <= 1) return prev;

      const page = prev[pageIndex];
      if (page.isFixed) return prev;

      const newPages = [...prev];
      newPages.splice(pageIndex, 1);
      newPages.splice(1, 0, page);
      return newPages;
    });
  }, []);

  return (
    <FormBuilderContext.Provider
      value={{
        pages,
        activePageId,
        setActivePage,
        addPage,
        reorderPages,
        duplicatePage,
        deletePage,
        renamePage,
        handleSetAsFirst,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilderContext() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error(
      "useFormBuilderContext must be used within a FormBuilderProvider",
    );
  }
  return context;
}
