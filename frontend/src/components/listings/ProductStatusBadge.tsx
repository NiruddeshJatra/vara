import React from 'react';
import { ProductStatus } from '../../constants/productStatus';
import { PRODUCT_STATUS_DISPLAY, PRODUCT_STATUS_COLORS, PRODUCT_STATUS_ICONS } from '../../constants/productStatus';

interface ProductStatusBadgeProps {
  status: ProductStatus;
  showIcon?: boolean;
  className?: string;
}

/**
 * A badge component that displays the product status with appropriate styling
 */
const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const displayText = PRODUCT_STATUS_DISPLAY[status];
  const colorClasses = PRODUCT_STATUS_COLORS[status];
  const icon = PRODUCT_STATUS_ICONS[status];

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {displayText}
    </div>
  );
};

export default ProductStatusBadge; 