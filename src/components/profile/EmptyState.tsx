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
    <Card className="border border-green-200 hover:shadow-lg transition-shadow bg-gradient-to-b from-lime-50 to-white">
      <CardContent className="py-12 px-4 sm:px-8 flex flex-col items-center text-center">
        <Icon className="h-16 w-16 mb-6 text-lime-400" />
        <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2">{title}</h3>
        <p className="text-green-700 mb-6 max-w-xs sm:max-w-md text-sm sm:text-base">{description}</p>
        
        {actionLabel && onAction && (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md font-semibold text-sm sm:text-base transition-all duration-200"
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