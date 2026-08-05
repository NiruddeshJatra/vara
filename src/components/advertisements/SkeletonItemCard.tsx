import React from "react";

const SkeletonItemCard = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
    <div className="h-48 bg-gray-200 w-full" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="mt-4 h-8 bg-gray-200 rounded" />
    </div>
  </div>
);

export default SkeletonItemCard;
