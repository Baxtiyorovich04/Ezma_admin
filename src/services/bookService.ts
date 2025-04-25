import api from '../API';

export interface Book {
  id: number;
  title: string;
  author: string;
  // Add other book properties as needed
}

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get<Book[]>('/books');
    return response.data;
  },

  getBookById: async (id: number) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: Omit<Book, 'id'>) => {
    const response = await api.post<Book>('/books', bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: number) => {
    await api.delete(`/books/${id}`);
  }
}; 