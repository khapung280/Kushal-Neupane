import { Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  title: string;
  status: Project['status'];
  progress: number;
  priority: Project['priority'];
  dueDate: string;
  team: string[];
  onClick?: () => void;
}

const priorityStyles = {
  high: 'bg-red-500/10 text-red-400',
  medium: 'bg-amber-500/10 text-amber-300',
  low: 'bg-emerald-500/10 text-emerald-300',
};

const statusDisplay: Record<
  Project['status'],
  { label: string; dot: string }
> = {
  planning: { label: 'Planning', dot: 'bg-yellow-500' },
  'in-progress': { label: 'In Progress', dot: 'bg-blue-500' },
  'on-hold': { label: 'On Hold', dot: 'bg-red-500' },
  completed: { label: 'Completed', dot: 'bg-green-500' },
};

const teamColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

export function ProjectCard({ title, status, progress, priority, dueDate, team, onClick }: ProjectCardProps) {
  const { label: statusLabel, dot: statusDot } = statusDisplay[status];

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-4 transition-shadow bg-card",
        onClick ? "cursor-pointer hover:shadow-lg" : "hover:shadow-lg"
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
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-foreground">{title}</h4>
        <span className={cn('px-2 py-1 text-xs rounded-full font-medium capitalize shrink-0', priorityStyles[priority])}>
          {priority}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <span className={cn('w-2 h-2 rounded-full shrink-0', statusDot)} aria-hidden />
        <span>{statusLabel}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-muted [&_[data-slot=progress-indicator]]:bg-blue-600"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex -space-x-2">
          {team.map((member, idx) => (
            <div
              key={idx}
              className={cn(
                'w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium',
                teamColors[idx % teamColors.length]
              )}
            >
              {member}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 shrink-0 text-muted-foreground/70" />
          <span>{dueDate}</span>
        </div>
      </div>
    </div>
  );
}
