import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
      <CardContent className="py-12 px-6 flex flex-col items-center text-center">
        <Icon className="h-16 w-16 mb-6 text-green-200" />
        <h3 className="text-xl font-medium text-green-800 mb-2">{title}</h3>
        <p className="text-green-600 mb-6 max-w-md">{description}</p>
        
        {actionLabel && onAction && (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState; 