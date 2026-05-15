import { Button, message, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { Customer, Product } from '../../App';
import dayjs from 'dayjs';

const { Text } = Typography;

import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { printProductBill } from '../../utils/printProductBill';

interface ProductsListProps {
  products: Product[];
  customer: Customer;
  onDelete?: (productId: string) => void;
}

export function ProductsList({ products, customer, onDelete }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-2">No products purchased yet</div>
    );
  }

  const handlePrint = (product: Product) => {
    const didOpen = printProductBill({ customer, product });

    if (!didOpen) {
      message.error('Please allow pop-ups to print the bill');
    }
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string) => <Text strong className="responsive-text">{text}</Text>,
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 140,
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Total Value',
      dataIndex: 'value',
      key: 'value',
      width: 130,
      render: (val: number) => `₹${val.toLocaleString('en-IN')}`,
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      width: 120,
      render: (val: number) => <Text type="success">₹{val.toLocaleString('en-IN')}</Text>,
    },
    {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
      width: 120,
      render: (val: number) => val > 0 ? <Text type="danger" strong>₹{val.toLocaleString('en-IN')}</Text> : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            shape="circle"
            title="Print bill"
            type="primary"
            ghost
          />
          {onDelete ? (
            <DeleteOutlined
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => onDelete(record.id)}
              title="Remove Product"
            />
          ) : null}
        </Space>
      )
    }
  ];

  return (
    <div className="responsive-table">
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 820 }}
        summary={(pageData) => {
          let totalValue = 0;
          let totalPaid = 0;
          let totalPending = 0;

          pageData.forEach(({ value, paid, pending }) => {
            totalValue += value;
            totalPaid += paid;
            totalPending += pending;
          });

          return (
            <Table.Summary.Row className="bg-gray-50">
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>₹{totalValue.toLocaleString('en-IN')}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text type="success" strong>₹{totalPaid.toLocaleString('en-IN')}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                {totalPending > 0 ? (
                  <Text type="danger" strong>₹{totalPending.toLocaleString('en-IN')}</Text>
                ) : (
                  <Text strong>-</Text>
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
}
