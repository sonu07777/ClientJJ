import { Modal, Form, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import type { Customer } from '../App';
import dayjs from 'dayjs';

interface AddCustomerModalProps {
  onClose: () => void;
  onAdd: (customer: Omit<Customer, 'id'>) => void;
}

export function AddCustomerModal({ onClose, onAdd }: AddCustomerModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const newCustomer = {
      ...values,
      joinDate: values.joinDate.format('YYYY-MM-DD'),
      products: []
    };
    onAdd(newCustomer);
  };

  return (
    <Modal
      title="Add New Customer"
      open={true}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'pending',
          joinDate: dayjs(),
          totalSpent: 0
        }}
        className="mt-4"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="John Doe" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="john@example.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input placeholder="Company Name" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="+91 98765 43210" size="large" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select size="large">
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Join Date"
          name="joinDate"
          rules={[{ required: true, message: 'Please select join date' }]}
        >
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item
          label="Total Spent"
          name="totalSpent"
          rules={[{ required: true, message: 'Please enter total spent' }]}
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

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} size="large" className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" size="large" className="bg-blue-600">
            Add Customer
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}