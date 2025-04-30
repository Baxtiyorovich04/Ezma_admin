import { useState, useEffect } from 'react';
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

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/books/books/');
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Kitoblarni yuklashda xatolik yuz berdi');
      toast.error('Kitoblarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      const response = await API.post('/books/books/', bookData);
      const newBook = response.data;
      setBooks(prev => [...prev, newBook]);
      toast.success('Kitob muvaffaqiyatli qo\'shildi');
      return newBook;
    } catch (err) {
      toast.error('Kitob qo\'shishda xatolik yuz berdi');
      throw err;
    }
  };

  const updateBook = async (id: number, bookData: Partial<Book>) => {
    try {
      const response = await API.patch(`/books/books/${id}/`, bookData);
      const updatedBook = response.data;
      setBooks(prev => prev.map(book => 
        book.id === id ? updatedBook : book
      ));
      toast.success('Kitob muvaffaqiyatli yangilandi');
      return updatedBook;
    } catch (err) {
      toast.error('Kitobni yangilashda xatolik yuz berdi');
      throw err;
    }
  };

  const deleteBook = async (id: number) => {
    try {
      await API.delete(`/books/books/${id}/`);
      setBooks(prev => prev.filter(book => book.id !== id));
      toast.success('Kitob muvaffaqiyatli o\'chirildi');
    } catch (err) {
      toast.error('Kitobni o\'chirishda xatolik yuz berdi');
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { 
    books, 
    loading, 
    error, 
    refetch: fetchBooks,
    createBook,
    updateBook,
    deleteBook
  };
}; 