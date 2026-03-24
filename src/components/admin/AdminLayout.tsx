import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border px-6 bg-card/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="mr-2" />
              <div className="hidden sm:flex items-center h-9 px-3 rounded-md bg-muted/40 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  Admin Control Center
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center h-9 px-3 rounded-md bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-primary-foreground font-semibold text-sm">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
