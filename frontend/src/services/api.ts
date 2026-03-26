import type { 
  User, Customer, Project, Employee, Ticket, 
  Message, Channel, Activity, Task, DashboardStats 
} from '@/types';
import * as mockData from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockData.currentUser;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(400);
    return mockData.dashboardStats;
  },
  getActivities: async (): Promise<Activity[]> => {
    await delay(300);
    return mockData.activities;
  },
  getTasks: async (): Promise<Task[]> => {
    await delay(300);
    return mockData.tasks;
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    await delay(500);
    return mockData.customers;
  },
  getById: async (id: string): Promise<Customer | undefined> => {
    await delay(300);
    return mockData.customers.find(c => c.id === id);
  },
  create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    await delay(400);
    const newCustomer = { ...customer, id: String(mockData.customers.length + 1) };
    mockData.customers.push(newCustomer as Customer);
    return newCustomer as Customer;
  },
  update: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await delay(400);
    const index = mockData.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    mockData.customers[index] = { ...mockData.customers[index], ...updates };
    return mockData.customers[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockData.customers.findIndex(c => c.id === id);
    if (index !== -1) mockData.customers.splice(index, 1);
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    await delay(500);
    return mockData.projects;
  },
  getById: async (id: string): Promise<Project | undefined> => {
    await delay(300);
    return mockData.projects.find(p => p.id === id);
  },
  create: async (project: Omit<Project, 'id'>): Promise<Project> => {
    await delay(400);
    const newProject = { ...project, id: String(mockData.projects.length + 1) };
    mockData.projects.push(newProject as Project);
    return newProject as Project;
  },
  update: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await delay(400);
    const index = mockData.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    mockData.projects[index] = { ...mockData.projects[index], ...updates };
    return mockData.projects[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockData.projects.findIndex(p => p.id === id);
    if (index !== -1) mockData.projects.splice(index, 1);
  },
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    await delay(500);
    return mockData.employees;
  },
  getById: async (id: string): Promise<Employee | undefined> => {
    await delay(300);
    return mockData.employees.find(e => e.id === id);
  },
  create: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    await delay(400);
    const newEmployee = { ...employee, id: String(mockData.employees.length + 1) };
    mockData.employees.push(newEmployee as Employee);
    return newEmployee as Employee;
  },
  update: async (id: string, updates: Partial<Employee>): Promise<Employee> => {
    await delay(400);
    const index = mockData.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    mockData.employees[index] = { ...mockData.employees[index], ...updates };
    return mockData.employees[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockData.employees.findIndex(e => e.id === id);
    if (index !== -1) mockData.employees.splice(index, 1);
  },
};

// Tickets API
export const ticketsApi = {
  getAll: async (): Promise<Ticket[]> => {
    await delay(500);
    return mockData.tickets;
  },
  getById: async (id: string): Promise<Ticket | undefined> => {
    await delay(300);
    return mockData.tickets.find(t => t.id === id);
  },
  create: async (ticket: Omit<Ticket, 'id' | 'ticketId'>): Promise<Ticket> => {
    await delay(400);
    const ticketId = `TK-${String(mockData.tickets.length + 1).padStart(3, '0')}`;
    const newTicket = { ...ticket, id: String(mockData.tickets.length + 1), ticketId };
    mockData.tickets.push(newTicket as Ticket);
    return newTicket as Ticket;
  },
  update: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    await delay(400);
    const index = mockData.tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');
    mockData.tickets[index] = { ...mockData.tickets[index], ...updates };
    return mockData.tickets[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockData.tickets.findIndex(t => t.id === id);
    if (index !== -1) mockData.tickets.splice(index, 1);
  },
};

// Chat API
export const chatApi = {
  getChannels: async (): Promise<Channel[]> => {
    await delay(300);
    return mockData.channels;
  },
  getMessages: async (channelId: string): Promise<Message[]> => {
    await delay(400);
    return mockData.messages.filter(m => m.channelId === channelId);
  },
  sendMessage: async (message: Omit<Message, 'id'>): Promise<Message> => {
    await delay(300);
    const newMessage = { ...message, id: String(mockData.messages.length + 1) };
    mockData.messages.push(newMessage as Message);
    return newMessage as Message;
  },
};

// CRM Stats API
export const crmApi = {
  getStats: async () => {
    await delay(300);
    return mockData.crmStats;
  },
};

// Reports API
export const reportsApi = {
  getRevenueData: async () => {
    await delay(400);
    return mockData.revenueData;
  },
  getProjectStatusData: async () => {
    await delay(400);
    return mockData.projectStatusData;
  },
  getTicketResolutionData: async () => {
    await delay(400);
    return mockData.ticketResolutionData;
  },
};
