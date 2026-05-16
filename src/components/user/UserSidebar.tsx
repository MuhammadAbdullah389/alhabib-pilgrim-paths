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
          <SidebarGroupLabel className="font-display font-semibold text-sm tracking-wider">{!collapsed && "My Account"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/60 rounded-lg transition-all duration-200"
                      activeClassName={isActive(item.url) ? "bg-sidebar-primary/20 text-sidebar-primary font-semibold border-l-2 border-sidebar-primary" : ""}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleBackToSite} 
                  className="hover:bg-destructive/15 hover:text-destructive rounded-lg transition-all duration-200"
                >
                    <ArrowLeft className="mr-3 h-5 w-5" />
                    {!collapsed && <span className="text-sm">Back to Site</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
