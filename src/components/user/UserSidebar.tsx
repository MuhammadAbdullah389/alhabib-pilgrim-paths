import { LayoutDashboard, ClipboardList, MessageSquare, ArrowLeft, PlusCircle, UserCog, MessageCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Bookings", url: "/dashboard/bookings", icon: ClipboardList },
  { title: "Apply Again", url: "/dashboard/apply", icon: PlusCircle },
  { title: "Support Chat", url: "/dashboard/chat", icon: MessageCircle },
  { title: "My Testimonials", url: "/dashboard/testimonials", icon: MessageSquare },
  { title: "Profile Settings", url: "/dashboard/profile", icon: UserCog },
];

export function UserSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  const handleBackToSite = async () => {
    navigate('/', { replace: true });
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
          <SidebarGroupLabel>{!collapsed && "My Account"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName={isActive(item.url) ? "bg-sidebar-accent text-sidebar-primary font-medium" : ""}
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
