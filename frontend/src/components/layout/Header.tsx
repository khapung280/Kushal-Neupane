import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { CommandPalette } from '@/components/layout/CommandPalette';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as mockData from '@/data/mockData';

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview and key metrics' },
  '/crm': { title: 'CRM', subtitle: 'Customer relationship management' },
  '/projects': { title: 'Projects', subtitle: 'Project management and tracking' },
  '/hr': { title: 'Human Resources', subtitle: 'Employee management and operations' },
  '/tickets': { title: 'Support Tickets', subtitle: 'Customer support and issue tracking' },
  '/chat': { title: 'Internal Chat', subtitle: 'Team communication hub' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'Business insights and performance' },
  '/settings': { title: 'Settings', subtitle: 'System configuration and preferences' },
};

type HeaderProps = {
  onOpenSidebar?: () => void;
};

export function Header({ onOpenSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const info = pageInfo[location.pathname] || pageInfo['/'];
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [commandOpen, setCommandOpen] = useState(false);

  const notifications = useMemo(
    () =>
      [
        {
          title: 'New lead assigned',
          subtitle: 'Sarah Johnson from Acme Corp',
          time: '2 minutes ago',
          dotClass: 'bg-blue-600',
        },
        {
          title: 'Project completed',
          subtitle: 'Website Redesign marked as done',
          time: '1 hour ago',
          dotClass: 'bg-green-600',
        },
        {
          title: 'Leave request pending',
          subtitle: 'Mike Johnson requested 3 days off',
          time: '3 hours ago',
          dotClass: 'bg-amber-500',
        },
      ] as const,
    []
  );

  const userInitials = useMemo(() => {
    const parts = (mockData.currentUser?.email || 'employee@deskmate.com').split('@')[0].split(/[.\s_-]+/);
    const initials = parts.filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
    return initials || 'EM';
  }, []);

  return (
    <header className="min-h-16 bg-background border-b border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-0">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden shrink-0 p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col min-w-0 sm:flex-row sm:items-center sm:gap-2 sm:flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-foreground shrink-0">DeskMate</span>
            <span className="text-muted-foreground shrink-0">/</span>
            <span className="truncate">{info.title}</span>
          </div>
          <span className="text-muted-foreground/70 text-xs sm:ml-2 line-clamp-2 sm:line-clamp-1">
            {info.subtitle}
          </span>
        </div>
      </div>

      <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
        <div className="relative flex-1 min-w-0 sm:flex-initial sm:max-w-[min(20rem,100%)]">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground/70 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search… (⌘K)"
            className="w-full sm:w-80 pl-10 pr-10 sm:pr-12 py-2 bg-muted/40 border-border"
            readOnly
            onClick={() => setCommandOpen(true)}
            onFocus={() => setCommandOpen(true)}
          />
          <span className="hidden sm:inline absolute right-3 top-2 text-xs text-muted-foreground border border-border rounded px-1.5">
            ⌘K
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-[min(22.5rem,calc(100vw-2rem))] max-w-[360px] rounded-2xl border border-border bg-popover p-0 shadow-lg"
          >
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
            </div>
            <div className="px-2 pb-2">
              {notifications.map((n) => (
                <div
                  key={n.title}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/40"
                >
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.dotClass}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.subtitle}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground hover:bg-accent"
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 pl-4 border-l border-border hover:bg-accent/30 rounded-lg pr-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userInitials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">employee</p>
                <p className="text-xs text-muted-foreground">Employee</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-[min(16.25rem,calc(100vw-2rem))] max-w-[260px] rounded-2xl border border-border bg-popover p-0 shadow-lg"
          >
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-foreground">employee</p>
              <p className="text-xs text-muted-foreground">{mockData.currentUser.email}</p>
              <div className="mt-2 inline-flex rounded-md border border-border bg-muted/30 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                Employee
              </div>
            </div>
            <DropdownMenuSeparator className="my-0" />
            <div className="p-2">
              <DropdownMenuItem
                className="rounded-xl px-3 py-2"
                onSelect={() => navigate('/settings')}
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-2"
                onSelect={() => navigate('/settings')}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-xl px-3 py-2"
                onSelect={() => {
                  // Mock logout: return to dashboard.
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}
