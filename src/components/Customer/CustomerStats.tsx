import { TeamOutlined, UserOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Customer } from '../../App';

interface CustomerStatsProps {
  customers: Customer[];
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  
  // Calculate total paid and pending across all customers
  let totalPaid = 0;
  let totalPending = 0;
  customers.forEach(customer => {
    customer.products.forEach(product => {
      totalPaid += product.paid;
      totalPending += product.pending;
    });
  });

  const stats = [
    {
      label: 'Total Customers',
      value: totalCustomers.toString(),
      icon: TeamOutlined,
      color: 'bg-blue-500',
      showCurrency: false
    },
    {
      label: 'Active',
      value: activeCustomers.toString(),
      icon: UserOutlined,
      color: 'bg-green-500',
      showCurrency: false
    },
    {
      label: 'Total Paid',
      value: totalPaid.toLocaleString('en-IN'),
      icon: ClockCircleOutlined,
      color: 'bg-green-500',
      showCurrency: true
    },
    {
      label: 'Total Pending',
      value: totalPending.toLocaleString('en-IN'),
      icon: WarningOutlined,
      color: 'bg-red-500',
      showCurrency: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 responsive-text">
                {stat.showCurrency && '₹'}
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg flex shrink-0 items-center justify-center`}>
              <stat.icon className="text-xl sm:text-2xl text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
