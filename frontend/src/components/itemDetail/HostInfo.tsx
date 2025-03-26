import React from 'react';
import { User } from 'lucide-react';

export default function HostInfo() {
  return (
    <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
          <User className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hosted and verified by Vara</h2>
          <p className="text-gray-600">You'll rent from the owner, but we handle everything</p>
        </div>
      </div>
    </div>
  );
} 