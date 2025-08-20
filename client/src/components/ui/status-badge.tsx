import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "working" | "completed" | "progress";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "working":
        return {
          text: "Working on it",
          className: "bg-status-working text-monday-text hover:bg-status-working/80"
        };
      case "completed":
        return {
          text: "Completed/Live", 
          className: "bg-status-completed text-white hover:bg-status-completed/80"
        };
      case "progress":
        return {
          text: "In Progress",
          className: "bg-status-progress text-white hover:bg-status-progress/80"
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-700 hover:bg-gray-200"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full border-0",
        config.className,
        className
      )}
    >
      {config.text}
    </Badge>
  );
}
