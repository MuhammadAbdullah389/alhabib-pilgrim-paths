-- Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  proof_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_response TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT complaint_status_check CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  CONSTRAINT complaint_category_check CHECK (category IN ('hotel_issue', 'transport_issue', 'guide_issue', 'document_issue', 'package_issue', 'general'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS complaints_user_id_idx ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS complaints_booking_id_idx ON public.complaints(booking_id);
CREATE INDEX IF NOT EXISTS complaints_status_idx ON public.complaints(status);
CREATE INDEX IF NOT EXISTS complaints_category_idx ON public.complaints(category);
CREATE INDEX IF NOT EXISTS complaints_assigned_to_idx ON public.complaints(assigned_to);
CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON public.complaints(created_at DESC);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Users can view their own complaints
CREATE POLICY "Users can view own complaints"
  ON public.complaints
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create complaints
CREATE POLICY "Users can create complaints"
  ON public.complaints
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all complaints
CREATE POLICY "Admins can view all complaints"
  ON public.complaints
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can update complaints
CREATE POLICY "Admins can update complaints"
  ON public.complaints
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Support staff can view complaints assigned to them
CREATE POLICY "Staff can view assigned complaints"
  ON public.complaints
  FOR SELECT
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
