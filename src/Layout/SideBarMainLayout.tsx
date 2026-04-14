import {
  HomeOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  children: React.ReactNode;
  //   currentSection: string;
  //   onSectionChange: (section: string) => void;
}

export function SideBarMainLayout({
  children,
  //   currentSection,
  //   onSectionChange,
}: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentSectionState, setCurrentSectionState] = useState("");

  const menuItems = [
    { id: "home", label: "Home", icon: HomeOutlined },
    { id: "employees", label: "All Employees", icon: TeamOutlined },
    { id: "about", label: "About", icon: InfoCircleOutlined },
  ];
  console.log("Current Section in Layout:", currentSectionState);
  const handleNavClick = (sectionId: string) => {
    // onSectionChange(sectionId);
    setCurrentSectionState(sectionId);
    setIsMobileOpen(false);
  };

  useEffect(() => {}, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center"
      >
        {isMobileOpen ? (
          <CloseOutlined className="text-xl" />
        ) : (
          <MenuOutlined className="text-xl" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 lg:mt-0">
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          >
            <div className="flex flex-col h-full">
              {/* Logo/Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-blue-600">
                  Jaggnath Motors
                </h2>
                <p className="text-sm text-gray-500 mt-1">Management System</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const path = `/${item.id}`;
                    const isActive = location.pathname === path;
                    return (
                      <li key={item.id}>
                        <Link to={`/${item.id}`}>
                          <button
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors 
                        ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                          >
                            <item.icon className="text-xl" />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 Management Dashboard
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
}
