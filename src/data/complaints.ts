export const COMPLAINT_CATEGORIES = [
  { value: "hotel_issue", label: "Hotel Issue" },
  { value: "transport_issue", label: "Transport Issue" },
  { value: "guide_issue", label: "Guide Issue" },
  { value: "document_issue", label: "Document Issue" },
  { value: "package_issue", label: "Package Issue" },
  { value: "general", label: "General Complaint" },
] as const;

export const COMPLAINT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
] as const;

export const getCategoryLabel = (value: string) =>
  COMPLAINT_CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const getStatusInfo = (value: string) =>
  COMPLAINT_STATUSES.find((s) => s.value === value) ?? { value, label: value, color: "bg-gray-100 text-gray-800" };
