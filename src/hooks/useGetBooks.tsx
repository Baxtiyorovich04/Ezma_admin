import { useQuery } from '@tanstack/react-query';

import api from '../API';

export interface Book {
  id: number;
  library: number;
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
}

const fetchBooks = async () => {
  try {
    const { data } = await api.get<Book[]>('/books/books/');
    // Convert array to the expected format
    return {
      results: data,
      count: data.length
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const useGetBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    retry: 1,
  });
};

export const useGetBookById = (id: number) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const { data } = await api.get<Book>(`/books/book/${id}/`);
        return data;
      } catch (error) {
        console.error(`Error fetching book ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
  });
};

export const deleteBook = async (id: number) => {
  try {
    await api.delete(`/books/book/${id}/`);
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    throw error;
  }
};

