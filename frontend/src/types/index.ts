// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  status: 'active' | 'inactive';
  revenue: number;
  deals: number;
  priority: 'high' | 'medium' | 'low';
  location: string;
  lastContact: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  budget: number;
  dueDate: string;
  team: string[];
  createdBy: string;
}

// Employee Types
export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'terminated';
  avatar?: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  category: 'bug' | 'feature' | 'support' | 'documentation';
  assignedTo: string;
  reporter: string;
  createdAt: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  channelId: string;
}

// Channel Types
export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  unreadCount: number;
  lastMessage?: string;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'lead' | 'project' | 'leave' | 'payment' | 'ticket' | 'message' | 'deal' | 'meeting' | 'hire';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    initials: string;
    color: string;
  };
  badge?: {
    text: string;
    color: string;
  };
}

// Task Types
export interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  dueLabel: string;
  assignee: {
    name: string;
    initials: string;
    color: string;
  };
}

// Stats Types
export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  customers: number;
  customersChange: number;
  projects: number;
  projectsChange: number;
  responseTime: string;
  responseTimeChange: number;
}
