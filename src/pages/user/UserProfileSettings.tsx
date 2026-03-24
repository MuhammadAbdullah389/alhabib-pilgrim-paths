import { useEffect, useMemo, useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PakistanCityCombobox } from "@/components/forms/PakistanCityCombobox";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.split("@")[0] || "U";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const resolveAvatarUrl = async (avatarPath?: string | null) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) return avatarPath;

  const { data, error } = await supabase.storage
    .from("booking-documents")
    .createSignedUrl(avatarPath, 60 * 60);

  if (error) return null;
  return data?.signedUrl || null;
};

const UserProfileSettings = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAvatar = async () => {
      const resolved = await resolveAvatarUrl(profile?.avatar_url);
      if (!cancelled) setAvatarSrc(resolved);
    };

    loadAvatar();
    return () => {
      cancelled = true;
    };
  }, [profile?.avatar_url]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const profileCompletion = useMemo(() => {
    const fields = [
      fullName.trim().length > 0,
      phone.trim().length > 0,
      location.trim().length > 0,
      !!user?.email,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [fullName, phone, location, user?.email]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be signed in.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
          location: location.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setAvatarFile(file);
  };

  const handleUploadAvatar = async () => {
    if (!user?.id) {
      toast.error("You must be signed in.");
      return;
    }

    if (!avatarFile) {
      toast.error("Please choose an image first.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const safeName = avatarFile.name.replace(/\s+/g, "-");
      const filePath = `${user.id}/avatars/${Date.now()}-${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("booking-documents")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: uploadData.path })
        .eq("id", user.id);

      if (profileError) throw profileError;

      await refreshProfile();
      setAvatarFile(null);
      toast.success("Profile photo updated.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload profile photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id) {
      toast.error("You must be signed in.");
      return;
    }

    setIsRemovingAvatar(true);
    try {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(null);
      setAvatarFile(null);

      const avatarPath = profile?.avatar_url;
      if (avatarPath && !avatarPath.startsWith("http://") && !avatarPath.startsWith("https://")) {
        const { error: removeError } = await supabase.storage
          .from("booking-documents")
          .remove([avatarPath]);
        if (removeError) {
          console.warn("Avatar storage remove warning:", removeError.message);
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarSrc(null);
      await refreshProfile();
      toast.success("Profile photo removed.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove profile photo.");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Update your account details and security settings.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Keep your details complete for a better application experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-semibold">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Upload a clear photo for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={avatarPreview || avatarSrc || undefined} alt="Profile avatar" />
                <AvatarFallback>{getInitials(fullName, user?.email)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatarUpload" className="sr-only">Upload profile photo</Label>
                <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarFileChange} />
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 2MB</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleUploadAvatar} disabled={isUploadingAvatar || !avatarFile || isRemovingAvatar} className="gap-2">
                <Camera className="w-4 h-4" />
                {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={isRemovingAvatar || isUploadingAvatar || (!profile?.avatar_url && !avatarPreview)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isRemovingAvatar ? "Removing..." : "Remove Photo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ""} disabled />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <PakistanCityCombobox
                  value={location}
                  onValueChange={setLocation}
                  placeholder="Type city name (e.g., La...)"
                />
              </div>

              <Button type="submit" variant="gold" disabled={isSavingProfile} className="w-full sm:w-auto">
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              <Button type="submit" disabled={isSavingPassword} className="w-full sm:w-auto">
                {isSavingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserProfileSettings;
