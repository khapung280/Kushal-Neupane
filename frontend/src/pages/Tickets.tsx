import { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ticketsApi } from '@/services/api';
import type { Ticket } from '@/types';

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsApi.getAll();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      'in-progress': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      resolved: 'bg-green-100 text-green-700 hover:bg-green-100',
      closed: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
    };
    return styles[status as keyof typeof styles] || styles.open;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700 hover:bg-red-100',
      medium: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      low: 'bg-green-100 text-green-700 hover:bg-green-100',
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      bug: 'bg-red-100 text-red-700 hover:bg-red-100',
      feature: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      support: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      documentation: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
    };
    return styles[category as keyof typeof styles] || styles.support;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and track customer support requests.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-500">Ticket creation form would go here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Tickets</p>
          <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Open</p>
          <p className="text-2xl font-bold text-blue-600">
            {tickets.filter(t => t.status === 'open').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {tickets.filter(t => t.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {tickets.filter(t => t.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-red-600">
            {tickets.filter(t => t.priority === 'high').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">
                    {ticket.ticketId}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{ticket.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(ticket.status)}>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadge(ticket.category)}>
                      {ticket.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                        {ticket.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{ticket.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">
                        {ticket.reporter.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{ticket.reporter}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
