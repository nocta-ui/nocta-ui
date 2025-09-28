"use client";

import * as React from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { type ColumnDef, type Row, Table } from "./table";

interface Invoice {
  invoice: string;
  customer: string;
  status: "paid" | "processing" | "overdue";
  issuedOn: Date;
  amount: number;
}

interface TeamMember {
  name: string;
  role: string;
  location: string;
  projects: number;
  availability: "available" | "busy" | "offline";
}

const invoiceData: Invoice[] = [
  {
    invoice: "INV-2041",
    customer: "Lumen Studio",
    status: "paid",
    issuedOn: new Date("2024-02-14"),
    amount: 2450,
  },
  {
    invoice: "INV-2042",
    customer: "Orbit Labs",
    status: "processing",
    issuedOn: new Date("2024-02-19"),
    amount: 1860,
  },
  {
    invoice: "INV-2043",
    customer: "Nova Retail",
    status: "overdue",
    issuedOn: new Date("2024-02-09"),
    amount: 1320,
  },
  {
    invoice: "INV-2044",
    customer: "Neon Systems",
    status: "paid",
    issuedOn: new Date("2024-02-23"),
    amount: 3150,
  },
  {
    invoice: "INV-2045",
    customer: "Zenith Ventures",
    status: "processing",
    issuedOn: new Date("2024-02-26"),
    amount: 980,
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Olivia Stone",
    role: "Product Designer",
    location: "Berlin, DE",
    projects: 4,
    availability: "available",
  },
  {
    name: "Kai Nakamura",
    role: "Frontend Engineer",
    location: "Tokyo, JP",
    projects: 3,
    availability: "busy",
  },
  {
    name: "Sofia Rivera",
    role: "UX Researcher",
    location: "Madrid, ES",
    projects: 2,
    availability: "available",
  },
  {
    name: "Milan Novak",
    role: "Design Ops",
    location: "Prague, CZ",
    projects: 1,
    availability: "offline",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const availabilityBadge: Record<
  TeamMember["availability"],
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  available: { label: "Available", variant: "success" },
  busy: { label: "In a meeting", variant: "warning" },
  offline: { label: "Offline", variant: "secondary" },
};

const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">{getValue<string>()}</span>
    ),
    meta: {
      width: "140px",
      align: "left",
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ getValue }) => (
      <span className="truncate">{getValue<string>()}</span>
    ),
    meta: {
      width: "140px",
      align: "left",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue<Invoice["status"]>();
      const variant =
        value === "paid"
          ? "success"
          : value === "processing"
            ? "warning"
            : "destructive";
      const label =
        value === "paid"
          ? "Paid"
          : value === "processing"
            ? "Processing"
            : "Overdue";
      return (
        <Badge variant={variant} size="sm">
          {label}
        </Badge>
      );
    },
    meta: {
      align: "center",
      width: "140px",
    },
  },
  {
    accessorKey: "issuedOn",
    header: "Issued",
    cell: ({ getValue }) => {
      const date = getValue<Date>();
      return (
        <span className="text-foreground/45">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
    meta: {
      align: "right",
      width: "160px",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-semibold text-foreground">
        {currencyFormatter.format(getValue<number>())}
      </span>
    ),
    enableSorting: true,
    meta: {
      align: "right",
      width: "140px",
    },
  },
];

const teamColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {getValue<string>()}
        </span>
      </div>
    ),
    meta: {
      align: "left",
      width: "120px",
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <span className="text-foreground/45">{getValue<string>()}</span>
    ),
    meta: {
      align: "left",
      width: "120px",
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: { align: "center", width: "120px" },
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ getValue }) => (
      <span className="font-semibold text-foreground">
        {getValue<number>()}
      </span>
    ),
    meta: { align: "right", width: "120px" },
  },
  {
    accessorKey: "availability",
    header: "Availability",
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue<TeamMember["availability"]>();
      const { label, variant } = availabilityBadge[value];
      return (
        <Badge variant={variant} size="sm">
          {label}
        </Badge>
      );
    },
    meta: { align: "right", width: "120px" },
  },
];

export const BasicTableDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <Table<Invoice>
        columns={invoiceColumns}
        data={invoiceData}
        getRowId={(invoice) => invoice.invoice}
        density="comfortable"
      />
    </div>
  );
};

export const SelectableTableDemo: React.FC = () => {
  const [_, setSelectedRows] = React.useState<Row<Invoice>[]>([]);

  return (
    <div className="space-y-3">
      <Table<Invoice>
        columns={invoiceColumns}
        data={invoiceData}
        getRowId={(invoice) => invoice.invoice}
        enableRowSelection
        onSelectedRowsChange={setSelectedRows}
        emptyState="No invoices yet"
      />
    </div>
  );
};

export const CompactTableDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <Table<TeamMember>
        columns={teamColumns}
        data={teamMembers}
        getRowId={(member) => member.name}
        density="compact"
      />
    </div>
  );
};
