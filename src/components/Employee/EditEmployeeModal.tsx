import { Modal, Form, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import type { Employee } from '../../App';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

export function EditEmployeeModal({ employee, onClose, onSave }: EditEmployeeModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...employee,
      joinDate: employee.joinDate ? dayjs(employee.joinDate) : null,
    });
  }, [employee, form]);

  const handleSubmit = (values: any) => {
    const updatedEmployee = {
      ...employee,
      ...values,
      joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : undefined
    };
    onSave(updatedEmployee);
  };

  return (
    <Modal
      title="Edit Employee"
      open={true}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter employee name' }]}
        >
          <Input placeholder="Rajesh Kumar" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="rajesh@company.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="+91 98765 43210" size="large" />
        </Form.Item>
        
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please enter role/position' }]}
        >
          <Input placeholder="Software Engineer" size="large" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please enter department' }]}
        >
          <Input placeholder="Engineering" size="large" />
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: 'Please enter salary' }]}
        >
           <InputNumber
            className="w-full"
            min={0}
            step={100}
            size="large"
            placeholder="0.00"
            prefix="₹"
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select size="large">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="on-leave">On Leave</Select.Option>
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

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} size="large" className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" size="large" className="bg-blue-600">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
