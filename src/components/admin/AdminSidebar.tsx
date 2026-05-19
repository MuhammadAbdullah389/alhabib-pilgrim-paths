import {
  LayoutDashboard,
  Package,
  Hotel,
  ClipboardList,
  FileText,
  MessageSquare,
  MessageCircle,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type StaffRole = 'admin' | 'support' | 'visa_officer';

const adminItems: Array<{ title: string; url: string; icon: any; roles?: StaffRole[] }> = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, roles: ["admin", "support", "visa_officer"] },
  { title: "Packages", url: "/admin/packages", icon: Package, roles: ["admin"] },
  { title: "Hotels", url: "/admin/hotels", icon: Hotel, roles: ["admin"] },
  { title: "Bookings", url: "/admin/bookings", icon: ClipboardList, roles: ["admin", "support"] },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare, roles: ["admin", "support"] },
  { title: "Documents", url: "/admin/documents", icon: FileText, roles: ["admin", "visa_officer"] },
  { title: "Chat", url: "/admin/chat", icon: MessageCircle, roles: ["admin", "support"] },
  { title: "Training Sessions", url: "/admin/training", icon: CalendarDays, roles: ["admin"] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const role = (profile?.role || 'user') as StaffRole | 'user';
  const visibleItems = adminItems.filter((item) => !item.roles || item.roles.includes(role as StaffRole));

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleBackToSite = async () => {
    navigate("/", { replace: true });
    try {
      await signOut();
    } catch {
      toast.error("Failed to log out cleanly");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Deedar-e-Rahamat Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName={
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : ""
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleBackToSite} className="hover:bg-sidebar-accent/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Back to Site</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
