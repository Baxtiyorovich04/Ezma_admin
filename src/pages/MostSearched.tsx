import {
  Table,
  ConfigProvider,
  theme,
  Spin,
  Alert,
  Tag,
  Input,
  Tabs,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useBooks, Book } from "../hooks/useBooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const MostSearched = () => {
  const { data, isLoading, error } = useBooks();
  const [displayedData, setDisplayedData] = useState<Book[]>([]);
  const [likedBooks, setLikedBooks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleRowClick = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  const columns: ColumnsType<Book> = [
    {
      title: "",
      key: "like",
      width: 50,
      fixed: "left",
      render: (_, record) => (
        <button
          className={`like-button ${
            likedBooks.includes(record.id) ? "liked" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            handleLike(record.id);
          }}
        >
          {likedBooks.includes(record.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
      ),
    },
    {
      title: "Kitob nomi",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
    },
    {
      title: "Muallif",
      dataIndex: "author",
      key: "author",
      width: 200,
    },
    {
      title: "Nashriyot",
      dataIndex: "publisher",
      key: "publisher",
      width: 200,
    },
    {
      title: "Kutubxona",
      dataIndex: "library",
      key: "library",
      width: 120,
      render: (libraryId) => `ID: ${libraryId}`,
    },
    {
      title: "Soni",
      dataIndex: "quantity_in_library",
      key: "quantity",
      width: 100,
      render: (quantity) => `${quantity} ta`,
    },
  ];

  const handleLike = (bookId: number) => {
    setLikedBooks((prev) => {
      const newLiked = prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId];

      // Sort and filter the displayed data
      filterAndSortData(newLiked, searchQuery, activeFilter);

      return newLiked;
    });
  };

  const filterAndSortData = (
    likedIds: number[],
    search: string,
    filter: string
  ) => {
    if (!data) return;

    let filteredData = [...data];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(
        (book) =>
          book.name.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.publisher.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply tab filter
    switch (filter) {
      case "liked":
        filteredData = filteredData.filter((book) =>
          likedIds.includes(book.id)
        );
        break;
      case "quantity":
        filteredData.sort(
          (a, b) => b.quantity_in_library - a.quantity_in_library
        );
        break;
      case "az":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default case will show all books
        break;
    }

    // Always prioritize liked books in the results
    filteredData.sort((a, b) => {
      const aLiked = likedIds.includes(a.id);
      const bLiked = likedIds.includes(b.id);
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      return 0;
    });

    setDisplayedData(filteredData);
    // Reset visible count when filters change
    setVisibleCount(20);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  useEffect(() => {
    if (data) {
      filterAndSortData(likedBooks, searchQuery, activeFilter);
    }
  }, [data, searchQuery, activeFilter]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#6D28D9" }} spin />
          }
          tip="Kitoblar yuklanmoqda..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message="Xatolik"
          description="Kitoblarni yuklashda xatolik yuz berdi."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const visibleData = displayedData.slice(0, visibleCount);
  const hasMore = visibleCount < displayedData.length;

  return (
    <div className="most-searched-container" ref={containerRef}>
      <div className="most-searched-header">
        <Tabs
          activeKey={activeFilter}
          onChange={(key) => {
            setActiveFilter(key);
            filterAndSortData(likedBooks, searchQuery, key);
          }}
          items={[
            { label: "Barchasi", key: "all" },
            { label: "Sevimlilari", key: "liked" },
            { label: "Ko'p sonli", key: "quantity" },
            { label: "A-Z", key: "az" },
            { label: "Z-A", key: "za" },
          ]}
          className="filter-tabs"
        />
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterAndSortData(likedBooks, e.target.value, activeFilter);
          }}
          className="search-input"
        />
      </div>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgContainer: "var(--bg-secondary)",
            colorText: "var(--text-primary)",
            colorBorderSecondary: "var(--border)",
            colorPrimary: "#6D28D9",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={visibleData?.map((book) => ({
            ...book,
            key: book.id,
          }))}
          pagination={false}
          className="most-searched-table"
          scroll={{ y: "calc(100vh - 260px)", x: "max-content" }}
          sticky={{
            offsetHeader: 0,
          }}
          showSorterTooltip={false}
          bordered={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            style: { cursor: "pointer" },
          })}
        />
      </ConfigProvider>

      {hasMore && (
        <div className="show-more-container">
          <Button
            onClick={handleShowMore}
            type="primary"
            size="large"
            className="show-more-button"
          >
            Ko'proq ko'rsatish
          </Button>
        </div>
      )}
    </div>
  );
};

export default MostSearched;
