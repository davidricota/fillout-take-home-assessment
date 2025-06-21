import { Info, FileText, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageIconProps {
  type: "info" | "document" | "check";
  className?: string;
  isActive?: boolean;
  isFocused?: boolean;
}

export function PageIcon({
  type,
  className,
  isActive,
  isFocused,
}: PageIconProps) {
  const iconMap = {
    info: Info,
    document: FileText,
    check: CircleCheck,
  };

  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        "page-icon-container",
        isActive || isFocused ? "icon-active" : "icon-default",
        className,
      )}
    >
      <Icon className="navbar-icon" />
    </div>
  );
}
