import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  hint?: string;
}

/**
 * Global tooltip component that wraps the shadcn/ui tooltip
 */
const GlobalTooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 0,
  hint,
}: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className="bg-popover/95 border border-border/50 shadow-lg rounded-lg p-3 max-w-[300px] backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-popover-foreground">{content}</p>
            {hint && (
              <p className="text-xs text-muted-foreground/80 leading-relaxed">{hint}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GlobalTooltip;