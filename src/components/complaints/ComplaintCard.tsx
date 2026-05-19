import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileImage } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCategoryLabel, getStatusInfo } from "@/data/complaints";
import type { Complaint } from "@/hooks/useSupabase";

interface ComplaintCardProps {
  complaint: Complaint;
  onView: (complaint: Complaint) => void;
  isAdmin?: boolean;
}

const ComplaintCard = ({ complaint, onView, isAdmin = false }: ComplaintCardProps) => {
  const statusInfo = getStatusInfo(complaint.status);
  const categoryLabel = getCategoryLabel(complaint.category);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{complaint.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
            </p>
          </div>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabel}
          </Badge>
          {complaint.proof_image_url && (
            <Badge variant="secondary" className="text-xs gap-1">
              <FileImage className="w-3 h-3" /> Image
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>

        {complaint.admin_response && (
          <div className="bg-accent/5 rounded-lg p-2 border border-accent/20">
            <p className="text-xs font-medium text-accent mb-1">Admin Response:</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{complaint.admin_response}</p>
          </div>
        )}

        <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => onView(complaint)}>
          <Eye className="w-4 h-4" /> View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
