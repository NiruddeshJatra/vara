// hooks/useListingsApi.tsx
import { useState, useCallback } from 'react';
import { ListingFormData } from '@/types/listings';

export const useListingsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createListing = useCallback(async (formData: ListingFormData) => {
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

  const updateListing = useCallback(async (id: string, formData: ListingFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advertisements/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteListing = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advertisements/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getListingById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advertisements/${id}/`);

      if (!response.ok) {
        throw new Error('Failed to fetch listing');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/advertisements/');

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createListing,
    updateListing,
    deleteListing,
    getListingById,
    fetchListings,
    loading,
    error,
  };
};