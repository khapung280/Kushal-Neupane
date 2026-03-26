import { cn } from '@/lib/utils';

interface ActivityItemProps {
  initials: string;
  color: string;
  title: string;
  description: string;
  time: string;
  badge?: {
    text: string;
    color: string;
  };
  onClick?: () => void;
}

export function ActivityItem({ initials, color, title, description, time, badge, onClick }: ActivityItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-3 rounded-lg transition-colors",
        onClick ? "cursor-pointer hover:bg-accent/40" : ""
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0", color)}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
        {badge && (
          <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium", badge.color)}>
            {badge.text}
          </span>
        )}
        <span className="text-xs text-muted-foreground/70">{time}</span>
      </div>
    </div>
  );
}
