'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';

type Product = {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  similarityScore: number;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setResults([]);
      setError(null);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFile(null);
    setImageUrl(url);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
    }
    setResults([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !imageUrl) {
      setError("Please upload an image or provide a URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center my-8">Visual Product Matcher</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg bg-gray-800">
        <div className="flex flex-col md:flex-row w-full gap-4 items-center">
          <label className="border-2 border-dashed border-gray-600 p-4 rounded-lg cursor-pointer w-full text-center hover:bg-gray-700 transition-colors">
            <span className="text-gray-400">Click to upload an image</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          <span className="text-gray-400">OR</span>
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl || ''}
            onChange={handleImageUrlChange}
            className="border p-2 rounded-lg w-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
          disabled={loading || (!file && !imageUrl)}
        >
          {loading ? "Matching..." : "Find Similar Products"}
        </button>
      </form>
      
      {imageUrl && (
        <div className="my-8 text-center p-4 border rounded-lg shadow-lg bg-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-white">Uploaded Image</h2>
          <div className="relative w-64 h-64 mx-auto border-2 border-gray-600 rounded-lg overflow-hidden">
            <Image src={imageUrl} alt="Uploaded" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {error && (
        <div className="text-center my-8 p-4 bg-red-800 text-white rounded-lg shadow-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}
      
      {loading && (
        <div className="text-center my-8">
          <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-white">Matching products...</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="my-8 p-4 border rounded-lg shadow-lg bg-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-white text-center">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
