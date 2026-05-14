import { Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { Product } from '../../App';
import dayjs from 'dayjs';

const { Text } = Typography;

import { DeleteOutlined } from '@ant-design/icons';

interface ProductsListProps {
  products: Product[];
  onDelete?: (productId: string) => void;
}

export function ProductsList({ products, onDelete }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-2">No products purchased yet</div>
    );
  }

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
      width: 90,
      render: (_: any, record: Product) => (
        onDelete ? (
          <DeleteOutlined
            className="text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => onDelete(record.id)}
            title="Remove Product"
          />
        ) : null
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
        scroll={{ x: 780 }}
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
