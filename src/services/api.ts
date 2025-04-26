import { Book } from '../types/Book';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}; 