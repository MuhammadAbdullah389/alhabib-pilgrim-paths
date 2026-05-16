import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const resolveRoleAndRedirect = async () => {
    const redirectTarget = searchParams.get('redirect');
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate('/auth/sign-in', { replace: true });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (redirectTarget && profile?.role !== 'admin') {
      navigate(redirectTarget, { replace: true });
      return;
    }

    navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Signed in successfully!');
      await resolveRoleAndRedirect();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated border border-border/60">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-all duration-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <CardTitle className="font-display text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-base leading-relaxed pt-2">Access your account to view bookings and manage your pilgrimage reservations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="flex items-center gap-2.5 mb-2.5 text-sm font-semibold text-foreground">
                <Mail className="w-4 h-4 text-accent" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="flex items-center gap-2.5 mb-2.5 text-sm font-semibold text-foreground">
                <Lock className="w-4 h-4 text-accent" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>

            <Button type="submit" variant="gold" className="w-full h-12 text-base font-semibold shadow-gold hover:shadow-elevated" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
