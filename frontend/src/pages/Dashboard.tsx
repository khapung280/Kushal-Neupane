import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  DollarSign,
  Flag,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  ShieldAlert,
  Target,
  Ticket,
  User,
  Wrench,
  Users2,
  UserPlus,
  Users,
  FolderKanban,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/StatCard';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ActivityItem } from '@/components/ui/ActivityItem';
import { TaskItem } from '@/components/ui/TaskItem';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { dashboardApi } from '@/services/api';
import type { DashboardStats, Activity, Task, Project } from '@/types';
import * as mockData from '@/data/mockData';
import { EmployeeSheet, type EmployeeFormState, type EmployeeSheetMode } from '@/components/hr/EmployeeSheet';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('last-30-days');
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
  const [projectSheetOpen, setProjectSheetOpen] = useState(false);
  const [projectSheetMode, setProjectSheetMode] = useState<'create' | 'update'>('create');
  const [activeProjectMeta, setActiveProjectMeta] = useState<{ id?: string; progress?: number }>({});
  const [employeeSheetOpen, setEmployeeSheetOpen] = useState(false);
  const [employeeMode, setEmployeeMode] = useState<EmployeeSheetMode>('edit');
  const [ticketSheetOpen, setTicketSheetOpen] = useState(false);
  const [integrationSheetOpen, setIntegrationSheetOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    companyName: 'Sarah Johnson',
    primaryContact: '',
    email: 'contact@company.com',
    phone: '+1 (555) 123-4567',
    website: 'https://company.com',
    street: '123 Business Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: '',
    industry: '',
    companySize: '',
    priorityLevel: 'medium',
    leadSource: '',
    estimatedDealValue: '50000',
    currency: 'USD',
    notes: '',
  });
  const [projectForm, setProjectForm] = useState({
    projectName: 'Website Redesign',
    projectDescription: '',
    category: '',
    priority: 'medium',
    initialStatus: 'planning',
    startDate: '',
    targetEndDate: '',
    estimatedHours: '120',
    budget: '25000',
    currency: 'USD',
    hourlyRate: '150',
    projectManager: '',
    client: '',
    teamMembers: [] as string[],
    objectives: '',
    deliverables: '',
    tags: [] as string[],
    tagDraft: '',
  });
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormState>({
    firstName: 'Mike',
    lastName: 'Chen',
    workEmail: 'mike.chen@deskmate.com',
    phoneNumber: '+1 (555) 123-4567',
    dateOfBirth: '',
    personalEmail: 'john@personal.com',

    employeeId: 'EMP001',
    department: '',
    position: '',
    reportingTo: '',
    startDate: '',
    employmentType: 'Full-time',
    workLocation: 'Office',
    role: 'Employee',

    annualSalary: '75000',
    currency: 'USD',
    payFrequency: 'Monthly',
    benefits: '',

    skills: '',
    emergencyContactName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    additionalNotes: '',

    accessLevel: 'Standard',
    activeEmployee: true,
    systemLoginAccess: true,
    sendWelcomeEmail: true,
  });
  const [ticketForm, setTicketForm] = useState({
    ticketTitle: '',
    description: '',
    ticketType: 'bug',
    category: '',
    source: 'email',
    priority: 'medium',
    status: 'open',
    customerName: 'John Doe',
    company: '',
    customerEmail: 'customer@company.com',
    customerPhone: '+1 (555) 123-4567',
    customerId: 'CUST-001',
    assignedTo: '',
    department: 'Support',
    product: '',
    version: 'v2.1.0',
    environment: 'Production',
    stepsToReproduce: '1. Go to...\n2. Click on...\n3. Enter...',
    expectedBehavior: 'What should have happened?',
    actualBehavior: 'What actually happened?',
    businessImpact: 'low',
    affectedUsers: '1',
    escalationLevel: 'level-1',
    dueDate: '',
    estimatedResolutionTime: '',
    tagDraft: '',
    relatedTickets: '',
    externalLinks: '',
    internalNotes: 'Editing ticket: TK-042',
  });
  const [integrationForm, setIntegrationForm] = useState({
    integrationName: 'My CRM Integration',
    integrationType: '',
    provider: '',
    category: 'api',
    description: '',
    apiEndpoint: 'https://api.example.com/v1',
    authenticationMethod: 'apiKey',
    apiKey: '',
    webhookUrl: 'https://yourapp.com/webhooks/integration',
    syncFrequency: 'hourly',
    rateLimitPerHour: '1000',
    timeoutSeconds: '30',
    enableIntegration: true,
    autoSync: true,
    dataMapping: {
      users: true,
      customers: true,
      orders: true,
      products: true,
      analytics: true,
    },
    enableNotifications: true,
    errorNotifications: true,
    successNotifications: true,
    notificationEmail: 'admin@company.com',
    customHeadersJson: '{"X-Custom-Header": "value", "Authorization": "Bearer token"}',
    customParametersJson: '{"param1": "value1", "param2": "value2"}',
    notes: '',
  });

  const openAddCustomerSheet = () => {
    setCustomerForm({
      companyName: '',
      primaryContact: '',
      email: 'contact@company.com',
      phone: '+1 (555) 123-4567',
      website: 'https://company.com',
      street: '123 Business Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: '',
      industry: '',
      companySize: '',
      priorityLevel: 'medium',
      leadSource: '',
      estimatedDealValue: '50000',
      currency: 'USD',
      notes: '',
    });
    setCustomerSheetOpen(true);
  };

  const openAddEmployeeSheet = () => {
    setEmployeeMode('add');
    setEmployeeForm({
      firstName: 'John',
      lastName: 'Doe',
      workEmail: 'john.doe@company.com',
      phoneNumber: '+1 (555) 123-4567',
      dateOfBirth: '',
      personalEmail: 'john@personal.com',
      employeeId: 'EMP001',
      department: '',
      position: '',
      reportingTo: '',
      startDate: '',
      employmentType: 'Full-time',
      workLocation: 'Office',
      role: 'Employee',
      annualSalary: '75000',
      currency: 'USD',
      payFrequency: 'Monthly',
      benefits: '',
      skills: '',
      emergencyContactName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      additionalNotes: '',
      accessLevel: 'Standard',
      activeEmployee: true,
      systemLoginAccess: true,
      sendWelcomeEmail: true,
    });
    setEmployeeSheetOpen(true);
  };

  const openAddIntegrationSheet = () => {
    setIntegrationForm({
      integrationName: 'My CRM Integration',
      integrationType: '',
      provider: '',
      category: 'api',
      description: '',
      apiEndpoint: 'https://api.example.com/v1',
      authenticationMethod: 'apiKey',
      apiKey: '',
      webhookUrl: 'https://yourapp.com/webhooks/integration',
      syncFrequency: 'hourly',
      rateLimitPerHour: '1000',
      timeoutSeconds: '30',
      enableIntegration: true,
      autoSync: true,
      dataMapping: {
        users: true,
        customers: true,
        orders: true,
        products: true,
        analytics: true,
      },
      enableNotifications: true,
      errorNotifications: true,
      successNotifications: true,
      notificationEmail: 'admin@company.com',
      customHeadersJson: '{"X-Custom-Header": "value", "Authorization": "Bearer token"}',
      customParametersJson: '{"param1": "value1", "param2": "value2"}',
      notes: '',
    });
    setIntegrationSheetOpen(true);
  };

  const openCreateProjectSheet = () => {
    setProjectForm({
      projectName: '',
      projectDescription: '',
      category: '',
      priority: 'medium',
      initialStatus: 'planning',
      startDate: '',
      targetEndDate: '',
      estimatedHours: '120',
      budget: '25000',
      currency: 'USD',
      hourlyRate: '150',
      projectManager: '',
      client: '',
      teamMembers: [],
      objectives: '',
      deliverables: '',
      tags: [],
      tagDraft: '',
    });
    setProjectSheetMode('create');
    setActiveProjectMeta({});
    setProjectSheetOpen(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, tasksData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getActivities(),
        dashboardApi.getTasks(),
      ]);
      setStats(statsData);
      setActivities(activitiesData);
      setTasks(tasksData);
      setProjects(mockData.projects);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-3 rounded-xl border-border bg-card px-4 text-foreground shadow-xs hover:bg-accent"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {period === 'today'
                    ? 'Today'
                    : period === 'last-7-days'
                      ? 'Last 7 days'
                      : period === 'last-90-days'
                        ? 'Last 90 days'
                        : period === 'this-month'
                          ? 'This month'
                          : period === 'last-month'
                            ? 'Last month'
                            : period === 'this-quarter'
                              ? 'This quarter'
                              : period === 'this-year'
                                ? 'This year'
                                : 'Last 30 days'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={10}
              className="w-[min(18.75rem,calc(100vw-2rem))] max-w-[300px] rounded-2xl border border-border bg-popover p-0 shadow-lg"
            >
              <DropdownMenuLabel className="px-6 py-4 text-xs font-semibold tracking-widest text-muted-foreground">
                SELECT PERIOD
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-0 my-0 bg-border" />
              <div className="py-2">
                <DropdownMenuItem
                  onSelect={() => setPeriod('today')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'today' && 'bg-accent'
                  )}
                >
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('last-7-days')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'last-7-days' && 'bg-accent'
                  )}
                >
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('last-30-days')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'last-30-days' && 'bg-accent'
                  )}
                >
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('last-90-days')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'last-90-days' && 'bg-accent'
                  )}
                >
                  Last 90 days
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="mx-0 my-0 bg-border" />

              <div className="py-2">
                <DropdownMenuItem
                  onSelect={() => setPeriod('this-month')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'this-month' && 'bg-accent'
                  )}
                >
                  This month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('last-month')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'last-month' && 'bg-accent'
                  )}
                >
                  Last month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('this-quarter')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'this-quarter' && 'bg-accent'
                  )}
                >
                  This quarter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setPeriod('this-year')}
                  className={cn(
                    'cursor-pointer rounded-none px-6 py-2.5 text-sm text-foreground focus:bg-accent',
                    period === 'this-year' && 'bg-accent'
                  )}
                >
                  This year
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 gap-3 rounded-xl bg-blue-600 px-5 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Quick Action</span>
                <ChevronDown className="h-4 w-4 opacity-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-[min(22.5rem,calc(100vw-2rem))] max-w-[360px] rounded-2xl border border-border bg-popover p-0 shadow-lg"
            >
              <DropdownMenuLabel className="px-6 py-4 text-xs font-semibold tracking-widest text-muted-foreground">
                CREATE NEW
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-0 my-0 bg-border" />
              <div className="p-2">
                <DropdownMenuItem
                  className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    openCreateProjectSheet();
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">New Project</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Create a new project</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    openAddCustomerSheet();
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Add Customer</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Add new customer/lead</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    openAddEmployeeSheet();
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Add Employee</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Onboard new team member</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    openAddIntegrationSheet();
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-100">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">New Integration</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Connect external service</p>
                  </div>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="mx-0 my-0 bg-border" />
              <DropdownMenuLabel className="px-6 py-4 text-xs font-semibold tracking-widest text-muted-foreground">
                COMMUNICATION
              </DropdownMenuLabel>
              <div className="p-2 pt-0">
                <DropdownMenuItem className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
                    <Ticket className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Support Ticket</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Create support ticket</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-4 rounded-xl px-4 py-3 focus:bg-accent">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">New Channel</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Create communication channel</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon="dollar"
        />
        <StatCard
          title="Active Customers"
          value={stats.customers.toLocaleString()}
          change={stats.customersChange}
          icon="users"
        />
        <StatCard
          title="Projects Delivered"
          value={stats.projects}
          change={stats.projectsChange}
          icon="check"
        />
        <StatCard
          title="Response Time"
          value={stats.responseTime}
          change={stats.responseTimeChange}
          icon="clock"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <button className="text-sm text-blue-500 hover:text-blue-400">View All</button>
          </div>
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                initials={activity.user.initials}
                color={activity.user.color}
                title={activity.title}
                description={activity.description}
                time={activity.timestamp}
                badge={activity.badge}
                onClick={
                  activity.type === 'lead'
                    ? () => {
                        const sarah = mockData.customers.find((c) => c.name === 'Sarah Johnson');
                        setCustomerForm((prev) => ({
                          ...prev,
                          companyName: sarah?.name ?? prev.companyName,
                          phone: sarah?.phone ?? prev.phone,
                          email: sarah?.email ?? prev.email,
                          city: sarah?.location?.split(',')[0] ?? prev.city,
                          priorityLevel: sarah?.priority ?? prev.priorityLevel,
                        }));
                        setCustomerSheetOpen(true);
                      }
                    : activity.type === 'deal'
                      ? () => {
                          const techStartContact = mockData.customers.find((c) => c.company === 'TechStart Inc');
                          setCustomerForm((prev) => ({
                            ...prev,
                            companyName: activity.description || 'TechStart Inc - $45,000 contract',
                            phone: techStartContact?.phone ?? prev.phone,
                            email: techStartContact?.email ?? prev.email,
                            city: techStartContact?.location?.split(',')[0] ?? prev.city,
                            priorityLevel: techStartContact?.priority ?? prev.priorityLevel,
                          }));
                          setCustomerSheetOpen(true);
                        }
                    : activity.type === 'project' || activity.type === 'meeting'
                      ? () => {
                          const fallbackName =
                            activity.type === 'project'
                              ? (activity.description?.split(' - ')[0] ?? '').trim()
                              : (activity.description ?? '').trim();

                          const proj =
                            mockData.projects.find((p) => p.name === fallbackName) ??
                            mockData.projects.find((p) => fallbackName && p.name.startsWith(fallbackName)) ??
                            mockData.projects.find((p) => fallbackName && fallbackName.startsWith(p.name)) ??
                            (activity.type === 'meeting'
                              ? mockData.projects.find((p) => p.name.includes('Mobile App'))
                              : undefined);

                          setProjectForm((prev) => ({
                            ...prev,
                            projectName: fallbackName || proj?.name || prev.projectName,
                            projectDescription: proj?.description ?? prev.projectDescription,
                            priority: (proj?.priority as 'high' | 'medium' | 'low') ?? prev.priority,
                            initialStatus:
                              (proj?.status as 'planning' | 'in-progress' | 'on-hold' | 'completed') ??
                              prev.initialStatus,
                            budget: proj?.budget != null ? String(proj.budget) : prev.budget,
                            teamMembers: proj?.team ?? prev.teamMembers,
                          }));
                          setActiveProjectMeta({ id: proj?.id, progress: proj?.progress });
                          setProjectSheetMode('update');
                          setProjectSheetOpen(true);
                        }
                      : activity.type === 'payment'
                        ? () => {
                            toast.success('Payment Details', {
                              description: 'Invoice #INV-2024-001 - $15,750 (paid)',
                              className:
                                'border border-emerald-200 bg-emerald-50 text-emerald-900',
                              descriptionClassName: 'text-emerald-800',
                            });
                          }
                      : activity.type === 'ticket'
                        ? () => {
                            setTicketForm((prev) => ({
                              ...prev,
                              ticketTitle: 'Login issue - TK-042',
                            }));
                            setTicketSheetOpen(true);
                          }
                      : activity.type === 'leave'
                        ? () => {
                            setEmployeeMode('edit');
                            setEmployeeForm((prev) => ({
                              ...prev,
                              firstName: 'Mike',
                              lastName: 'Chen',
                              workEmail: 'mike.chen@deskmate.com',
                              phoneNumber: '+1 (555) 123-4567',
                              employeeId: 'EMP001',
                              employmentType: prev.employmentType || 'Full-time',
                              workLocation: prev.workLocation || 'Office',
                              role: prev.role || 'Employee',
                              annualSalary: prev.annualSalary || '75000',
                              currency: prev.currency || 'USD',
                              payFrequency: prev.payFrequency || 'Monthly',
                              accessLevel: prev.accessLevel || 'Standard',
                            }));
                            setEmployeeSheetOpen(true);
                          }
                      : activity.type === 'hire'
                        ? () => {
                            setEmployeeMode('edit');
                            setEmployeeForm((prev) => ({
                              ...prev,
                              firstName: 'Jessica',
                              lastName: 'Liu',
                              workEmail: 'jessica.liu@deskmate.com',
                              phoneNumber: '+1 (555) 123-4567',
                              dateOfBirth: '',
                              personalEmail: 'john@personal.com',
                              employeeId: 'EMP001',
                              department: 'Engineering',
                              position: 'Frontend Developer',
                              reportingTo: '',
                              startDate: '',
                              employmentType: 'Full-time',
                              workLocation: 'Office',
                              role: 'Employee',
                              annualSalary: '75000',
                              currency: 'USD',
                              payFrequency: 'Monthly',
                              benefits: '',
                              skills: '',
                              emergencyContactName: '',
                              emergencyPhone: '',
                              emergencyRelationship: '',
                              additionalNotes: '',
                              accessLevel: 'Standard',
                              activeEmployee: true,
                              systemLoginAccess: true,
                              sendWelcomeEmail: true,
                            }));
                            setEmployeeSheetOpen(true);
                          }
                      : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-6">Upcoming Tasks</h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                project={task.project}
                priority={task.priority}
                dueLabel={task.dueLabel}
                assignee={task.assignee}
                onClick={() => {
                  setProjectForm((prev) => ({
                    ...prev,
                    projectName: task.project,
                    projectDescription: prev.projectDescription || '',
                    category: '',
                    priority: task.priority,
                    initialStatus: 'planning',
                    startDate: '',
                    targetEndDate: '',
                    estimatedHours: '120',
                    budget: '25000',
                    currency: 'USD',
                    hourlyRate: '150',
                    projectManager: '',
                    client: '',
                    teamMembers: [],
                    objectives: '',
                    deliverables: '',
                    tags: [],
                    tagDraft: '',
                  }));
                  setProjectSheetMode('create');
                  setActiveProjectMeta({});
                  setProjectSheetOpen(true);
                }}
              />
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="font-semibold text-foreground">Project Progress</h3>
          <Button variant="outline" size="sm" onClick={openCreateProjectSheet}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              status={project.status}
              progress={project.progress}
              priority={project.priority}
              dueDate={new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              team={project.team}
              onClick={() => {
                setProjectForm((prev) => ({
                  ...prev,
                  projectName: project.name,
                  projectDescription: project.description ?? prev.projectDescription,
                  priority: project.priority,
                  initialStatus: project.status,
                  budget: project.budget != null ? String(project.budget) : prev.budget,
                  teamMembers: project.team,
                }));
                setActiveProjectMeta({ id: project.id, progress: project.progress });
                setProjectSheetMode('update');
                setProjectSheetOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full border-l border-border p-0 sm:max-w-[min(720px,100vw)]"
        >
          <SheetHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-border">
            <SheetTitle className="text-xl">Add New Customer</SheetTitle>
            <SheetDescription>
              Create a new customer record with contact and business information
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Basic Information</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={customerForm.companyName}
                          onChange={(e) =>
                            setCustomerForm((p) => ({ ...p, companyName: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Primary Contact <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="Contact person name"
                          value={customerForm.primaryContact}
                          onChange={(e) =>
                            setCustomerForm((p) => ({ ...p, primaryContact: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Mail className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm((p) => ({ ...p, email: e.target.value }))}
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Phone className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={customerForm.phone}
                          onChange={(e) => setCustomerForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <InputGroup className="bg-background">
                      <InputGroupAddon>
                        <Globe className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        value={customerForm.website}
                        onChange={(e) =>
                          setCustomerForm((p) => ({ ...p, website: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Address Information</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street Address</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={customerForm.street}
                        onChange={(e) => setCustomerForm((p) => ({ ...p, street: e.target.value }))}
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={customerForm.city}
                          onChange={(e) => setCustomerForm((p) => ({ ...p, city: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State/Province</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={customerForm.state}
                          onChange={(e) => setCustomerForm((p) => ({ ...p, state: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP/Postal Code</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={customerForm.zip}
                          onChange={(e) => setCustomerForm((p) => ({ ...p, zip: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Select
                        value={customerForm.country}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, country: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Business Details</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <Select
                        value={customerForm.industry}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, industry: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Size</label>
                      <Select
                        value={customerForm.companySize}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, companySize: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority Level</label>
                      <Select
                        value={customerForm.priorityLevel}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, priorityLevel: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Medium Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lead Source</label>
                      <Select
                        value={customerForm.leadSource}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, leadSource: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="How did they find us?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="ads">Ads</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estimated Deal Value</label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <DollarSign className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={customerForm.estimatedDealValue}
                          onChange={(e) =>
                            setCustomerForm((p) => ({ ...p, estimatedDealValue: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Currency</label>
                      <Select
                        value={customerForm.currency}
                        onValueChange={(v) => setCustomerForm((p) => ({ ...p, currency: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        placeholder="Any additional information about this customer..."
                        value={customerForm.notes}
                        onChange={(e) => setCustomerForm((p) => ({ ...p, notes: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-6"
                onClick={() => setCustomerSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button className="h-10 rounded-xl bg-blue-600 px-7 hover:bg-blue-700">
                Add Customer
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={projectSheetOpen} onOpenChange={setProjectSheetOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full border-l border-border p-0 sm:max-w-[min(720px,100vw)]"
        >
          <SheetHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-border">
            <SheetTitle className="text-xl">
              {projectSheetMode === 'update' ? 'Edit Project' : 'Create New Project'}
            </SheetTitle>
            <SheetDescription>
              {projectSheetMode === 'update'
                ? 'Update project information, team, and track progress'
                : 'Set up a new project with team, timeline, and budget details'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-6">
              {projectSheetMode === 'update' && (
                <Card className="rounded-2xl border border-blue-100 bg-blue-50/70 shadow-md dark:border-blue-500/15 dark:bg-blue-950/25">
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-blue-800 dark:text-blue-200">
                          Editing Project
                        </p>
                        <p className="truncate text-sm text-blue-700/90 dark:text-blue-200/70">
                          Project ID: {activeProjectMeta.id} • Current Progress: {activeProjectMeta.progress ?? 0}%
                        </p>
                      </div>
                    </div>

                    <div className="w-full shrink-0 sm:w-44">
                      <div className="mb-2 flex items-center justify-end text-sm font-medium text-blue-700 dark:text-blue-200">
                        Progress
                      </div>
                      <Progress
                        value={activeProjectMeta.progress ?? 0}
                        className="h-2.5 bg-blue-200/70 [&_[data-slot=progress-indicator]]:bg-blue-600 dark:bg-blue-500/20 dark:[&_[data-slot=progress-indicator]]:bg-blue-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Project Information</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={projectForm.projectName}
                          onChange={(e) =>
                            setProjectForm((p) => ({ ...p, projectName: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={projectForm.category}
                        onValueChange={(v) => setProjectForm((p) => ({ ...p, category: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        placeholder="Describe the project goals and scope..."
                        value={projectForm.projectDescription}
                        onChange={(e) =>
                          setProjectForm((p) => ({ ...p, projectDescription: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={projectForm.priority}
                        onValueChange={(v) =>
                          setProjectForm((p) => ({ ...p, priority: v as typeof p.priority }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Medium" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Status</label>
                      <Select
                        value={projectForm.initialStatus}
                        onValueChange={(v) =>
                          setProjectForm((p) => ({
                            ...p,
                            initialStatus: v as typeof p.initialStatus,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Planning" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Timeline &amp; Budget</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="dd-----yyyy"
                          value={projectForm.startDate}
                          onChange={(e) => setProjectForm((p) => ({ ...p, startDate: e.target.value }))}
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target End Date</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="dd-----yyyy"
                          value={projectForm.targetEndDate}
                          onChange={(e) =>
                            setProjectForm((p) => ({ ...p, targetEndDate: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estimated Hours</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={projectForm.estimatedHours}
                          onChange={(e) =>
                            setProjectForm((p) => ({ ...p, estimatedHours: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Budget</label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <DollarSign className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={projectForm.budget}
                          onChange={(e) => setProjectForm((p) => ({ ...p, budget: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Currency</label>
                      <Select
                        value={projectForm.currency}
                        onValueChange={(v) => setProjectForm((p) => ({ ...p, currency: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hourly Rate</label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Flag className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={projectForm.hourlyRate}
                          onChange={(e) =>
                            setProjectForm((p) => ({ ...p, hourlyRate: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Team &amp; Client</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Manager</label>
                      <Select
                        value={projectForm.projectManager}
                        onValueChange={(v) => setProjectForm((p) => ({ ...p, projectManager: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select project manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.employees.map((e) => (
                            <SelectItem key={e.id} value={e.name}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Client</label>
                      <Select
                        value={projectForm.client}
                        onValueChange={(v) => setProjectForm((p) => ({ ...p, client: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.customers.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Assigned Team Members</label>
                    <div className="flex flex-wrap gap-2">
                      {projectForm.teamMembers.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() =>
                            setProjectForm((p) => ({
                              ...p,
                              teamMembers: p.teamMembers.filter((x) => x !== m),
                            }))
                          }
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-accent"
                          title="Remove"
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value=""
                        onValueChange={(v) =>
                          setProjectForm((p) => ({
                            ...p,
                            teamMembers: p.teamMembers.includes(v)
                              ? p.teamMembers
                              : [...p.teamMembers, v],
                          }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Add team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.employees.map((e) => (
                            <SelectItem key={e.id} value={e.name}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Project Details</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Objectives</label>
                    <InputGroup className="min-h-24 bg-background">
                      <InputGroupTextarea
                        placeholder="What are the main goals and objectives of this project?"
                        value={projectForm.objectives}
                        onChange={(e) =>
                          setProjectForm((p) => ({ ...p, objectives: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Deliverables</label>
                    <InputGroup className="min-h-24 bg-background">
                      <InputGroupTextarea
                        placeholder="List the main deliverables and milestones..."
                        value={projectForm.deliverables}
                        onChange={(e) =>
                          setProjectForm((p) => ({ ...p, deliverables: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Tags</label>
                    <div className="flex items-center gap-3">
                      <InputGroup className="flex-1 bg-background">
                        <InputGroupInput
                          placeholder="Add a tag..."
                          value={projectForm.tagDraft}
                          onChange={(e) =>
                            setProjectForm((p) => ({ ...p, tagDraft: e.target.value }))
                          }
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => {
                          const tag = projectForm.tagDraft.trim();
                          if (!tag) return;
                          setProjectForm((p) => ({
                            ...p,
                            tags: p.tags.includes(tag) ? p.tags : [...p.tags, tag],
                            tagDraft: '',
                          }));
                        }}
                        aria-label="Add tag"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-6"
                onClick={() => setProjectSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button className="h-10 rounded-xl bg-blue-600 px-7 hover:bg-blue-700">
                {projectSheetMode === 'update' ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={ticketSheetOpen} onOpenChange={setTicketSheetOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full border-l border-border p-0 sm:max-w-[min(720px,100vw)]"
        >
          <SheetHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-border">
            <SheetTitle className="text-xl">Edit Support Ticket</SheetTitle>
            <SheetDescription>
              Update ticket information and track progress
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Editing Ticket</p>
                    <p className="text-sm text-muted-foreground">
                      Ticket ID: <span className="font-medium text-foreground">TK-042</span> • Created:{' '}
                      <span className="text-muted-foreground">—</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Ticket Information</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Ticket Title <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="Brief description of the issue"
                        value={ticketForm.ticketTitle}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, ticketTitle: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="min-h-24 bg-background">
                      <InputGroupTextarea
                        placeholder="Detailed description of the issue or request..."
                        value={ticketForm.description}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, description: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Ticket Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ticketForm.ticketType}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, ticketType: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Bug Report" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={ticketForm.category}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, category: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="ui">UI</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Source</label>
                      <Select
                        value={ticketForm.source}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, source: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Email" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="web">Web</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ticketForm.priority}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, priority: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Medium" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={ticketForm.status}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, status: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Open" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Customer Information</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={ticketForm.customerName}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, customerName: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="Company Name"
                          value={ticketForm.company}
                          onChange={(e) => setTicketForm((p) => ({ ...p, company: e.target.value }))}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Mail className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={ticketForm.customerEmail}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, customerEmail: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Phone className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          value={ticketForm.customerPhone}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, customerPhone: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer ID (Optional)</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={ticketForm.customerId}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, customerId: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Assignment &amp; Technical Details</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assigned To</label>
                      <Select
                        value={ticketForm.assignedTo}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, assignedTo: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.employees.map((e) => (
                            <SelectItem key={e.id} value={e.name}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={ticketForm.department}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, department: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product/Service</label>
                      <Select
                        value={ticketForm.product}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, product: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="crm">CRM</SelectItem>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="auth">Auth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Version</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={ticketForm.version}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, version: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Environment</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={ticketForm.environment}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, environment: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Bug Report Details</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Steps to Reproduce</label>
                    <InputGroup className="min-h-24 bg-background">
                      <InputGroupTextarea
                        value={ticketForm.stepsToReproduce}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, stepsToReproduce: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expected Behavior</label>
                      <InputGroup className="min-h-24 bg-background">
                        <InputGroupTextarea
                          value={ticketForm.expectedBehavior}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, expectedBehavior: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Actual Behavior</label>
                      <InputGroup className="min-h-24 bg-background">
                        <InputGroupTextarea
                          value={ticketForm.actualBehavior}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, actualBehavior: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Impact &amp; Timeline</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Impact</label>
                      <Select
                        value={ticketForm.businessImpact}
                        onValueChange={(v) => setTicketForm((p) => ({ ...p, businessImpact: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Low" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Affected Users</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={ticketForm.affectedUsers}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, affectedUsers: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Escalation Level</label>
                      <Select
                        value={ticketForm.escalationLevel}
                        onValueChange={(v) =>
                          setTicketForm((p) => ({ ...p, escalationLevel: v }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Level 1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="level-1">Level 1</SelectItem>
                          <SelectItem value="level-2">Level 2</SelectItem>
                          <SelectItem value="level-3">Level 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="dd-----yyyy --:-- --"
                          value={ticketForm.dueDate}
                          onChange={(e) =>
                            setTicketForm((p) => ({ ...p, dueDate: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Resolution Time</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="e.g., 2 hours, 1 day"
                        value={ticketForm.estimatedResolutionTime}
                        onChange={(e) =>
                          setTicketForm((p) => ({
                            ...p,
                            estimatedResolutionTime: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Tags &amp; Additional Information</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex items-center gap-3">
                      <InputGroup className="flex-1 bg-background">
                        <InputGroupInput
                          placeholder="Add a tag..."
                          value={ticketForm.tagDraft}
                          onChange={(e) => setTicketForm((p) => ({ ...p, tagDraft: e.target.value }))}
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => setTicketForm((p) => ({ ...p, tagDraft: '' }))}
                        aria-label="Add tag"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related Tickets</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="Ticket IDs separated by commas"
                        value={ticketForm.relatedTickets}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, relatedTickets: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">External Links</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="URLs to relevant external resources"
                        value={ticketForm.externalLinks}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, externalLinks: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Internal Notes</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        value={ticketForm.internalNotes}
                        onChange={(e) =>
                          setTicketForm((p) => ({ ...p, internalNotes: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-6"
                onClick={() => setTicketSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button className="h-10 rounded-xl bg-blue-600 px-7 hover:bg-blue-700">
                Update Ticket
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={integrationSheetOpen} onOpenChange={setIntegrationSheetOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-full border-l border-border p-0 sm:max-w-[min(720px,100vw)]"
        >
          <SheetHeader className="px-4 py-4 sm:px-6 sm:py-6 border-b border-border">
            <SheetTitle className="text-xl">Add New Integration</SheetTitle>
            <SheetDescription>
              Connect with third-party services and external applications
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Integration Details</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Integration Name <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={integrationForm.integrationName}
                          onChange={(e) =>
                            setIntegrationForm((p) => ({ ...p, integrationName: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Integration Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={integrationForm.integrationType}
                        onValueChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, integrationType: v }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crm">CRM</SelectItem>
                          <SelectItem value="payments">Payments</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="messaging">Messaging</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Provider</label>
                      <Select
                        value={integrationForm.provider}
                        onValueChange={(v) => setIntegrationForm((p) => ({ ...p, provider: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salesforce">Salesforce</SelectItem>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={integrationForm.category}
                        onValueChange={(v) => setIntegrationForm((p) => ({ ...p, category: v }))}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="API" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                          <SelectItem value="oauth">OAuth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        placeholder="Describe what this integration does..."
                        value={integrationForm.description}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, description: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Authentication &amp; Configuration</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      API Endpoint <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={integrationForm.apiEndpoint}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, apiEndpoint: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Authentication Method</label>
                      <Select
                        value={integrationForm.authenticationMethod}
                        onValueChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, authenticationMethod: v }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="API Key" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apiKey">API Key</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        API Key <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          placeholder="Enter your API key"
                          value={integrationForm.apiKey}
                          onChange={(e) =>
                            setIntegrationForm((p) => ({ ...p, apiKey: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook URL (Optional)</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={integrationForm.webhookUrl}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, webhookUrl: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Sync Settings</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sync Frequency</label>
                      <Select
                        value={integrationForm.syncFrequency}
                        onValueChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, syncFrequency: v }))
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Hourly" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rate Limit (per hour)</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={integrationForm.rateLimitPerHour}
                          onChange={(e) =>
                            setIntegrationForm((p) => ({ ...p, rateLimitPerHour: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timeout (seconds)</label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          value={integrationForm.timeoutSeconds}
                          onChange={(e) =>
                            setIntegrationForm((p) => ({ ...p, timeoutSeconds: e.target.value }))
                          }
                        />
                      </InputGroup>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">Enable Integration</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Activate this integration immediately
                        </p>
                      </div>
                      <Switch
                        checked={integrationForm.enableIntegration}
                        onCheckedChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, enableIntegration: v }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Auto Sync</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Automatically sync data based on frequency
                      </p>
                    </div>
                    <Switch
                      checked={integrationForm.autoSync}
                      onCheckedChange={(v) => setIntegrationForm((p) => ({ ...p, autoSync: v }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Data Mapping</h4>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Select which data types should be synchronized with this integration
                  </p>

                  {(
                    [
                      { key: 'users', label: 'users', desc: 'Sync users data' },
                      { key: 'customers', label: 'customers', desc: 'Sync customers data' },
                      { key: 'orders', label: 'orders', desc: 'Sync orders data' },
                      { key: 'products', label: 'products', desc: 'Sync products data' },
                      { key: 'analytics', label: 'analytics', desc: 'Sync analytics data' },
                    ] as const
                  ).map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{row.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{row.desc}</p>
                      </div>
                      <Switch
                        checked={integrationForm.dataMapping[row.key]}
                        onCheckedChange={(v) =>
                          setIntegrationForm((p) => ({
                            ...p,
                            dataMapping: { ...p.dataMapping, [row.key]: v },
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Notifications</h4>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Enable Notifications</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Receive email notifications for this integration
                      </p>
                    </div>
                    <Switch
                      checked={integrationForm.enableNotifications}
                      onCheckedChange={(v) =>
                        setIntegrationForm((p) => ({ ...p, enableNotifications: v }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">Error Notifications</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Notify when sync errors occur
                        </p>
                      </div>
                      <Switch
                        checked={integrationForm.errorNotifications}
                        onCheckedChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, errorNotifications: v }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">Success Notifications</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Notify when sync completes successfully
                        </p>
                      </div>
                      <Switch
                        checked={integrationForm.successNotifications}
                        onCheckedChange={(v) =>
                          setIntegrationForm((p) => ({ ...p, successNotifications: v }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notification Email</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={integrationForm.notificationEmail}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, notificationEmail: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-base font-semibold">Advanced Settings</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Headers (JSON)</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        value={integrationForm.customHeadersJson}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, customHeadersJson: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Parameters (JSON)</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        value={integrationForm.customParametersJson}
                        onChange={(e) =>
                          setIntegrationForm((p) => ({ ...p, customParametersJson: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <InputGroup className="min-h-20 bg-background">
                      <InputGroupTextarea
                        placeholder="Any additional notes about this integration..."
                        value={integrationForm.notes}
                        onChange={(e) => setIntegrationForm((p) => ({ ...p, notes: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-6"
                onClick={() => setIntegrationSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button className="h-10 rounded-xl bg-blue-600 px-7 hover:bg-blue-700">
                Add Integration
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <EmployeeSheet
        open={employeeSheetOpen}
        onOpenChange={setEmployeeSheetOpen}
        mode={employeeMode}
        form={employeeForm}
        setForm={(updater) => setEmployeeForm(updater)}
        onSubmit={() => {
          // In this mock app we only close the sheet; real submit would call an API.
        }}
      />
    </div>
  );
}
