// hooks/useListingsApi.tsx
import { useState, useCallback } from 'react';

export const useListingsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createListing = useCallback(async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/advertisements/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createListing,
    loading,
    error,
    updateListing: async (id: string, data: any) => { /* ... */ },
    deleteListing: async (id: string) => { /* ... */ },
    fetchListings: async () => { /* ... */ },
  };
};