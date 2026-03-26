import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Folder, UserCircle, Ticket, 
  MessageSquare, BarChart3, Settings, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  count?: number | string;
  countColor?: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'CRM', href: '/crm', icon: Users, count: 12 },
  { name: 'Projects', href: '/projects', icon: Folder, count: 6 },
  { name: 'HR', href: '/hr', icon: UserCircle },
  { name: 'Tickets', href: '/tickets', icon: Ticket, count: 3 },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Reports', href: '/reports', icon: BarChart3, count: 'New', countColor: 'bg-green-100 text-green-700' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">DeskMate</h1>
            <p className="text-xs text-sidebar-foreground/60">Enterprise Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground border-r-2 border-blue-600"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      item.countColor || "bg-sidebar-accent text-sidebar-foreground/70"
                    )}>
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-xl p-4 border border-sidebar-border bg-sidebar-accent">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-sm text-sidebar-foreground">Upgrade Plan</span>
          </div>
          <p className="text-xs text-sidebar-foreground/70 mb-3">
            Get access to advanced features and unlimited users.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
