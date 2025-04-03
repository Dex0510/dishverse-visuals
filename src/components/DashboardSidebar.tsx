
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Utensils,
  Users,
  Package,
  BarChart2,
  Settings,
  Coffee,
  LogOut,
  Clock,
  Layout
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "POS",
    href: "/pos",
    icon: Layout
  },
  {
    title: "Menu",
    href: "/dishes",
    icon: Coffee
  },
  {
    title: "Tables",
    href: "/tables",
    icon: Utensils
  },
  {
    title: "Kitchen Display",
    href: "/kitchen",
    icon: Clock
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart2
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

const DashboardSidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4">
        <h2 className="font-semibold text-lg">Restaurant Manager</h2>
      </div>
      
      <nav className="flex-1 py-2">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-secondary/80 text-muted-foreground"
                  }
                `}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto border-t">
        <NavLink to="/sign-in" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={18} />
          <span>Sign Out</span>
        </NavLink>
      </div>
    </div>
  );
};

export default DashboardSidebar;
