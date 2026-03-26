import { TrendingUp, TrendingDown, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: 'dollar' | 'users' | 'check' | 'clock';
}

const icons = {
  dollar: DollarSign,
  users: Users,
  check: CheckCircle,
  clock: Clock,
};

const iconStyles = {
  dollar: 'bg-emerald-500/10 text-emerald-400',
  users: 'bg-blue-500/10 text-blue-400',
  check: 'bg-purple-500/10 text-purple-400',
  clock: 'bg-amber-500/10 text-amber-400',
};

export function StatCard({ title, value, change, changeLabel = 'vs previous period', icon }: StatCardProps) {
  const Icon = icons[icon];
  const isPositive = change >= 0;

  return (
    <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          <p className={cn(
            "text-xs mt-1 flex items-center gap-1",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}{change}% <span className="text-muted-foreground/70">{changeLabel}</span>
          </p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconStyles[icon])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
