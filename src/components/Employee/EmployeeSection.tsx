import { useState } from 'react';
import { Table, Input, Select, Tag, Button, Space } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { SideBarMainLayout } from '../../Layout/SideBarMainLayout';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@company.com',
    phone: '+91 98765 11111',
    department: 'Engineering',
    position: 'Senior Developer',
    location: 'Bangalore',
    joinDate: '2022-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.s@company.com',
    phone: '+91 98765 22222',
    department: 'Sales',
    position: 'Sales Manager',
    location: 'Mumbai',
    joinDate: '2021-06-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.p@company.com',
    phone: '+91 98765 33333',
    department: 'Marketing',
    position: 'Marketing Lead',
    location: 'Delhi',
    joinDate: '2023-03-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.r@company.com',
    phone: '+91 98765 44444',
    department: 'HR',
    position: 'HR Manager',
    location: 'Hyderabad',
    joinDate: '2020-11-05',
    status: 'on-leave'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.s@company.com',
    phone: '+91 98765 55555',
    department: 'Engineering',
    position: 'DevOps Engineer',
    location: 'Pune',
    joinDate: '2022-08-12',
    status: 'active'
  },
  {
    id: '6',
    name: 'Ananya Iyer',
    email: 'ananya.i@company.com',
    phone: '+91 98765 66666',
    department: 'Finance',
    position: 'Finance Analyst',
    location: 'Chennai',
    joinDate: '2023-02-28',
    status: 'active'
  }
];

export function EmployeeSection() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = ['all', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      color: 'bg-blue-500'
    },
    {
      label: 'Active',
      value: employees.filter(e => e.status === 'active').length,
      color: 'bg-green-500'
    },
    {
      label: 'On Leave',
      value: employees.filter(e => e.status === 'on-leave').length,
      color: 'bg-yellow-500'
    },
    {
      label: 'Departments',
      value: new Set(employees.map(e => e.department)).size,
      color: 'bg-purple-500'
    }
  ];

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: Employee) => (
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.position}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Employee) => (
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <MailOutlined className="text-gray-400" />
            {record.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <PhoneOutlined className="text-gray-400" />
            {record.phone}
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Location',
      key: 'location',
      render: (_: any, record: Employee) => (
        <div className="flex items-center gap-2 text-sm text-gray-900">
          <EnvironmentOutlined className="text-gray-400" />
          {record.location}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'active') color = 'green';
        if (status === 'inactive') color = 'default';
        return (
          <Tag color={color}>
            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            shape="circle"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            shape="circle"
          />
        </Space>
      ),
    },
  ];

  return (
    // <div className="space-y-6">
    <SideBarMainLayout>
    
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Employees</h1>
        <p className="text-gray-600">Manage and track your team members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full sm:w-96"
            size="large"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Department:</span>
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-48"
              size="large"
            >
              {departments.map(dept => (
                <Select.Option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </SideBarMainLayout>
    // </div>
  );
}
