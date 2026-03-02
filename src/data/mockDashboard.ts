export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  packageName: string;
  packageType: 'hajj' | 'umrah' | 'visa';
  sharingType: string;
  status: 'pending' | 'documents' | 'visa' | 'confirmed';
  date: string;
  amount: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah';
  distanceMeters: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export const mockBookings: Booking[] = [
  { id: 'B001', customerName: 'Muhammad Usman', phone: '0300-1234567', packageName: 'Standard Hajj Package', packageType: 'hajj', sharingType: 'Triple', status: 'confirmed', date: '2026-01-15', amount: 950000 },
  { id: 'B002', customerName: 'Fatima Bibi', phone: '0321-9876543', packageName: 'Economy Umrah Package', packageType: 'umrah', sharingType: 'Quad', status: 'visa', date: '2026-02-01', amount: 135000 },
  { id: 'B003', customerName: 'Ahmed Khan', phone: '0333-5551234', packageName: 'Premium Hajj Package', packageType: 'hajj', sharingType: 'Double', status: 'documents', date: '2026-02-10', amount: 1600000 },
  { id: 'B004', customerName: 'Ayesha Siddiqui', phone: '0345-6667890', packageName: 'Ramadan Special Umrah', packageType: 'umrah', sharingType: 'Triple', status: 'pending', date: '2026-02-20', amount: 300000 },
  { id: 'B005', customerName: 'Bilal Hussain', phone: '0312-4445678', packageName: 'Standard Umrah Package', packageType: 'umrah', sharingType: 'Quint', status: 'confirmed', date: '2026-01-28', amount: 190000 },
  { id: 'B006', customerName: 'Khadija Noor', phone: '0300-7778901', packageName: 'Economy Hajj Package', packageType: 'hajj', sharingType: 'Quad', status: 'visa', date: '2026-03-01', amount: 680000 },
  { id: 'B007', customerName: 'Tariq Mahmood', phone: '0322-1112345', packageName: 'UK Tourist Visa', packageType: 'visa', sharingType: '-', status: 'documents', date: '2026-02-15', amount: 25000 },
  { id: 'B008', customerName: 'Saima Akhtar', phone: '0301-8889012', packageName: 'Premium Umrah Package', packageType: 'umrah', sharingType: 'Double', status: 'confirmed', date: '2026-01-10', amount: 450000 },
];

export const mockHotels: Hotel[] = [
  { id: 'H001', name: 'Al Kiswah Towers', city: 'Makkah', distanceMeters: 800 },
  { id: 'H002', name: 'Pullman ZamZam', city: 'Makkah', distanceMeters: 200 },
  { id: 'H003', name: 'Hilton Suites Makkah', city: 'Makkah', distanceMeters: 50 },
  { id: 'H004', name: 'Swissotel Makkah', city: 'Makkah', distanceMeters: 300 },
  { id: 'H005', name: 'Raffles Makkah Palace', city: 'Makkah', distanceMeters: 50 },
  { id: 'H006', name: 'Makkah Towers', city: 'Makkah', distanceMeters: 400 },
  { id: 'H007', name: 'Al Eiman Royal', city: 'Madinah', distanceMeters: 500 },
  { id: 'H008', name: 'Shaza Al Madina', city: 'Madinah', distanceMeters: 300 },
  { id: 'H009', name: 'The Oberoi Madina', city: 'Madinah', distanceMeters: 100 },
  { id: 'H010', name: 'Millennium Madinah', city: 'Madinah', distanceMeters: 200 },
  { id: 'H011', name: 'Anwar Al Madinah', city: 'Madinah', distanceMeters: 350 },
];

export const mockTestimonials: Testimonial[] = [
  { id: 'T001', name: 'Muhammad Usman', location: 'Narowal', text: 'Alhamdulillah! The Hajj experience with Alhabib Travel was beyond my expectations.', rating: 5, status: 'approved', date: '2026-01-20' },
  { id: 'T002', name: 'Fatima Bibi', location: 'Sialkot', text: 'We performed Umrah with our family and the entire journey was smooth and hassle-free.', rating: 5, status: 'approved', date: '2026-01-25' },
  { id: 'T003', name: 'Zainab Ali', location: 'Narowal', text: 'Excellent arrangements! The hotel was very close to Haram. Will recommend to everyone.', rating: 4, status: 'pending', date: '2026-02-14' },
  { id: 'T004', name: 'Imran Malik', location: 'Gujranwala', text: 'Very good service but the food could be improved. Overall a wonderful spiritual journey.', rating: 3, status: 'pending', date: '2026-02-18' },
  { id: 'T005', name: 'Nadia Rauf', location: 'Lahore', text: 'Spam content here', rating: 1, status: 'rejected', date: '2026-02-20' },
];

export const monthlyBookingsData = [
  { month: 'Sep', bookings: 12, revenue: 5.2 },
  { month: 'Oct', bookings: 18, revenue: 8.1 },
  { month: 'Nov', bookings: 25, revenue: 12.5 },
  { month: 'Dec', bookings: 32, revenue: 16.8 },
  { month: 'Jan', bookings: 45, revenue: 24.3 },
  { month: 'Feb', bookings: 38, revenue: 19.7 },
];

export const packageTypeData = [
  { name: 'Hajj', value: 45 },
  { name: 'Umrah', value: 40 },
  { name: 'Visa', value: 15 },
];

export const statusCounts = {
  pending: 15,
  documents: 22,
  visa: 18,
  confirmed: 45,
};
