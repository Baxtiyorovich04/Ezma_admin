import {
  Table,
  ConfigProvider,
  theme,
  Spin,
  Alert,
  Tag,
  Input,
  Tabs,
  Dropdown,
  message,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useLibraries, Library } from "../hooks/useLibraries";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import API from "../API";
import { useTranslation } from "react-i18next";

const Libraries = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useLibraries();
  const [displayedData, setDisplayedData] = useState<Library[]>([]);
  const [likedLibraries, setLikedLibraries] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleRowClick = (libraryId: number) => {
    navigate(`/librarydetail/${libraryId}`);
  };

  const handleActivateLibrary = async (id: number) => {
    try {
      await API.patch(`/libraries/library/activate/${id}/`, {
        is_active: true,
      });
      message.success(t("libraries.activateSuccess"));
      refetch();
    } catch (error) {
      message.error(t("libraries.activateFailed"));
      console.error("Failed to activate library:", error);
    }
  };

  const handleDeactivateLibrary = async (id: number) => {
    try {
      await API.patch(`/libraries/library/deactivate/${id}/`, {});
      message.success(t("libraries.deactivateSuccess"));
      refetch();
    } catch (error) {
      message.error(t("libraries.deactivateFailed"));
      console.error("Failed to deactivate library:", error);
    }
  };

  const getDropdownItems = (record: Library) => {
    return [
      {
        key: "activate",
        label: t("common.activate"),
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
          handleActivateLibrary(record.id);
        },
      },
      {
        key: "deactivate",
        label: t("common.deactivate"),
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
          handleDeactivateLibrary(record.id);
        },
      },
    ];
  };

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
          onClick={(e) => {
            e.stopPropagation();
            handleLike(record.id);
          }}
        >
          {likedLibraries.includes(record.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
      ),
    },
    {
      title: t("libraries.library"),
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
    },
    {
      title: t("libraries.status"),
      dataIndex: "is_active",
      key: "status",
      width: 120,
      render: (isActive) => (
        <Tag
          className={`status-tag ${
            isActive ? "ant-tag-success" : "ant-tag-error"
          }`}
        >
          {isActive ? t("common.active") : t("common.inactive")}
        </Tag>
      ),
    },
    {
      title: t("libraries.address"),
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: t("libraries.totalBooks"),
      dataIndex: "total_books",
      key: "total_books",
      width: 150,
      render: (total) => `${total} ta`,
    },
    {
      title: t("libraries.actions"),
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getDropdownItems(record) }}
          trigger={["click"]}
        >
          <button
            className="action-button"
            onClick={(e) => e.stopPropagation()}
          >
            •••
          </button>
        </Dropdown>
      ),
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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return displayedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [displayedData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#6D28D9" }} spin />
          }
          tip={t("libraries.loading")}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message={t("common.error")}
          description={t("libraries.loadError")}
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
            setCurrentPage(1);
          }}
          items={[
            { label: t("libraries.filters.active"), key: "active" },
            { label: t("libraries.filters.inactive"), key: "inactive" },
            { label: t("libraries.filters.liked"), key: "liked" },
            { label: t("libraries.filters.books"), key: "books" },
            { label: t("libraries.filters.az"), key: "az" },
            { label: t("libraries.filters.za"), key: "za" },
          ]}
          className="filter-tabs"
        />
        <Input
          placeholder={t("common.search")}
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterAndSortData(likedLibraries, e.target.value, activeFilter);
            setCurrentPage(1);
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
          dataSource={paginatedData?.map((library) => ({
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
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
            style: { cursor: "pointer" },
          })}
        />
      </ConfigProvider>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={displayedData.length}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Libraries;
