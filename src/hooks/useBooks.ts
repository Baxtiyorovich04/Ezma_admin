import { useQuery } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'sonner';

export interface Book {
  id: number;
  library: number;
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
  is_active: boolean;
}

const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await API.get('https://s-libraries.uz/api/v1/books/books/');
    return response.data;
  } catch (error) {
    toast.error('Kitoblarni yuklashda xatolik yuz berdi');
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });
}; 