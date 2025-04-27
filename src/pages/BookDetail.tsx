import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookById, deleteBook } from '../hooks/useGetBooks';
import { Modal, Button, ConfigProvider, theme, Card, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { ArrowLeftOutlined, DeleteOutlined, BookOutlined, UserOutlined, BankOutlined, CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { t } = useTranslation();
  
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
      navigate(`/librarydetail/${book.library}`);
    }
  };

  const handleBack = () => {
    navigate('/books');
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading">{t('bookDetail.loading')}</div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error">{t('bookDetail.loadError')}</div>
    </div>
  );
  
  if (!book) return (
    <div className="error-container">
      <div className="no-data">{t('bookDetail.notFound')}</div>
    </div>
  );

  return (
    <div className="book-detail">
      <div className="book-detail__header">
        <Button 
          className="book-detail__back-button"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
        >
          {t('bookDetail.backToBooks')}
        </Button>
      </div>

      <div className="book-detail__content">
        <Card className="book-detail__card">
          <div className="book-detail__title">
            <BookOutlined className="book-detail__icon" />
            <h1>{book.name}</h1>
          </div>

          <div className="book-detail__info">
            <div className="info-item">
              <UserOutlined className="info-icon" />
              <div className="info-content">
                <label>{t('bookDetail.author')}</label>
                <span>{book.author}</span>
              </div>
            </div>

            <div className="info-item">
              <BankOutlined className="info-icon" />
              <div className="info-content">
                <label>{t('bookDetail.publisher')}</label>
                <span>{book.publisher}</span>
              </div>
            </div>

            <div className="info-item">
              <CopyOutlined className="info-icon" />
              <div className="info-content">
                <label>{t('bookDetail.availableCopies')}</label>
                <Tag 
                  color={book.quantity_in_library > 0 ? 'success' : 'error'}
                  className="quantity-tag"
                >
                  {book.quantity_in_library} {book.quantity_in_library === 1 ? t('books.copy') : t('books.copies')}
                </Tag>
              </div>
            </div>

            <div className="info-item">
              <BankOutlined className="info-icon" />
              <div className="info-content">
                <label>{t('bookDetail.library')}</label>
                <span 
                  className="library-link"
                  onClick={handleLibraryClick}
                >
                  {t('bookDetail.libraryNumber', { number: book.library })}
                </span>
              </div>
            </div>
          </div>

          <div className="book-detail__actions">
            <Tooltip title={t('bookDetail.deleteTooltip')}>
              <Button 
                type="primary" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteModalVisible(true)}
              >
                {t('bookDetail.deleteBook')}
              </Button>
            </Tooltip>
          </div>
        </Card>
      </div>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgContainer: 'var(--bg-primary)',
            colorText: 'var(--text-primary)',
            colorBorderSecondary: 'var(--border)',
            colorPrimary: '#6D28D9',
          },
        }}
      >
        <Modal
          title={t('bookDetail.confirmDeleteTitle')}
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText={t('bookDetail.delete')}
          cancelText={t('bookDetail.cancel')}
          okButtonProps={{ danger: true }}
          className="book-detail__modal"
        >
          <p>{t('bookDetail.confirmDeleteText')}</p>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default BookDetail;