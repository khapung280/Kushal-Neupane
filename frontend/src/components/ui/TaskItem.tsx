import { cn } from '@/lib/utils';

interface TaskItemProps {
  title: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  dueLabel: string;
  assignee: {
    initials: string;
    color: string;
    name: string;
  };
  onClick?: () => void;
}

const priorityBadgeStyles = {
  high: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
  medium: 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20',
};

export function TaskItem({ title, project, priority, dueLabel, assignee, onClick }: TaskItemProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card px-4 py-3 shadow-xs transition-shadow",
        "hover:shadow-md",
        onClick ? "cursor-pointer" : ""
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{project}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
            priorityBadgeStyles[priority]
          )}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
              assignee.color
            )}
          >
            {assignee.initials}
          </div>
          <span className="truncate text-xs text-muted-foreground">{assignee.name}</span>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground/70">{dueLabel}</span>
      </div>
    </div>
  );
}
