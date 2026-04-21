import { useState, useEffect } from "react";
import { Input, Button, DatePicker } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { CustomerTable } from "./CustomerTable";
import { CustomerStats } from "./CustomerStats";
import { AddCustomerModal } from "./AddCustomerModal";
import type { Customer, Product } from "../../App";
import dayjs from "dayjs";
import { SideBarMainLayout } from "../../Layout/SideBarMainLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer, addProduct, removeProduct } from "../../Redux/Slice/CustomerSlice";

const { RangePicker } = DatePicker;

interface HomeSectionProps {
  initialCustomers?: Customer[]; // Kept for layout compatibility but unused
}

export function HomeSection({ initialCustomers }: HomeSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { customers } = useSelector((state: RootState) => state.customers);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const handleAddCustomer = (customer: Omit<Customer, "id" | "joinDate" | "totalSpent" | "products">) => {
    dispatch(addCustomer(customer));
    setIsAddModalOpen(false);
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    dispatch(updateCustomer({ id: updatedCustomer.id, data: updatedCustomer }));
  };

  const handleDeleteCustomer = (id: string) => {
    dispatch(deleteCustomer(id));
  };

  const handleAddProductToCustomer = (customerId: string, product: Omit<Product, "id" | "purchaseDate">) => {
    dispatch(addProduct({ id: customerId, productData: product }));
  };

  const handleDeleteProductFromCustomer = (customerId: string, productId: string) => {
    dispatch(removeProduct({ id: customerId, productId }));
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const customerDate = dayjs(customer.joinDate);
      const startDate = dateFilter[0];
      const endDate = dateFilter[1];

      if (startDate && endDate) {
        matchesDate =
          (customerDate.isAfter(startDate, "day") || customerDate.isSame(startDate, "day")) &&
          (customerDate.isBefore(endDate, "day") || customerDate.isSame(endDate, "day"));
      } else if (startDate) {
        matchesDate = customerDate.isAfter(startDate, "day") || customerDate.isSame(startDate, "day");
      } else if (endDate) {
        matchesDate = customerDate.isBefore(endDate, "day") || customerDate.isSame(endDate, "day");
      }
    }

    return matchesSearch && matchesDate;
  });

  return (
    <SideBarMainLayout>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Management
        </h1>
        <p className="text-gray-600">
          Manage and track your customer relationships
        </p>
      </div>

      {/* Stats */}
      <CustomerStats customers={customers} />

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full sm:w-96"
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalOpen(true)}
            size="large"
            className="bg-blue-600"
          >
            Add Customer
          </Button>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Filter by Join Date:
          </span>
          <RangePicker
            value={dateFilter}
            onChange={(dates: any) =>
              setDateFilter(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
            }
          />
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onAddProduct={handleAddProductToCustomer}
        onDeleteProduct={handleDeleteProductFromCustomer}
      />

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomer as any}
        />
      )}
    </SideBarMainLayout>
  );
}
