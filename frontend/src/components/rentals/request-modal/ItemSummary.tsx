
import React from 'react';

type ItemSummaryProps = {
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemDuration: string;
};

const ItemSummary = ({ itemName, itemImage, itemPrice, itemDuration }: ItemSummaryProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-16 w-16 rounded-md overflow-hidden">
        <img 
          src={itemImage} 
          alt={itemName} 
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h3 className="font-medium">{itemName}</h3>
        <p className="text-sm text-gray-500">${itemPrice} per {itemDuration}</p>
      </div>
    </div>
  );
};

export default ItemSummary;
