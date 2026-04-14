import { Table, Typography } from 'antd';
import type { Product } from '../App';
import dayjs from 'dayjs';

const { Text } = Typography;

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-2">No products purchased yet</div>
    );
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Total Value',
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => `₹${val.toLocaleString('en-IN')}`,
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      render: (val: number) => <Text type="success">₹{val.toLocaleString('en-IN')}</Text>,
    },
    {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
      render: (val: number) => val > 0 ? <Text type="danger" strong>₹{val.toLocaleString('en-IN')}</Text> : '-',
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
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
  );
}
