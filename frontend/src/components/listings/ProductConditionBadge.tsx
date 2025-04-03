import React from 'react';
import { ProductCondition } from '../../constants/productAttributes';
import { CONDITION_DISPLAY, CONDITION_COLORS } from '../../constants/productAttributes';

interface ProductConditionBadgeProps {
  condition: ProductCondition;
  className?: string;
}

/**
 * A badge component that displays the product condition with appropriate styling
 */
const ProductConditionBadge: React.FC<ProductConditionBadgeProps> = ({
  condition,
  className = '',
}) => {
  const displayText = CONDITION_DISPLAY[condition];
  const colorClasses = CONDITION_COLORS[condition];

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}>
      {displayText}
    </div>
  );
};

export default ProductConditionBadge; 