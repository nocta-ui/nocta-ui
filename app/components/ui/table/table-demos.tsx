'use client';

import React, { useState } from 'react';
import { Table, TableColumn, SortDirection } from './table';
import { Button } from '../button';
import { Badge } from '../badge';

// Sample data types
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastSeen: string;
}

interface Product extends Record<string, unknown> {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

interface Order extends Record<string, unknown> {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastSeen: '2024-03-10'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2024-02-01',
    lastSeen: '2024-03-09'
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'Editor',
    status: 'inactive',
    joinDate: '2024-01-20',
    lastSeen: '2024-03-05'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'User',
    status: 'pending',
    joinDate: '2024-03-01',
    lastSeen: '2024-03-08'
  }
];

const sampleProducts: Product[] = [
  { id: 1, name: 'MacBook Pro 16"', category: 'Laptops', price: 2499, stock: 5, rating: 4.8 },
  { id: 2, name: 'iPhone 15 Pro', category: 'Phones', price: 999, stock: 12, rating: 4.7 },
  { id: 3, name: 'Sony WH-1000XM5', category: 'Audio', price: 399, stock: 8, rating: 4.6 },
  { id: 4, name: 'iPad Air', category: 'Tablets', price: 599, stock: 3, rating: 4.5 },
  { id: 5, name: 'Dell XPS 13', category: 'Laptops', price: 1299, stock: 0, rating: 4.4 }
];

const sampleOrders: Order[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', product: 'MacBook Pro 16"', amount: 2499, status: 'completed', date: '2024-03-08' },
  { id: 'ORD-002', customer: 'Bob Smith', product: 'iPhone 15 Pro', amount: 999, status: 'pending', date: '2024-03-09' },
  { id: 'ORD-003', customer: 'Carol Williams', product: 'Sony WH-1000XM5', amount: 399, status: 'completed', date: '2024-03-07' },
  { id: 'ORD-004', customer: 'David Brown', product: 'iPad Air', amount: 599, status: 'cancelled', date: '2024-03-06' }
];

// Basic Table Demo
export const BasicTableDemo: React.FC = () => {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { key: 'joinDate', title: 'Join Date' }
  ];

  return (
    <div className="my-6 px-2">
      <Table 
        columns={columns} 
        data={sampleUsers}
        className="max-w-4xl"
      />
    </div>
  );
};

// Sortable Table Demo
export const SortableTableDemo: React.FC = () => {
  const [data, setData] = useState(sampleUsers);

  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'joinDate', title: 'Join Date', sortable: true }
  ];

  const handleSort = (key: string, direction: SortDirection) => {
    if (!direction) {
      setData(sampleUsers);
      return;
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = a[key as keyof User];
      const bVal = b[key as keyof User];
      
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      
      return direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    
    setData(sorted);
  };

  return (
    <div className="my-6">
      <Table 
        columns={columns} 
        data={data}
        sortable
        onSort={handleSort}
        className="max-w-4xl"
      />
    </div>
  );
};

// Filterable Table Demo
export const FilterableTableDemo: React.FC = () => {
  const [filteredData, setFilteredData] = useState(sampleUsers);

  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name', filterable: true },
    { key: 'email', title: 'Email', filterable: true },
    { key: 'role', title: 'Role', filterable: true },
  ];

  const handleFilter = (filters: Record<string, string>) => {
    let result = sampleUsers;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(user => 
          user[key as keyof User]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredData(result);
  };

  return (
    <div className="my-6 max-w-2xl">
      <Table 
        columns={columns} 
        data={filteredData}
        filterable
        onFilter={handleFilter}
        className="max-w-4xl"
      />
    </div>
  );
};

// Advanced Table with Custom Rendering
export const AdvancedTableDemo: React.FC = () => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns: TableColumn<User>[] = [
    { 
      key: 'name', 
      title: 'User',
      sortable: true,
      filterable: true,
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
            {String(value).charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-nocta-900 dark:text-nocta-100 truncate">{String(value)}</div>
            <div className="text-xs text-nocta-500 dark:text-nocta-400 truncate">{record.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge variant={getStatusBadgeVariant(String(value))} size="sm">
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (_) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div className="my-6">
      <Table 
        columns={columns} 
        data={sampleUsers}
        sortable
        filterable
        onRowClick={(record) => console.log('Clicked user:', record.name)}
      />
    </div>
  );
};

// Table Variants Demo
export const TableVariantsDemo: React.FC = () => {
  const columns: TableColumn<Product>[] = [
    { key: 'name', title: 'Product' },
    { key: 'category', title: 'Category' },
    { key: 'price', title: 'Price', align: 'right', render: (value) => `$${value}` },
    { key: 'stock', title: 'Stock', align: 'right' }
  ];

  return (
    <div className="my-6 space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-nocta-900 dark:text-nocta-100 mb-3">Default</h4>
        <Table columns={columns} data={sampleProducts.slice(0, 3)} />
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-nocta-900 dark:text-nocta-100 mb-3">Striped</h4>
        <Table columns={columns} data={sampleProducts.slice(0, 3)} variant="striped" />
      </div>
    </div>
  );
};

// Table Sizes Demo
export const TableSizesDemo: React.FC = () => {
  const columns: TableColumn<Product>[] = [
    { key: 'name', title: 'Product' },
    { key: 'price', title: 'Price', align: 'right', render: (value) => `$${value}` },
    { key: 'stock', title: 'Stock', align: 'right' }
  ];

  return (
    <div className="my-6 space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-nocta-900 dark:text-nocta-100 mb-3">Small</h4>
        <Table columns={columns} data={sampleProducts.slice(0, 2)} size="sm" />
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-nocta-900 dark:text-nocta-100 mb-3">Medium</h4>
        <Table columns={columns} data={sampleProducts.slice(0, 2)} size="md" />
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-nocta-900 dark:text-nocta-100 mb-3">Large</h4>
        <Table columns={columns} data={sampleProducts.slice(0, 2)} size="lg" />
      </div>
    </div>
  );
};

// Pagination Demo
export const PaginationTableDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  
  const columns: TableColumn<Order>[] = [
    { key: 'id', title: 'Order ID' },
    { key: 'customer', title: 'Customer' },
    { key: 'product', title: 'Product' },
    { 
      key: 'amount', 
      title: 'Amount', 
      align: 'right',
      render: (value) => `$${String(value).toLocaleString()}`
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value) => {
        const colors = {
          pending: 'warning',
          completed: 'success',
          cancelled: 'destructive'
        };
        return <Badge variant={colors[value as keyof typeof colors] as 'warning' | 'success' | 'destructive'}>{String(value)}</Badge>;
      }
    }
  ];

  const handlePageChange = (page: number, _size: number) => {
    setCurrentPage(page);
  };

  const paginatedData = sampleOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="my-6">
      <Table 
        columns={columns} 
        data={paginatedData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: sampleOrders.length,
          onChange: handlePageChange
        }}
        className="max-w-4xl"
      />
    </div>
  );
};

// Loading State Demo
export const LoadingTableDemo: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' }
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-6">
      <div className="mb-4">
        <Button 
          onClick={() => setLoading(!loading)} 
          variant="secondary" 
          size="sm"
        >
          Toggle Loading
        </Button>
      </div>
      <Table 
        columns={columns} 
        data={sampleUsers}
        loading={loading}
        className="w-2xl"
      />
    </div>
  );
};

// Empty State Demo
export const EmptyTableDemo: React.FC = () => {
  const columns: TableColumn<User>[] = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' }
  ];

  return (
    <div className="my-6">
      <Table 
        columns={columns} 
        data={[]}
        emptyText="No users found. Add some users to get started."
        className="max-w-4xl"
      />
    </div>
  );
}; 