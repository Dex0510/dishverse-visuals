
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
  Mic,
  Award,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

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
    title: "Floor Plan Designer",
    href: "/map",
    icon: <Map className="mr-2 h-4 w-4" />,
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
    title: "Rewards & Challenges",
    href: "/rewards",
    icon: <Award className="mr-2 h-4 w-4" />,
  },
  {
    title: "Voice Assistant",
    href: "/voice-assistant",
    icon: <Mic className="mr-2 h-4 w-4" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
];

const DashboardSidebar = ({ className }: { className?: string }) => {
  const { logout } = useAuth();

  return (
    <div className={cn("pb-12 h-full flex flex-col bg-sidebar border-r border-border", className)}>
      <div className="px-4 py-4 border-b">
        <h2 className="font-semibold tracking-tight text-xl">
          DishVerse
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <div className="px-4">
          <div className="space-y-1">
            {dashboardLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground/80"
                  )
                }
                end
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Demo Version 1.0
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
