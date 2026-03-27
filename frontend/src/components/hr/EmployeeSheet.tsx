import { Mail, Phone, User, BriefcaseBusiness, DollarSign, Shield, ClipboardList, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export type EmployeeSheetMode = 'add' | 'edit';

export type EmployeeFormState = {
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  dateOfBirth: string;
  personalEmail: string;

  employeeId: string;
  department: string;
  position: string;
  reportingTo: string;
  startDate: string;
  employmentType: string;
  workLocation: string;
  role: string;

  annualSalary: string;
  currency: string;
  payFrequency: string;
  benefits: string;

  skills: string;
  emergencyContactName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  additionalNotes: string;

  accessLevel: string;
  activeEmployee: boolean;
  systemLoginAccess: boolean;
  sendWelcomeEmail: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: EmployeeSheetMode;
  form: EmployeeFormState;
  setForm: (updater: (prev: EmployeeFormState) => EmployeeFormState) => void;
  onSubmit?: () => void;
};

export function EmployeeSheet({ open, onOpenChange, mode, form, setForm, onSubmit }: Props) {
  const title = mode === 'add' ? 'Add New Employee' : 'Edit Employee';
  const description =
    mode === 'add'
      ? 'Add a new team member with personal and employment information'
      : 'Update employee information, employment details, and access settings';
  const primaryCta = mode === 'add' ? 'Add Employee' : 'Update Employee';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[720px] border-l border-border p-0">
        <SheetHeader className="px-6 py-6 border-b border-border">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-muted/30 px-6 py-6">
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-md">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h4 className="text-base font-semibold">Personal Information</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.firstName}
                        onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.lastName}
                        onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupAddon>
                        <Mail className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        value={form.workEmail}
                        onChange={(e) => setForm((p) => ({ ...p, workEmail: e.target.value }))}
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
                        value={form.phoneNumber}
                        onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="dd-----yyyy"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Personal Email</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.personalEmail}
                        onChange={(e) => setForm((p) => ({ ...p, personalEmail: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
                  <h4 className="text-base font-semibold">Employment Details</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Employee ID</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.employeeId}
                        onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.department}
                      onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.position}
                        onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reporting To</label>
                    <Select
                      value={form.reportingTo}
                      onValueChange={(v) => setForm((p) => ({ ...p, reportingTo: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                        <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                        <SelectItem value="John Smith">John Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="dd-----yyyy"
                        value={form.startDate}
                        onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Employment Type</label>
                    <Select
                      value={form.employmentType}
                      onValueChange={(v) => setForm((p) => ({ ...p, employmentType: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Full-time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Work Location</label>
                    <Select
                      value={form.workLocation}
                      onValueChange={(v) => setForm((p) => ({ ...p, workLocation: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                      value={form.role}
                      onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <h4 className="text-base font-semibold">Compensation &amp; Benefits</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Annual Salary</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        value={form.annualSalary}
                        onChange={(e) => setForm((p) => ({ ...p, annualSalary: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Select
                      value={form.currency}
                      onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pay Frequency</label>
                    <Select
                      value={form.payFrequency}
                      onValueChange={(v) => setForm((p) => ({ ...p, payFrequency: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Monthly" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Biweekly">Biweekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Benefits</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="Add benefit"
                        value={form.benefits}
                        onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <h4 className="text-base font-semibold">Additional Information</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills &amp; Expertise</label>
                  <InputGroup className="bg-background">
                    <InputGroupInput
                      placeholder="Add a skill..."
                      value={form.skills}
                      onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="Contact name"
                        value={form.emergencyContactName}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, emergencyContactName: e.target.value }))
                        }
                      />
                    </InputGroup>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Phone</label>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        placeholder="Phone number"
                        value={form.emergencyPhone}
                        onChange={(e) => setForm((p) => ({ ...p, emergencyPhone: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship</label>
                  <InputGroup className="bg-background">
                    <InputGroupInput
                      placeholder="Spouse, Parent, etc."
                      value={form.emergencyRelationship}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, emergencyRelationship: e.target.value }))
                      }
                    />
                  </InputGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <InputGroup className="min-h-20 bg-background">
                    <InputGroupTextarea
                      placeholder="Any additional information..."
                      value={form.additionalNotes}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, additionalNotes: e.target.value }))
                      }
                    />
                  </InputGroup>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <h4 className="text-base font-semibold">Access &amp; Preferences</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Level</label>
                    <Select
                      value={form.accessLevel}
                      onValueChange={(v) => setForm((p) => ({ ...p, accessLevel: v }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Elevated">Elevated</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Active Employee</p>
                        <p className="text-xs text-muted-foreground">
                          Employee is active and can access systems
                        </p>
                      </div>
                      <Switch
                        checked={form.activeEmployee}
                        onCheckedChange={(v) => setForm((p) => ({ ...p, activeEmployee: v }))}
                        aria-label="Active employee"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">System Login Access</p>
                      <p className="text-xs text-muted-foreground">
                        Allow employee to log into company systems
                      </p>
                    </div>
                    <Switch
                      checked={form.systemLoginAccess}
                      onCheckedChange={(v) => setForm((p) => ({ ...p, systemLoginAccess: v }))}
                      aria-label="System login access"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Send Welcome Email</p>
                      <p className="text-xs text-muted-foreground">
                        Send onboarding email with login credentials
                      </p>
                    </div>
                    <Switch
                      checked={form.sendWelcomeEmail}
                      onCheckedChange={(v) => setForm((p) => ({ ...p, sendWelcomeEmail: v }))}
                      aria-label="Send welcome email"
                    />
                  </div>
                </div>

                {!form.activeEmployee && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Employee inactive</p>
                      <p className="text-amber-800/90">
                        Inactive employees may lose access depending on your system policies.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <SheetFooter className="border-t border-border bg-background px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              className="h-10 rounded-xl px-6"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-10 rounded-xl bg-blue-600 px-7 hover:bg-blue-700"
              onClick={() => {
                onSubmit?.();
                onOpenChange(false);
              }}
            >
              {primaryCta}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

