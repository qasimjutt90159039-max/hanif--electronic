import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse flex flex-col justify-between h-96">
      <div>
        <div className="w-full h-44 bg-gray-200 rounded-xl mb-4"></div>
        <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-full h-5 bg-gray-200 rounded mb-2"></div>
        <div className="w-3/4 h-5 bg-gray-200 rounded mb-4"></div>
      </div>
      <div>
        <div className="w-28 h-6 bg-gray-200 rounded mb-3"></div>
        <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
      ))}
    </div>
  );
};
