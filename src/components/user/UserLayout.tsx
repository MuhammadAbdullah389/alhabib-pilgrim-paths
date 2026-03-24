import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "./UserSidebar";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.split("@")[0] || "U";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAvatar = async () => {
      const avatarPath = profile?.avatar_url;
      if (!avatarPath) {
        if (!cancelled) setAvatarSrc(null);
        return;
      }

      if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
        if (!cancelled) setAvatarSrc(avatarPath);
        return;
      }

      const { data, error } = await supabase.storage
        .from("booking-documents")
        .createSignedUrl(avatarPath, 60 * 60);

      if (!cancelled) {
        setAvatarSrc(error ? null : (data?.signedUrl || null));
      }
    };

    loadAvatar();
    return () => {
      cancelled = true;
    };
  }, [profile?.avatar_url]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center justify-between w-full gap-4">
              <h2 className="font-display text-lg font-semibold text-foreground">My Dashboard</h2>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={avatarSrc || undefined} alt="User avatar" />
                  <AvatarFallback>{getInitials(profile?.full_name, user?.email)}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">{displayName}</p>
                </div>
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

export default UserLayout;
