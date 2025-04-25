import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, ConfigProvider, theme, Spin, Alert, Tag, Input, Tabs, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Book } from '../types/Book';
import API from '../API';
import '../scss/pages/_books.scss';

const PAGE_SIZE = 20;

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
      title: 'Book Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (text: string) => <span className="book-name">{text}</span>,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 200,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 200,
    },
    {
      title: 'Available Copies',
      dataIndex: 'quantity_in_library',
      key: 'quantity_in_library',
      width: 150,
      render: (quantity: number) => (
        <Tag color={quantity > 0 ? 'success' : 'error'} className="quantity-tag">
          {quantity} {quantity === 1 ? 'copy' : 'copies'}
        </Tag>
      ),
    }
  ];

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
        <Alert message="Failed to load books. Please try again later." type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <Tabs
          activeKey={activeFilter}
          onChange={(key) => {
            setActiveFilter(key);
            setCurrentPage(1);
          }}
          items={[
            { label: 'All Books', key: 'all' },
            { label: 'Liked', key: 'liked' },
            { label: 'A-Z', key: 'az' },
            { label: 'Z-A', key: 'za' },
          ]}
          className="filter-tabs"
        />
        <Input
          placeholder="Search books..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
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
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filterAndSortData.length}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `Total ${total} books`}
          />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default Books;