import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4 sm:mb-6 md:mb-10 mx-1 sm:mx-2 animate-fade-up">
    <div className="relative h-40 sm:h-48 md:h-60 overflow-hidden">
      <Skeleton height="100%" width="100%" style={{ position: 'absolute', top: 0, left: 0 }} />
      <span className="absolute top-2 left-2">
        <Skeleton width={60} height={18} borderRadius={8} />
      </span>
      <span className="absolute top-2 right-2">
        <Skeleton width={40} height={18} borderRadius={8} />
      </span>
    </div>
    <div className="p-3 sm:p-4">
      <h3 className="font-semibold text-base mb-1">
        <Skeleton width="80%" height={20} />
      </h3>
      <div className="flex items-center text-xs sm:text-sm mb-2 sm:mb-3">
        <Skeleton width={60} height={16} />
        <span className="ml-2">
          <Skeleton width={40} height={16} />
        </span>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton width={80} height={24} />
        <Skeleton width={70} height={28} />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
