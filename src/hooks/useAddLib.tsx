import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../API';

interface LibraryData {
  user: {
    password: string;
    name: string;
    phone: string;
  };
  library: {
    address: string;
    social_media: Record<string, string>;
    can_rent_books: boolean;
    latitude: string;
    longitude: string;
  };
}

export const useAddLib = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addLibrary = async (data: LibraryData) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/auth/register-library/', data);
      
      // Redirect to libraries page after successful registration
      navigate('/libraries');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add library');
      console.error('Error adding library:', err);
    } finally {
      setLoading(false);
    }
  };

  return { addLibrary, loading, error };
};
