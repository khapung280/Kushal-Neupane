import { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { employeesApi } from '@/services/api';
import type { Employee } from '@/types';
import { EmployeeSheet, type EmployeeFormState, type EmployeeSheetMode } from '@/components/hr/EmployeeSheet';

export default function HR() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeSheetOpen, setEmployeeSheetOpen] = useState(false);
  const [employeeMode, setEmployeeMode] = useState<EmployeeSheetMode>('add');
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormState>({
    firstName: '',
    lastName: '',
    workEmail: '',
    phoneNumber: '',
    dateOfBirth: '',
    personalEmail: '',

    employeeId: '',
    department: '',
    position: '',
    reportingTo: '',
    startDate: '',
    employmentType: 'Full-time',
    workLocation: 'Office',
    role: 'Employee',

    annualSalary: '',
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

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 hover:bg-green-100',
      'on-leave': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      terminated: 'bg-red-100 text-red-700 hover:bg-red-100',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Human Resources</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your team and employee information.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setEmployeeMode('add');
            setEmployeeForm({
              firstName: '',
              lastName: '',
              workEmail: '',
              phoneNumber: '',
              dateOfBirth: '',
              personalEmail: '',

              employeeId: '',
              department: '',
              position: '',
              reportingTo: '',
              startDate: '',
              employmentType: 'Full-time',
              workLocation: 'Office',
              role: 'Employee',

              annualSalary: '',
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
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {employees.filter(e => e.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold text-yellow-600">
            {employees.filter(e => e.status === 'on-leave').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Departments</p>
          <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button variant="secondary" size="sm" className="whitespace-nowrap">
          All Departments
        </Button>
        {departments.map(dept => (
          <Button key={dept} variant="outline" size="sm" className="whitespace-nowrap">
            {dept}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search employees..."
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

      {/* Employees Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No employees found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-lg">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.position}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getStatusBadge(employee.status)}>
                    {employee.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline">{employee.department}</Badge>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EmployeeSheet
        open={employeeSheetOpen}
        onOpenChange={setEmployeeSheetOpen}
        mode={employeeMode}
        form={employeeForm}
        setForm={(updater) => setEmployeeForm(updater)}
        onSubmit={() => {
          // Mock submit: in a real app we'd call employeesApi.create/update here.
        }}
      />
    </div>
  );
}
