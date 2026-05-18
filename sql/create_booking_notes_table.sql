-- Create booking_notes table for storing internal admin notes on applications
CREATE TABLE IF NOT EXISTS booking_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  author VARCHAR(255) DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries by booking_id
CREATE INDEX IF NOT EXISTS idx_booking_notes_booking_id ON booking_notes(booking_id);

-- Create index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_booking_notes_created_at ON booking_notes(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;

-- Create policy: Only authenticated users can view notes (restrict to admin in app)
CREATE POLICY "Allow authenticated users to view booking notes" 
  ON booking_notes FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy: Only authenticated users can insert notes
CREATE POLICY "Allow authenticated users to insert booking notes" 
  ON booking_notes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
