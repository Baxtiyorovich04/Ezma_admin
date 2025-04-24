import {
  Table,
  ConfigProvider,
  theme,
  Spin,
  Alert,
  Tag,
  Input,
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useLibraries, Library } from "../hooks/useLibraries";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Libraries = () => {
  const { data, isLoading, error } = useLibraries();
  const [displayedData, setDisplayedData] = useState<Library[]>([]);
  const [likedLibraries, setLikedLibraries] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const containerRef = useRef<HTMLDivElement>(null);

  const columns: ColumnsType<Library> = [
    {
      title: "",
      key: "like",
      width: 50,
      fixed: "left",
      render: (_, record) => (
        <button
          className={`like-button ${
            likedLibraries.includes(record.id) ? "liked" : ""
          }`}
          onClick={() => handleLike(record.id)}
        >
          {likedLibraries.includes(record.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
      ),
    },
    {
      title: "Kutubxona",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
      render: (text, record) => (
        <Link to={`/librarydetail/${record.id}`} className="library-name">
          {text}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"} className="status-tag">
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Manzil",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Kitoblar soni",
      dataIndex: "total_books",
      key: "total_books",
      width: 150,
      render: (total) => `${total} ta`,
    },
    {
      title: "",
      key: "actions",
      width: 80,
      fixed: "right",
      render: () => <button className="action-button">•••</button>,
    },
  ];

  const handleLike = (libraryId: number) => {
    setLikedLibraries((prev) => {
      const newLiked = prev.includes(libraryId)
        ? prev.filter((id) => id !== libraryId)
        : [...prev, libraryId];

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
        (library) =>
          library.name.toLowerCase().includes(search.toLowerCase()) ||
          library.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply tab filter
    switch (filter) {
      case "active":
        filteredData = filteredData.filter((library) => library.is_active);
        break;
      case "inactive":
        filteredData = filteredData.filter((library) => !library.is_active);
        break;
      case "liked":
        filteredData = filteredData.filter((library) =>
          likedIds.includes(library.id)
        );
        break;
      case "books":
        filteredData.sort((a, b) => b.total_books - a.total_books);
        break;
      case "az":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default case will show all libraries
        break;
    }

    // Always prioritize liked libraries in the results
    filteredData.sort((a, b) => {
      const aLiked = likedIds.includes(a.id);
      const bLiked = likedIds.includes(b.id);
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      return 0;
    });

    setDisplayedData(filteredData);
  };

  useEffect(() => {
    if (data) {
      filterAndSortData(likedLibraries, searchQuery, activeFilter);
    }
  }, [data, searchQuery, activeFilter]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#6D28D9" }} spin />
          }
          tip="Kutubxonalar yuklanmoqda..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message="Xatolik"
          description="Kutubxonalarni yuklashda xatolik yuz berdi."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="libraries-container" ref={containerRef}>
      <div className="libraries-header">
        <Tabs
          activeKey={activeFilter}
          onChange={(key) => {
            setActiveFilter(key);
            filterAndSortData(likedLibraries, searchQuery, key);
          }}
          items={[
            { label: "Active", key: "active" },
            { label: "Inactive", key: "inactive" },
            { label: "Liked", key: "liked" },
            { label: "A lot of books", key: "books" },
            { label: "A-Z", key: "az" },
            { label: "Z-A", key: "za" },
          ]}
          className="filter-tabs"
        />
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterAndSortData(likedLibraries, e.target.value, activeFilter);
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
          dataSource={displayedData?.map((library) => ({
            ...library,
            key: library.id,
          }))}
          pagination={false}
          className="libraries-table"
          scroll={{ y: "calc(100vh - 220px)", x: "max-content" }}
          sticky={{
            offsetHeader: 0,
          }}
          showSorterTooltip={false}
          bordered={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default Libraries;
