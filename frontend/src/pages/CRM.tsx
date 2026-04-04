import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Eye,
  Pencil,
  Star,
  ChevronDown,
  Table2,
  TextCursorInput,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { customersApi } from '@/services/api';
import type { Customer } from '@/types';

const INDUSTRIES = ['All', 'Technology', 'Software', 'Consulting', 'Retail', 'Design', 'Finance'];
const STATUSES = ['All', 'Active', 'Inactive'];


const emptyCustomerForm = {
  company: '',
  contactName: '',
  email: '',
  phone: '',
};

export default function CRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [inputsModalOpen, setInputsModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);

  useEffect(() => {
    loadData();
  }, []);

  const overlayOpen = tableModalOpen || inputsModalOpen;

  useEffect(() => {
    if (!overlayOpen) return;
    const main = document.querySelector('main');
    const prevOverflow = main?.style.overflow ?? '';
    if (main) main.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTableModalOpen(false);
        setInputsModalOpen(false);
        setCustomerForm(emptyCustomerForm);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (main) main.style.overflow = prevOverflow;
    };
  }, [overlayOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const customersData = await customersApi.getAll();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || customer.industry === industryFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      customer.status === statusFilter.toLowerCase();
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-green-100 text-green-700',
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-600';
  };

  const formatLastContact = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const openInputsFromTable = () => {
    setTableModalOpen(false);
    setInputsModalOpen(true);
  };

  const handleSaveCustomerForm = (options: { next?: boolean }) => {
    if (!customerForm.company.trim() || !customerForm.email.trim()) {
      toast.error('Company and email are required.');
      return;
    }
    toast.success(options.next ? 'Saved — enter the next record' : 'Customer saved', {
      description: `${customerForm.company} · ${customerForm.email}`,
    });
    if (options.next) {
      setCustomerForm(emptyCustomerForm);
    } else {
      setInputsModalOpen(false);
      setCustomerForm(emptyCustomerForm);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Relationship Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your customers, leads, and sales pipeline effectively
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Customers
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Add
                <ChevronDown className="w-4 h-4 opacity-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={() => setTableModalOpen(true)}
              >
                <Table2 className="w-4 h-4" />
                Table
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={() => setInputsModalOpen(true)}
              >
                <TextCursorInput className="w-4 h-4" />
                Inputs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {tableModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="crm-table-panel-title"
          className="fixed top-16 right-0 bottom-0 left-0 z-30 flex min-h-0 flex-col border-l border-gray-200 bg-background dark:border-border lg:left-64"
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-4 sm:h-16 sm:px-6">
            <h2
              id="crm-table-panel-title"
              className="text-xl font-semibold text-gray-900 dark:text-foreground"
            >
              Table
            </h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="shrink-0 bg-blue-600 hover:bg-blue-700"
                onClick={openInputsFromTable}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-gray-600 hover:text-gray-900 dark:text-muted-foreground"
                aria-label="Close"
                onClick={() => setTableModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-gray-50/80 p-4 dark:bg-muted/30 sm:p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : customers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">No customers yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.company}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{c.email}</TableCell>
                      <TableCell>{c.industry}</TableCell>
                      <TableCell className="capitalize">{c.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      ) : null}

      {inputsModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="crm-inputs-panel-title"
          className="fixed top-16 right-0 bottom-0 left-0 z-30 flex min-h-0 flex-col border-l border-gray-200 bg-background dark:border-border lg:left-64"
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-4 sm:h-16 sm:px-6">
            <h2
              id="crm-inputs-panel-title"
              className="text-xl font-semibold text-gray-900 dark:text-foreground"
            >
              Inputs
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-gray-600 hover:text-gray-900 dark:text-muted-foreground"
              aria-label="Close"
              onClick={() => {
                setInputsModalOpen(false);
                setCustomerForm(emptyCustomerForm);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50/80 px-4 py-6 dark:bg-muted/30 sm:px-8 sm:py-8">
            <div className="mx-auto grid w-full max-w-xl gap-4">
              <div className="grid gap-2">
                <Label htmlFor="crm-company">Company</Label>
                <Input
                  id="crm-company"
                  value={customerForm.company}
                  onChange={(e) =>
                    setCustomerForm((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="Acme Inc."
                  className="rounded-lg bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-contact">Contact name</Label>
                <Input
                  id="crm-contact"
                  value={customerForm.contactName}
                  onChange={(e) =>
                    setCustomerForm((f) => ({ ...f, contactName: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  className="rounded-lg bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-email">Email</Label>
                <Input
                  id="crm-email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="jane@company.com"
                  className="rounded-lg bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-phone">Phone</Label>
                <Input
                  id="crm-phone"
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                  className="rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-background px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSaveCustomerForm({ next: false })}
            >
              Save
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleSaveCustomerForm({ next: true })}
            >
              Save &amp; Next
            </Button>
          </div>
        </div>
      ) : null}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers, leads, deals..."
            className="pl-10 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 rounded-lg">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="bg-transparent rounded-lg p-0 h-auto gap-0 border-0 shadow-none">
          <TabsTrigger
            value="customers"
            className="rounded-lg px-4 py-2 text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-medium"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger value="leads" className="rounded-lg px-4 py-2 text-gray-700">
            Leads
          </TabsTrigger>
          <TabsTrigger value="deals" className="rounded-lg px-4 py-2 text-gray-700">
            Deals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg px-4 py-2 text-gray-700">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="border border-gray-200 shadow-sm overflow-hidden gap-0 py-0"
                >
                  <CardHeader className="px-6 pt-6 pb-4 relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {customer.company
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 pr-20">
                        <p className="font-semibold text-gray-900 truncate">
                          {customer.company}
                        </p>
                        <p className="text-sm text-gray-500">{customer.industry}</p>
                      </div>
                    </div>
                    <Badge
                      className={`absolute top-0 right-0 capitalize ${getStatusBadge(customer.status)}`}
                    >
                      {customer.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-6 space-y-3 pb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{customer.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pt-4 pb-6 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-green-600">
                          ${customer.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Revenue</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {customer.deals}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Deals</p>
                      </div>
                      <Badge className={getPriorityBadge(customer.priority)}>
                        {customer.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Last contact: {formatLastContact(customer.lastContact)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {!loading && filteredCustomers.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No customers found
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
            Leads view coming soon
          </div>
        </TabsContent>

        <TabsContent value="deals" className="mt-6">
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
            Deals view coming soon
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
            Analytics view coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
