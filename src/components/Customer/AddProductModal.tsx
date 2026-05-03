import { Modal, Form, Input, InputNumber, DatePicker, Button, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import type { Product } from '../../App';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Text, Title } = Typography;

interface AddProductModalProps {
  customerName: string;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

export function AddProductModal({ customerName, onClose, onAdd }: AddProductModalProps) {
  const [form] = Form.useForm();
  
  // Need to track value and paid to compute pending dynamically for the summary UI
  const [currentValue, setCurrentValue] = useState(0);
  const [currentPaid, setCurrentPaid] = useState(0);
  const pending = Math.max(0, currentValue - currentPaid);

  const handleSubmit = (values: any) => {
    onAdd({
      name: values.name,
      value: values.value,
      paid: values.paid,
      pending: Math.max(0, values.value - values.paid),
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD')
    });
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if ('value' in changedValues) {
      setCurrentValue(changedValues.value || 0);
      form.setFieldsValue({ pending: Math.max(0, (changedValues.value || 0) - (allValues.paid || 0)) });
    }
    if ('paid' in changedValues) {
      setCurrentPaid(changedValues.paid || 0);
      form.setFieldsValue({ pending: Math.max(0, (allValues.value || 0) - (changedValues.paid || 0)) });
    }
  };

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>Add Product</Title>
          <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal' }}>for {customerName}</Text>
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        initialValues={{
          value: 0,
          paid: 0,
          pending: 0,
          purchaseDate: dayjs()
        }}
        className="mt-4"
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="e.g., Enterprise Software License" size="large" />
        </Form.Item>

        <Form.Item
          label="Total Value"
          name="value"
          rules={[{ required: true, message: 'Please enter total value' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            step={0.01}
            size="large"
            placeholder="0.00"
            prefix="₹"
          />
        </Form.Item>

        <Form.Item
          label="Amount Paid"
          name="paid"
          rules={[{ required: true, message: 'Please enter amount paid' }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            step={0.01}
            size="large"
            placeholder="0.00"
            prefix="₹"
          />
        </Form.Item>

        <Form.Item
          label="Pending Amount"
          name="pending"
          extra="Automatically calculated as Total Value - Amount Paid"
        >
          <InputNumber
            className="w-full"
            disabled
            size="large"
            prefix="₹"
          />
        </Form.Item>

        <Form.Item
          label="Purchase Date"
          name="purchaseDate"
          rules={[{ required: true, message: 'Please select purchase date' }]}
        >
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 mb-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <ShoppingOutlined />
            <span>Summary</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Value:</span>
              <span className="font-semibold text-gray-900">₹{currentValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Paid:</span>
              <span className="font-semibold text-green-600">₹{currentPaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Pending:</span>
              <span className="font-semibold text-red-600">₹{pending.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} size="large" className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" size="large" className="bg-blue-600">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
