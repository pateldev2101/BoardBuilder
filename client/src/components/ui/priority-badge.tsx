import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case "low":
        return {
          text: "Low",
          className: "bg-priority-low text-white hover:bg-priority-low/80"
        };
      case "medium":
        return {
          text: "Medium",
          className: "bg-priority-medium text-white hover:bg-priority-medium/80"
        };
      case "high":
        return {
          text: "High", 
          className: "bg-priority-high text-white hover:bg-priority-high/80"
        };
      default:
        return {
          text: priority,
          className: "bg-gray-100 text-gray-700 hover:bg-gray-200"
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <Badge 
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full border-0",
        config.className,
        className
      )}
    >
      {config.text}
    </Badge>
  );
}
