
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  className?: string;
}

export const StatusBadge = ({ 
  isActive, 
  activeText, 
  inactiveText, 
  className 
}: StatusBadgeProps) => {
  return (
    <Badge 
      variant={isActive ? "default" : "secondary"}
      className={cn(className)}
    >
      {isActive ? activeText : inactiveText}
    </Badge>
  );
};
