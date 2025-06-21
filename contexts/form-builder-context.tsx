"use client";

import {
  createContext,
  useContext,
  useReducer,
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

interface FormBuilderState {
  pages: FormPage[];
  activePageId: string;
}

type FormBuilderAction =
  | { type: "SET_ACTIVE_PAGE"; payload: string }
  | { type: "ADD_PAGE"; payload: { afterIndex: number } }
  | { type: "REORDER_PAGES"; payload: { startIndex: number; endIndex: number } }
  | { type: "DUPLICATE_PAGE"; payload: string }
  | { type: "DELETE_PAGE"; payload: string }
  | { type: "RENAME_PAGE"; payload: { pageId: string; newName: string } }
  | { type: "SET_AS_FIRST"; payload: string };

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined,
);

const initialState: FormBuilderState = {
  pages: [
    { id: "1", name: "Info", icon: "info", isActive: true, isFixed: true },
    { id: "2", name: "Details", icon: "document", isActive: false },
    { id: "3", name: "Other", icon: "document", isActive: false },
    { id: "4", name: "Ending", icon: "check", isActive: false, isFixed: true },
  ],
  activePageId: "1",
};

function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction,
): FormBuilderState {
  console.log("Reducer called with action:", action.type, action.payload);
  console.log("Current state:", {
    activePageId: state.activePageId,
    pagesCount: state.pages.length,
  });

  switch (action.type) {
    case "SET_ACTIVE_PAGE": {
      console.log("SET_ACTIVE_PAGE: setting to", action.payload);
      console.log(
        "Current pages:",
        state.pages.map((p) => p.id),
      );

      // Verificar que la página existe antes de activarla
      const pageExists = state.pages.some((page) => page.id === action.payload);
      console.log("Page exists check:", pageExists);

      if (!pageExists) {
        console.log("SET_ACTIVE_PAGE: page does not exist, ignoring");
        return state;
      }

      return {
        ...state,
        activePageId: action.payload,
        pages: state.pages.map((page) => ({
          ...page,
          isActive: page.id === action.payload,
        })),
      };
    }

    case "ADD_PAGE": {
      const { afterIndex } = action.payload;
      const maxIndex = state.pages.length - 2;
      const insertIndex = Math.min(afterIndex, maxIndex);

      const newPage: FormPage = {
        id: Date.now().toString(),
        name: `Page ${state.pages.length - 1}`,
        icon: "document",
        isActive: true,
      };

      const newPages = [...state.pages];
      newPages.splice(insertIndex + 1, 0, newPage);

      // Actualizar todas las páginas para que solo la nueva sea activa
      const updatedPages = newPages.map((page) => ({
        ...page,
        isActive: page.id === newPage.id,
      }));

      console.log("ADD_PAGE: created new page", {
        newPageId: newPage.id,
        newPageName: newPage.name,
        insertIndex: insertIndex + 1,
      });

      return {
        activePageId: newPage.id,
        pages: updatedPages,
      };
    }

    case "REORDER_PAGES": {
      const { startIndex, endIndex } = action.payload;
      if (startIndex === 0 || startIndex === state.pages.length - 1)
        return state;
      if (endIndex === 0 || endIndex === state.pages.length - 1) return state;

      const result = Array.from(state.pages);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return {
        ...state,
        pages: result,
      };
    }

    case "DUPLICATE_PAGE": {
      const pageIndex = state.pages.findIndex((p) => p.id === action.payload);
      if (pageIndex === -1) return state;

      const originalPage = state.pages[pageIndex];
      if (originalPage.isFixed) return state;

      const duplicatedPage: FormPage = {
        ...originalPage,
        id: Date.now().toString(),
        name: `${originalPage.name} Copy`,
        isActive: true,
      };

      const newPages = [...state.pages];
      const insertIndex = Math.min(pageIndex + 1, newPages.length - 1);
      newPages.splice(insertIndex, 0, duplicatedPage);

      // Actualizar todas las páginas para que solo la duplicada sea activa
      const updatedPages = newPages.map((page) => ({
        ...page,
        isActive: page.id === duplicatedPage.id,
      }));

      console.log("DUPLICATE_PAGE: created duplicate page", {
        originalPageId: action.payload,
        newPageId: duplicatedPage.id,
        newPageName: duplicatedPage.name,
        insertIndex,
      });

      return {
        activePageId: duplicatedPage.id,
        pages: updatedPages,
      };
    }

    case "DELETE_PAGE": {
      const page = state.pages.find((p) => p.id === action.payload);
      if (page?.isFixed) return state;

      const pageIndex = state.pages.findIndex((p) => p.id === action.payload);
      const isActivePage = action.payload === state.activePageId;

      console.log("DeletePage Debug:", {
        pageId: action.payload,
        pageIndex,
        isActivePage,
        activePageId: state.activePageId,
        totalPages: state.pages.length,
      });

      // Filtrar la página a eliminar
      const newPages = state.pages.filter((p) => p.id !== action.payload);

      // Si se eliminó la página activa, activar la página anterior
      if (isActivePage && newPages.length > 0) {
        let newActiveIndex;

        // Si era la última página, activar la penúltima
        if (pageIndex === state.pages.length - 1) {
          newActiveIndex = newPages.length - 1;
        } else {
          // Si no era la última, activar la anterior
          newActiveIndex = Math.max(0, pageIndex - 1);
        }

        const newActivePage = newPages[newActiveIndex];

        console.log("New active page:", {
          newActiveIndex,
          newActivePageId: newActivePage.id,
          newActivePageName: newActivePage.name,
        });

        console.log("Setting activePageId to:", newActivePage.id);

        // Marcar la nueva página como activa
        const updatedPages = newPages.map((p, index) => ({
          ...p,
          isActive: index === newActiveIndex,
        }));

        console.log(
          "Updated pages:",
          updatedPages.map((p) => ({
            id: p.id,
            name: p.name,
            isActive: p.isActive,
          })),
        );

        const newState = {
          activePageId: newActivePage.id,
          pages: updatedPages,
        };

        console.log("DELETE_PAGE: returning new state:", newState);
        return newState;
      }

      // Si no se eliminó la página activa, mantener el estado actual
      const newState = {
        ...state,
        pages: newPages,
      };

      console.log("DELETE_PAGE: returning filtered state:", newState);
      return newState;
    }

    case "RENAME_PAGE": {
      const { pageId, newName } = action.payload;
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, name: newName } : p,
        ),
      };
    }

    case "SET_AS_FIRST": {
      const pageIndex = state.pages.findIndex((p) => p.id === action.payload);
      if (pageIndex <= 1) return state;

      const page = state.pages[pageIndex];
      if (page.isFixed) return state;

      const newPages = [...state.pages];
      newPages.splice(pageIndex, 1);
      newPages.splice(1, 0, page);

      return {
        ...state,
        pages: newPages,
      };
    }

    default:
      return state;
  }
}

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  const setActivePage = useCallback((pageId: string) => {
    dispatch({ type: "SET_ACTIVE_PAGE", payload: pageId });
  }, []);

  const addPage = useCallback((afterIndex: number) => {
    dispatch({ type: "ADD_PAGE", payload: { afterIndex } });
  }, []);

  const reorderPages = useCallback((startIndex: number, endIndex: number) => {
    dispatch({ type: "REORDER_PAGES", payload: { startIndex, endIndex } });
  }, []);

  const duplicatePage = useCallback((pageId: string) => {
    dispatch({ type: "DUPLICATE_PAGE", payload: pageId });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    dispatch({ type: "DELETE_PAGE", payload: pageId });
  }, []);

  const renamePage = useCallback((pageId: string, newName: string) => {
    dispatch({ type: "RENAME_PAGE", payload: { pageId, newName } });
  }, []);

  const handleSetAsFirst = useCallback((pageId: string) => {
    dispatch({ type: "SET_AS_FIRST", payload: pageId });
  }, []);

  return (
    <FormBuilderContext.Provider
      value={{
        pages: state.pages,
        activePageId: state.activePageId,
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
