import { useState, useEffect } from 'react';
import { bookService, Book } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      const newBook = await bookService.createBook(bookData);
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (err) {
      console.error('Error creating book:', err);
      throw err;
    }
  };

  const updateBook = async (id: number, bookData: Partial<Book>) => {
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => 
        book.id === id ? updatedBook : book
      ));
      return updatedBook;
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  };

  const deleteBook = async (id: number) => {
    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
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