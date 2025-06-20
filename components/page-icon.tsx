import { Info, FileText, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageIconProps {
  type: "info" | "document" | "check";
  className?: string;
  isActive?: boolean;
}

export function PageIcon({ type, className, isActive }: PageIconProps) {
  const iconMap = {
    info: Info,
    document: FileText,
    check: CircleCheck,
  };

  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        isActive ? "text-icon-active" : "text-icon-inactive",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
