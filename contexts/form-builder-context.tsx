"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { FormPage } from "@/types/form-builder";

/**
 * Interface defining the form builder context API
 * Provides methods to manage form pages and their state
 */
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

/**
 * Internal state structure for the form builder
 */
interface FormBuilderState {
  pages: FormPage[];
  activePageId: string;
}

/**
 * Action types for the form builder reducer
 * Each action represents a specific operation on the form pages
 */
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

/**
 * Initial state with default form pages
 * Includes fixed pages (Info and Ending) that cannot be deleted or reordered
 */
const initialState: FormBuilderState = {
  pages: [
    { id: "1", name: "Info", icon: "info", isActive: true, isFixed: true },
    { id: "2", name: "Details", icon: "document", isActive: false },
    { id: "3", name: "Other", icon: "document", isActive: false },
    { id: "4", name: "Ending", icon: "check", isActive: false, isFixed: true },
  ],
  activePageId: "1",
};

/**
 * Reducer function that handles all form builder state changes
 * Manages page operations like adding, deleting, reordering, and updating pages
 */
function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction,
): FormBuilderState {
  switch (action.type) {
    case "SET_ACTIVE_PAGE": {
      // Verify that the page exists before activating it
      const pageExists = state.pages.some((page) => page.id === action.payload);

      if (!pageExists) {
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

      // Update all pages so only the new one is active
      const updatedPages = newPages.map((page) => ({
        ...page,
        isActive: page.id === newPage.id,
      }));

      return {
        activePageId: newPage.id,
        pages: updatedPages,
      };
    }

    case "REORDER_PAGES": {
      const { startIndex, endIndex } = action.payload;
      // Prevent reordering of fixed pages (first and last)
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
      // Prevent duplication of fixed pages
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

      // Update all pages so only the duplicated one is active
      const updatedPages = newPages.map((page) => ({
        ...page,
        isActive: page.id === duplicatedPage.id,
      }));

      return {
        activePageId: duplicatedPage.id,
        pages: updatedPages,
      };
    }

    case "DELETE_PAGE": {
      const page = state.pages.find((p) => p.id === action.payload);
      // Prevent deletion of fixed pages
      if (page?.isFixed) return state;

      const pageIndex = state.pages.findIndex((p) => p.id === action.payload);
      const isActivePage = action.payload === state.activePageId;

      // Filter out the page to be deleted
      const newPages = state.pages.filter((p) => p.id !== action.payload);

      // If the active page was deleted, activate the previous page
      if (isActivePage && newPages.length > 0) {
        let newActiveIndex;

        // If it was the last page, activate the second to last
        if (pageIndex === state.pages.length - 1) {
          newActiveIndex = newPages.length - 1;
        } else {
          // If it wasn't the last, activate the previous one
          newActiveIndex = Math.max(0, pageIndex - 1);
        }

        const newActivePage = newPages[newActiveIndex];

        // Mark the new page as active
        const updatedPages = newPages.map((p, index) => ({
          ...p,
          isActive: index === newActiveIndex,
        }));

        const newState = {
          activePageId: newActivePage.id,
          pages: updatedPages,
        };

        return newState;
      }

      // If the active page wasn't deleted, maintain current state
      const newState = {
        ...state,
        pages: newPages,
      };

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
      // Prevent moving pages that are already at the beginning
      if (pageIndex <= 1) return state;

      const page = state.pages[pageIndex];
      // Prevent moving fixed pages
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

/**
 * Provider component that wraps the form builder context
 * Provides all the page management functions to child components
 */
export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  /**
   * Sets the specified page as the active page
   * Updates the active state of all pages accordingly
   */
  const setActivePage = useCallback((pageId: string) => {
    dispatch({ type: "SET_ACTIVE_PAGE", payload: pageId });
  }, []);

  /**
   * Adds a new page after the specified index
   * The new page becomes the active page automatically
   */
  const addPage = useCallback((afterIndex: number) => {
    dispatch({ type: "ADD_PAGE", payload: { afterIndex } });
  }, []);

  /**
   * Reorders pages by moving a page from startIndex to endIndex
   * Fixed pages (first and last) cannot be reordered
   */
  const reorderPages = useCallback((startIndex: number, endIndex: number) => {
    dispatch({ type: "REORDER_PAGES", payload: { startIndex, endIndex } });
  }, []);

  /**
   * Creates a copy of the specified page
   * The duplicated page becomes the active page
   * Fixed pages cannot be duplicated
   */
  const duplicatePage = useCallback((pageId: string) => {
    dispatch({ type: "DUPLICATE_PAGE", payload: pageId });
  }, []);

  /**
   * Deletes the specified page
   * If the deleted page was active, activates the previous page
   * Fixed pages cannot be deleted
   */
  const deletePage = useCallback((pageId: string) => {
    dispatch({ type: "DELETE_PAGE", payload: pageId });
  }, []);

  /**
   * Renames the specified page with the new name
   */
  const renamePage = useCallback((pageId: string, newName: string) => {
    dispatch({ type: "RENAME_PAGE", payload: { pageId, newName } });
  }, []);

  /**
   * Moves the specified page to the first position (after fixed pages)
   * Fixed pages cannot be moved
   */
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

/**
 * Hook to access the form builder context
 * Must be used within a FormBuilderProvider
 * Throws an error if used outside the provider
 */
export function useFormBuilderContext() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error(
      "useFormBuilderContext must be used within a FormBuilderProvider",
    );
  }
  return context;
}
