import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookById, deleteBook } from '../hooks/useGetBooks';
import { Modal, Button, ConfigProvider, theme } from 'antd';
import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const { data: book, isLoading, error } = useGetBookById(Number(id));

  const handleDelete = async () => {
    try {
      await deleteBook(Number(id));
      navigate('/books');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleLibraryClick = () => {
    if (book?.library) {
      navigate(`/libraries/${book.library}`);
    }
  };

  const handleBack = () => {
    navigate('/books');
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading book details</div>;
  if (!book) return <div className="no-data">Book not found</div>;

  return (
    <div className="book-detail">
      <div className="book-detail__content">
        <Button 
          className="book-detail__back-button"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
        >
          Back to Books
        </Button>
        <h1>{book.name}</h1>
        <div className="book-detail__info">
          <p>
            <strong>Author:</strong>
            <span>{book.author}</span>
          </p>
          <p>
            <strong>Publisher:</strong>
            <span>{book.publisher}</span>
          </p>
          <p>
            <strong>Available Copies:</strong>
            <span>{book.quantity_in_library}</span>
          </p>
          <p>
            <strong>Library ID:</strong>
            <span 
              className="book-detail__library-link"
              onClick={handleLibraryClick}
            >
              {book.library}
            </span>
          </p>
        </div>
        <div className="book-detail__actions">
          <Button 
            type="primary" 
            danger 
            onClick={() => setIsDeleteModalVisible(true)}
          >
            Delete Book
          </Button>
        </div>
      </div>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#6D28D9',
            colorBgContainer: '#1F2937',
            colorText: '#fff',
          },
        }}
      >
        <Modal
          title="Confirm Delete"
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          className="book-detail__modal"
        >
          <p>Are you sure you want to delete this book? This action cannot be undone.</p>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default BookDetail;