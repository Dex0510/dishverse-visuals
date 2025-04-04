
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Utensils, 
  Package, 
  Map,
  SlidersHorizontal,
  Clock,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

export const dashboardLinks: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "POS",
    href: "/pos",
    icon: <ShoppingCart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Kitchen Display",
    href: "/kitchen-display",
    icon: <Utensils className="mr-2 h-4 w-4" />,
  },
  {
    title: "Table Management",
    href: "/tables",
    icon: <SlidersHorizontal className="mr-2 h-4 w-4" />,
  },
  {
    title: "Smart Waitlist",
    href: "/waitlist",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
  {
    title: "Menu Management",
    href: "/dish-management",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Voice Assistant",
    href: "/voice-assistant",
    icon: <Mic className="mr-2 h-4 w-4" />,
  },
  {
    title: "Floor Plan",
    href: "/map",
    icon: <Map className="mr-2 h-4 w-4" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
];

const DashboardSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Restaurant Management
          </h2>
          <div className="space-y-1">
            {dashboardLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent" : "transparent"
                  )
                }
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
