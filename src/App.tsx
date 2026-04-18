// import { useState } from "react";
// import { Sidebar } from "./Layout/Sidebar";
import { HomeSection } from "./components/Customer/HomeSection";
import { AboutSection } from "./components/AboutSection";
import { EmployeeSection } from "./components/Employee/EmployeeSection";
// import { SideBarMainLayout } from "./Layout/SideBarMainLayout";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import AccessDenied from "./components/AccessDenied";
import RequreAuth from "./Authentication /RequreAuth";
// import Home from "./Pages/Home";

export interface Product {
  id: string;
  name: string;
  value: number;
  paid: number;
  pending: number;
  purchaseDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  totalSpent: number;
  products: Product[];
}

// Mock data
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    company: "Tech Solutions Inc",
    phone: "+91 98765 43210",
    status: "active",
    joinDate: "2024-01-15",
    totalSpent: 12500,
    products: [
      {
        id: "101",
        name: "Product A",
        value: 5000,
        paid: 5000,
        pending: 0,
        purchaseDate: "2024-01-15",
      },
      {
        id: "102",
        name: "Product B",
        value: 7500,
        paid: 7500,
        pending: 0,
        purchaseDate: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "mchen@company.com",
    company: "Digital Ventures",
    phone: "+91 87654 32109",
    status: "active",
    joinDate: "2024-02-20",
    totalSpent: 8900,
    products: [
      {
        id: "201",
        name: "Product C",
        value: 4500,
        paid: 4500,
        pending: 0,
        purchaseDate: "2024-02-20",
      },
      {
        id: "202",
        name: "Product D",
        value: 4400,
        paid: 4400,
        pending: 0,
        purchaseDate: "2024-02-20",
      },
    ],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "e.rodriguez@mail.com",
    company: "Creative Studios",
    phone: "+91 76543 21098",
    status: "pending",
    joinDate: "2024-03-10",
    totalSpent: 0,
    products: [],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    company: "Innovation Labs",
    phone: "+91 65432 10987",
    status: "active",
    joinDate: "2023-11-05",
    totalSpent: 25600,
    products: [
      {
        id: "p5",
        name: "CRM System",
        value: 15000,
        paid: 15000,
        pending: 0,
        purchaseDate: "2023-11-15",
      },
      {
        id: "p6",
        name: "Analytics Dashboard",
        value: 7500,
        paid: 7500,
        pending: 0,
        purchaseDate: "2023-12-20",
      },
      {
        id: "p7",
        name: "Custom Integration",
        value: 8000,
        paid: 3100,
        pending: 4900,
        purchaseDate: "2024-01-05",
      },
    ],
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jmartinez@company.com",
    company: "Global Systems",
    phone: "+91 54321 09876",
    status: "inactive",
    joinDate: "2023-08-12",
    totalSpent: 5400,
    products: [
      {
        id: "p8",
        name: "Project Management Tool",
        value: 5400,
        paid: 5400,
        pending: 0,
        purchaseDate: "2023-08-20",
      },
    ],
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "rtaylor@email.com",
    company: "Enterprise Co",
    phone: "+91 43210 98765",
    status: "active",
    joinDate: "2024-01-22",
    totalSpent: 18300,
    products: [
      {
        id: "p9",
        name: "E-commerce Platform",
        value: 12000,
        paid: 12000,
        pending: 0,
        purchaseDate: "2024-01-25",
      },
      {
        id: "p10",
        name: "SEO Optimization Package",
        value: 6300,
        paid: 0,
        pending: 6300,
        purchaseDate: "2024-02-10",
      },
    ],
  },
];

export default function App() {
  // const [currentSection, setCurrentSection] = useState("home");

  // const renderSection = () => {
  //   switch (currentSection) {
  //     case "home":
  //       return <Link to="/home">Home</Link>;
  //     case "employees":
  //       return <Link to="/employees">Employees</Link>;
  //     case "about":
  //       return <Link to="/about">About</Link>;
  //     default:
  //       // return <HomeSection initialCustomers={initialCustomers} />;
  //       return <Link to="/">Home</Link>;
  //     // return (
  //     //   <SideBarMainLayout
  //     //     currentSection="employee"
  //     //     onSectionChange={() => {}}
  //     //   >
  //     //     <EmployeeSection />
  //     //   </SideBarMainLayout>
  //     // );
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {/* <Sidebar
        // currentSection={currentSection}
        // onSectionChange={setCurrentSection}
      /> */}
      {/* <SideBarMainLayout
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      /> */}

      {/* Main Content */}

      {/* {renderSection()} */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequreAuth requireAuth={["admin", "user"]} />}>
          <Route
            path="/home"
            element={<HomeSection initialCustomers={initialCustomers} />}
          />
        </Route>
        <Route path="/employees" element={<EmployeeSection />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/denied" element={<AccessDenied />} />
      </Routes>
    </div>
    //   </div>
    // </div>
  );
}
