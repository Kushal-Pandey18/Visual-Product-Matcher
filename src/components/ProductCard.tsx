'use client';

import Image from 'next/image';

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    similarityScore: number;
  };
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col items-center text-center p-4">
      <div className="w-full h-48 mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.category}</p>
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">Score:</span>
        <span className="text-md font-bold text-blue-600 ml-2">
          {Math.round(product.similarityScore * 100)}%
        </span>
      </div>
    </div>
  );
};
