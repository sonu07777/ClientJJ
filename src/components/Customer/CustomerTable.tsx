import { useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, message as antdMessage } from 'antd';
import { EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, BankOutlined, WhatsAppOutlined, PlusOutlined } from '@ant-design/icons';
import type { Customer, Product } from '../../App';
import { EditCustomerModal } from './EditCustomerModal';
import { AddProductModal } from './AddProductModal';
import { ProductsList } from './ProductsList';
import UploadeButton from '../UploadeButton';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../Redux/Store';
import { sendWhatsAppBill } from '../../Redux/Slice/CustomerSlice';


interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onAddProduct?: (customerId: string, product: Omit<Product, 'id'>) => void;
  onDeleteProduct?: (customerId: string, productId: string) => void;
}

export function CustomerTable({ customers, onEdit, onDelete, onAddProduct, onDeleteProduct }: CustomerTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const whatsAppBills = useSelector((state: RootState) => state.customers.whatsAppBills);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [addingProductFor, setAddingProductFor] = useState<Customer | null>(null);

  const handleEdit = (customer: Customer) => {
    onEdit(customer);
    setEditingCustomer(null);
  };

  const handleAddProduct = (customerId: string, product: Omit<Product, 'id'>) => {
    if (onAddProduct) {
      onAddProduct(customerId, product);
    }
    setAddingProductFor(null);
  };

  const getLatestBillUrl = (customer: Customer) => {
    const billUrls = [
      ...(customer.billUrls ?? []),
      ...customer.products.flatMap((product) => product.billUrls ?? []),
    ].filter(Boolean);

    return billUrls[billUrls.length - 1];
  };

  const sendWhatsAppMessage = async (customer: Customer) => {
    const latestBillUrl = getLatestBillUrl(customer);

    if (!latestBillUrl) {
      antdMessage.warning('Upload a bill image before sending WhatsApp');
      return;
    }

    const totalPending = customer.products.reduce((sum, p) => sum + p.pending, 0);
    
    let caption = '';
    if (totalPending > 0) {
      caption = `Hello ${customer.name}, your bill is attached. Pending payment: ₹${totalPending.toLocaleString('en-IN')}.`;
    } else if (customer.status === 'pending') {
      caption = `Hello ${customer.name}, your bill is attached. Please let us know if you need any assistance.`;
    } else {
      caption = `Hello ${customer.name}, your bill is attached. Thank you for being a valued customer.`;
    }

    try {
      await dispatch(sendWhatsAppBill({
        customerId: customer.id,
        phoneNumber: customer.phone,
        imageUrl: latestBillUrl,
        caption,
      })).unwrap();
      antdMessage.success('Bill image sent on WhatsApp');
    } catch (error: any) {
      antdMessage.error(error || 'Failed to send WhatsApp bill');
    }
  };

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_: any, record: Customer) => (
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <BankOutlined />
            {record.company}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Customer) => (
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <MailOutlined className="text-gray-400" />
            {record.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <PhoneOutlined className="text-gray-400" />
            {record.phone}
          </div>
          <Button
            type="link"
            icon={<WhatsAppOutlined />}
            onClick={() => sendWhatsAppMessage(record)}
            loading={whatsAppBills[record.id]?.loading}
            className="p-0 h-auto text-green-600 hover:text-green-700"
          >
            Send WhatsApp
          </Button>
        </Space>
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Products',
      key: 'productsCount',
      render: (_: any, record: Customer) => (
        <span className="text-sm text-gray-900">
          <span className="font-medium">{record.products.length}</span> product{record.products.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      title: 'Paid / Pending',
      key: 'paidPending',
      render: (_: any, record: Customer) => {
        const totalPaid = record.products.reduce((sum, p) => sum + p.paid, 0);
        const totalPending = record.products.reduce((sum, p) => sum + p.pending, 0);
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium text-green-600">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            {totalPending > 0 && (
              <div className="text-sm font-medium text-red-600">
                ₹{totalPending.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Button
            icon={<PlusOutlined />}
            onClick={() => setAddingProductFor(record)}
            className="text-green-600 border-green-600 hover:bg-green-50 flex items-center justify-center p-0 w-8 h-8 focus:outline-none"
            title="Add product"
            shape="circle"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingCustomer(record)}
            type="primary"
            ghost
            title="Edit customer"
            shape="circle"
            className="flex items-center justify-center p-0 w-8 h-8 focus:outline-none"
          />
          <Popconfirm
            title="Delete the customer"
            description="Are you sure to delete this customer?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              title="Delete customer"
              shape="circle"
              className="flex items-center justify-center p-0 w-8 h-8 focus:outline-none"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg m-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">Products Purchased</h4>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setAddingProductFor(record)}
                    className="bg-blue-600"
                  >
                    Add Product
                  </Button>
                </div>
                <ProductsList products={record.products} onDelete={onDeleteProduct ? (productId) => onDeleteProduct(record.id, productId) : undefined} />
                <UploadeButton customerId={record.id} />
              </div>
            ),
            rowExpandable: () => true,
          }}
        />
      </div>

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleEdit}
        />
      )}

      {addingProductFor && (
        <AddProductModal
          customerName={addingProductFor.name}
          onClose={() => setAddingProductFor(null)}
          onAdd={(product) => handleAddProduct(addingProductFor.id, product)}
        />
      )}
    </>
  );
}
