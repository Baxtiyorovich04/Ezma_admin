import { useState } from 'react';
import { Table, Card, Typography, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBooks, Book } from '../hooks/useBooks';


const { Title } = Typography;
const { Search } = Input;

const MostSearched = () => {
  const { t } = useTranslation();
  const { books, loading } = useBooks();
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: t('books.bookName'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Book, b: Book) => a.name.localeCompare(b.name),
    },
    {
      title: t('books.author'),
      dataIndex: 'author',
      key: 'author',
      sorter: (a: Book, b: Book) => a.author.localeCompare(b.author),
    },
    {
      title: t('books.publisher'),
      dataIndex: 'publisher',
      key: 'publisher',
      sorter: (a: Book, b: Book) => a.publisher.localeCompare(b.publisher),
    },
    {
      title: t('books.availableCopies'),
      dataIndex: 'quantity_in_library',
      key: 'quantity_in_library',
      sorter: (a: Book, b: Book) => a.quantity_in_library - b.quantity_in_library,
      render: (copies: number) => (
        <span>
          {copies} {copies === 1 ? t('books.copy') : t('books.copies')}
        </span>
      ),
    },
  ];

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchText.toLowerCase()) ||
    book.author.toLowerCase().includes(searchText.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="most-searched">
      <Card>
        <Title level={2}>{t('sidebar.mostSearched')}</Title>
        
        <div style={{ width: '100%', marginBottom: 16 }}>
          <Search
            placeholder={t('books.searchPlaceholder')}
            allowClear
            enterButton
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBooks}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default MostSearched;
