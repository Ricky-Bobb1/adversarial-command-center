
import { Badge } from "@/components/ui/badge";
import { AGENT_COLORS } from "@/constants/simulation";
import { cn } from "@/lib/utils";
import type { AgentType } from "@/types/simulation";

interface AgentBadgeProps {
  agent: AgentType;
  className?: string;
}

export const AgentBadge = ({ agent, className }: AgentBadgeProps) => {
  const colors = AGENT_COLORS[agent];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "min-w-[80px] justify-center text-xs",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {agent}
    </Badge>
  );
};
