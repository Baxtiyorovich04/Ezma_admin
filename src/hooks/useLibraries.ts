import { useQuery } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'sonner';

export interface Library {
  id: number;
  name: string;
  image: string | null;
  address: string;
  total_books: number;
  is_active: boolean;
}

const fetchLibraries = async (): Promise<Library[]> => {
  try {
    const response = await API.get('https://s-libraries.uz/api/v1/libraries/libraries/');
    return response.data;
  } catch (error) {
    toast.error('Kutubxonalarni yuklashda xatolik yuz berdi');
    console.error('Error fetching libraries:', error);
    throw error;
  }
};

export const useLibraries = () => {
  return useQuery({
    queryKey: ['libraries'],
    queryFn: fetchLibraries,
  });
};
