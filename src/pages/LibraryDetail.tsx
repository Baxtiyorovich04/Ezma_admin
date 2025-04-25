import { useParams, useNavigate } from "react-router-dom";
import { useLibraryDetail } from "../hooks/useLibraryDetail";
import { Spin, Alert, Table, Tag, ConfigProvider, theme } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaTelegram,
  FaBook,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const LibraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useLibraryDetail(Number(id));

  const columns = [
    {
      title: "Kitob nomi",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Link to={`/books/${record.id}`} className="book-name">
          {text}
        </Link>
      ),
    },
    {
      title: "Muallif",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Nashriyot",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: "Soni",
      dataIndex: "quantity_in_library",
      key: "quantity",
      render: (quantity: number) => `${quantity} ta`,
    },
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#6D28D9" }} spin />
          }
          tip="Kutubxona ma'lumotlari yuklanmoqda..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message="Xatolik"
          description="Kutubxona ma'lumotlarini yuklashda xatolik yuz berdi."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const library = data?.results.library;
  const books = data?.results.books;

  return (
    <div className="library-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft />
        <span>Orqaga qaytish</span>
      </button>

      <div className="library-detail__header">
        <div className="library-detail__info">
          <h1>{library?.name}</h1>
          <div className="library-detail__status">
            <Tag color={data?.results.is_active ? "success" : "error"}>
              {data?.results.is_active ? "Active" : "Inactive"}
            </Tag>
          </div>
        </div>
        <div className="library-detail__contacts">
          <div className="contact-item">
            <FaPhone />
            <span>{data?.results.phone}</span>
          </div>
          {library?.social_media.telegram && (
            <div className="contact-item">
              <FaTelegram />
              <a
                href={library.social_media.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            </div>
          )}
          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>{library?.address}</span>
          </div>
        </div>
      </div>

      <div className="library-detail__stats">
        <div className="stat-card">
          <FaBook />
          <div className="stat-info">
            <span className="stat-value">{data?.results.total_books}</span>
            <span className="stat-label">Jami kitoblar</span>
          </div>
        </div>
      </div>

      <div className="library-detail__books">
        <h2>Kutubxona kitoblari</h2>
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
            dataSource={books?.map((book) => ({ ...book, key: book.id }))}
            pagination={false}
            className="books-table"
            scroll={{ y: "calc(100vh - 400px)" }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default LibraryDetail;
