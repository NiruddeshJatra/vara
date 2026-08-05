import React from 'react';
import { RentalStatus } from '../../constants/rental';
import { RENTAL_STATUS_DISPLAY, RENTAL_STATUS_COLORS, RENTAL_STATUS_ICONS } from '../../constants/rental';

interface RentalStatusBadgeProps {
  status: RentalStatus;
  showIcon?: boolean;
  className?: string;
}

/**
 * A badge component that displays the rental status with appropriate styling
 */
const RentalStatusBadge: React.FC<RentalStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const displayText = RENTAL_STATUS_DISPLAY[status];
  const colorClasses = RENTAL_STATUS_COLORS[status];
  const icon = RENTAL_STATUS_ICONS[status];

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {displayText}
    </div>
  );
};

export default RentalStatusBadge; 