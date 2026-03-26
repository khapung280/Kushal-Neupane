import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MessageSquare,
  Settings,
  Ticket,
  Users,
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  Hash,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type NavigateItem = {
  label: string;
  description: string;
  to: string;
  icon: React.ReactNode;
};

type ActionItem = {
  label: string;
  description: string;
  to?: string;
  icon: React.ReactNode;
  onSelect?: () => void;
};

function Keycap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 items-center rounded-md border border-border bg-background px-2 text-[11px] font-medium text-muted-foreground shadow-xs",
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const navigateItems: NavigateItem[] = useMemo(
    () => [
      { label: "Dashboard", description: "View overview and metrics", to: "/", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "CRM", description: "Manage customers and deals", to: "/crm", icon: <UsersRound className="h-4 w-4" /> },
      { label: "Projects", description: "View and manage projects", to: "/projects", icon: <FolderKanban className="h-4 w-4" /> },
      { label: "HR", description: "Employee management", to: "/hr", icon: <Users className="h-4 w-4" /> },
      { label: "Tickets", description: "Support ticket management", to: "/tickets", icon: <Ticket className="h-4 w-4" /> },
      { label: "Chat", description: "Team communication", to: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
      { label: "Reports", description: "Analytics and insights", to: "/reports", icon: <BriefcaseBusiness className="h-4 w-4" /> },
      { label: "Settings", description: "Application settings", to: "/settings", icon: <Settings className="h-4 w-4" /> },
    ],
    []
  );

  const actionItems: ActionItem[] = useMemo(
    () => [
      {
        label: "Add New Customer",
        description: "Create a new customer record",
        to: "/crm",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        label: "Create New Project",
        description: "Start a new project",
        to: "/projects",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        label: "Add Employee",
        description: "Onboard a new team member",
        to: "/hr",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        label: "Create Ticket",
        description: "Submit a support ticket",
        to: "/tickets",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        label: "New Channel",
        description: "Create a communication channel",
        to: "/chat",
        icon: <Hash className="h-4 w-4" />,
      },
    ],
    []
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && isK) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (open && e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="max-w-[720px] overflow-hidden rounded-2xl border border-border bg-popover p-0 shadow-2xl"
      title="Search"
      description="Search for pages and actions"
    >
      <div className="relative">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search for pages, actions, customers, projects..."
          className="pr-32 text-foreground placeholder:text-muted-foreground/70"
        />
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <Keycap className="h-7 bg-muted/20">ESC</Keycap>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CommandList className="max-h-[420px] px-3 pb-3 pt-2">
        <CommandEmpty className="py-10 text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="NAVIGATE TO">
          {navigateItems.map((item) => (
            <CommandItem
              key={item.to}
              value={`${item.label} ${item.description}`}
              onSelect={() => go(item.to)}
              className={cn(
                "my-1 rounded-xl px-3 py-3",
                "border border-transparent",
                "hover:bg-muted/40 hover:border-border/60",
                "data-[selected=true]:bg-blue-600 data-[selected=true]:text-white",
                "data-[selected=true]:border-blue-600",
                "data-[selected=true]:[&_p]:text-white",
                "data-[selected=true]:[&_[data-slot=command-shortcut]]:text-white/90",
                "data-[selected=true]:[&_[data-slot=command-item-icon]]:bg-white/15 data-[selected=true]:[&_[data-slot=command-item-icon]]:text-white"
              )}
            >
              <span
                data-slot="command-item-icon"
                className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-muted/30 text-foreground"
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">{item.description}</p>
              </div>
              <CommandShortcut className="tracking-normal">
                <Keycap className="h-6 w-7 justify-center px-0 bg-muted/20">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Keycap>
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        <CommandGroup heading="QUICK ACTIONS">
          {actionItems.map((action) => (
            <CommandItem
              key={action.label}
              value={`${action.label} ${action.description}`}
              onSelect={() => {
                action.onSelect?.();
                if (action.to) go(action.to);
              }}
              className={cn(
                "my-1 rounded-xl px-3 py-3",
                "border border-transparent",
                "hover:bg-muted/40 hover:border-border/60",
                "data-[selected=true]:bg-blue-600 data-[selected=true]:text-white",
                "data-[selected=true]:border-blue-600",
                "data-[selected=true]:[&_p]:text-white data-[selected=true]:[&_[data-slot=command-shortcut]]:text-white/90",
                "data-[selected=true]:[&_[data-slot=command-item-icon]]:bg-white/15 data-[selected=true]:[&_[data-slot=command-item-icon]]:text-white"
              )}
            >
              <span
                data-slot="command-item-icon"
                className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-muted/30 text-foreground"
              >
                {action.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">{action.description}</p>
              </div>
              <CommandShortcut className="tracking-normal">
                <Keycap className="h-6 w-7 justify-center px-0 bg-muted/20">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Keycap>
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Keycap className="bg-muted/20">↑</Keycap>
          <Keycap className="bg-muted/20">↓</Keycap>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <Keycap className="bg-muted/20">Enter</Keycap>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-2">
          <Keycap className="bg-muted/20">ESC</Keycap>
          <span>Close</span>
        </div>
      </div>
    </CommandDialog>
  );
}

