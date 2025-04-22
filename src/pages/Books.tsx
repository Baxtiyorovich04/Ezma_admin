import { useState } from 'react';
import { useGetBooks } from '../hooks/useGetBooks';
import BookCard from '../components/card/bookCard';
import { Pagination, ConfigProvider, theme, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Number of books per page
  const { data, isLoading, error } = useGetBooks();

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#6D28D9' }} spin />} 
          tip="Loading books..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message="Error"
          description="Failed to load books. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className="no-data-container">
        <Alert
          message="No Books Found"
          description="There are no books available at the moment."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBooks = data.results.slice(startIndex, endIndex);
  const total = data.results.length;

  return (
    <div className="books-container">
      <div className="books-grid">
        {currentBooks.map((book) => (
          <BookCard 
            key={`book-${book.id}`} 
            book={book} 
          />
        ))}
      </div>
      <div className="pagination-container">
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#6D28D9',
              colorBgContainer: 'transparent',
              colorText: '#fff',
            },
          }}
        >
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `Total ${total} books`}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Books;