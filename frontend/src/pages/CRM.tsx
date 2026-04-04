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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { customersApi } from '@/services/api';
import type { Customer } from '@/types';

const INDUSTRIES = ['All', 'Technology', 'Software', 'Consulting', 'Retail', 'Design', 'Finance'];
const STATUSES = ['All', 'Active', 'Inactive'];


export default function CRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-gray-500">Customer creation form would go here.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
