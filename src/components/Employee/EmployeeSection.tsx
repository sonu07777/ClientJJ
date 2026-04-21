import { useState, useEffect } from 'react';
import { Table, Input, Select, Tag, Button, Space, Popconfirm } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { SideBarMainLayout } from '../../Layout/SideBarMainLayout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../Redux/Store';
import { getAllEmployees, deleteEmployee, addEmployee, updateEmployee } from '../../Redux/Slice/EmployeeSlice';
import type { Employee } from '../../App';
import { PlusOutlined } from '@ant-design/icons';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EditEmployeeModal } from './EditEmployeeModal';



export function EmployeeSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading } = useSelector((state: RootState) => state.employees);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteEmployee(id));
  };

  const handleAdd = (employee: Omit<Employee, 'id' | 'joinDate'>) => {
    dispatch(addEmployee(employee));
    setIsAddModalOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    dispatch(updateEmployee({ id: employee.id, data: employee }));
    setEditingEmployee(null);
  };

  const departments = ['all', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    
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
          <div className="text-sm text-gray-500">{record.role}</div>
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
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            shape="circle"
            onClick={() => setEditingEmployee(record)}
          />
          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </Popconfirm>
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              size="large"
              className="bg-blue-600 ml-4"
            >
              Add Employee
            </Button>
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
          loading={loading}
        />
      </div>

      {isAddModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={handleEdit}
        />
      )}
    </SideBarMainLayout>
    // </div>
  );
}
