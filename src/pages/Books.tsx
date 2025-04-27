import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, ConfigProvider, theme, Spin, Alert, Tag, Input, Radio, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Book } from '../types/Book';
import API from '../API';
import '../scss/pages/_books.scss';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 20;

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await API.get('/books/books/');
      return response.data || [];
    },
    gcTime: 30 * 60 * 1000, 
    staleTime: 5 * 60 * 1000,
  });

  const handleLike = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleRowClick = (record: Book) => {
    navigate(`/books/${record.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterAndSortData = useMemo(() => {
    let filteredData = [...books];

    if (searchTerm) {
      filteredData = filteredData.filter(
        (book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (activeFilter) {
      case 'liked':
        filteredData = filteredData.filter((book) => likedBooks.has(book.id));
        break;
      case 'az':
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    filteredData.sort((a, b) => {
      const aLiked = likedBooks.has(a.id);
      const bLiked = likedBooks.has(b.id);
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      return 0;
    });

    return filteredData;
  }, [books, searchTerm, activeFilter, likedBooks]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filterAndSortData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filterAndSortData, currentPage]);

  const columns: ColumnsType<Book> = [
    {
      title: '',
      key: 'like',
      width: 50,
      fixed: 'left',
      render: (_: any, record: Book) => (
        <button
          className={`like-button ${likedBooks.has(record.id) ? 'liked' : ''}`}
          onClick={(e) => handleLike(record.id, e)}
        >
          {likedBooks.has(record.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
      ),
    },
    {
      title: t('books.bookName'),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (text: string) => <span className="book-name">{text}</span>,
    },
    {
      title: t('books.author'),
      dataIndex: 'author',
      key: 'author',
      width: 200,
    },
    {
      title: t('books.publisher'),
      dataIndex: 'publisher',
      key: 'publisher',
      width: 200,
    },
    {
      title: t('books.availableCopies'),
      dataIndex: 'quantity_in_library',
      key: 'quantity_in_library',
      width: 150,
      render: (quantity: number) => (
        <Tag color={quantity > 0 ? 'success' : 'error'} className="quantity-tag">
          {quantity} {quantity === 1 ? t('books.copy') : t('books.copies')}
        </Tag>
      ),
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#6D28D9' }} spin />} 
          tip={t('books.loading')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert message={t('books.loadError')} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <Radio.Group
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-group"
        >
          <Radio.Button value="all">{t('books.allBooks')}</Radio.Button>
          <Radio.Button value="liked">{t('books.liked')}</Radio.Button>
          <Radio.Button value="az">{t('books.az')}</Radio.Button>
          <Radio.Button value="za">{t('books.za')}</Radio.Button>
        </Radio.Group>
        <div className="header-controls">
          <Input
            placeholder={t('books.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <Pagination
            current={currentPage}
            total={filterAndSortData.length}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => t('books.total', { total })}
            className="pagination"
          />
        </div>
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
          components: {
            Table: {
              headerBg: 'transparent',
              headerColor: 'var(--text-primary)',
              headerSplitColor: 'var(--border)',
              rowHoverBg: 'var(--bg-secondary)',
              rowSelectedBg: 'var(--bg-secondary)',
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={paginatedData.map((book) => ({
            ...book,
            key: book.id,
          }))}
          pagination={false}
          className="books-table"
          scroll={{ y: 'calc(100vh - 220px)', x: 'max-content' }}
          sticky={{
            offsetHeader: 0,
          }}
          showSorterTooltip={false}
          bordered={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
        />
      </ConfigProvider>
    </div>
  );
};

export default Books;