export interface FormPage {
  id: string;
  name: string;
  icon: "info" | "document" | "check";
  isActive?: boolean;
  isFixed?: boolean;
}

export interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  variant?: "default" | "destructive";
  action: () => void;
}

export interface DragItem {
  id: string;
  index: number;
}
