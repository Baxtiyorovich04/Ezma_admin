import { useParams, useNavigate } from "react-router-dom";
import { useLibraryDetail } from "../hooks/useLibraryDetail";
import { Spin, Alert, Table, Tag, ConfigProvider, theme, Card, Row, Col, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  FaMapMarkerAlt,
  FaTelegram,
  FaBook,
  FaArrowLeft,
  FaInstagram,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { Title, Text } = Typography;

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LibraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useLibraryDetail(Number(id));
  const { t } = useTranslation();

  const columns = [
    {
      title: t("libraryDetail.bookName"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Link to={`/books/${record.id}`} className="book-name">
          {text}
        </Link>
      ),
    },
    {
      title: t("libraryDetail.author"),
      dataIndex: "author",
      key: "author",
    },
    {
      title: t("libraryDetail.publisher"),
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: t("libraryDetail.quantity"),
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
          tip={t("libraryDetail.loading")}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert
          message={t("common.error")}
          description={t("libraryDetail.loadError")}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const library = data?.results.library;
  const books = data?.results.books;
  const position: LatLngTuple = library?.latitude && library?.longitude 
    ? [parseFloat(library.latitude), parseFloat(library.longitude)] 
    : [39.026, 66.496];

  return (
    <div className="library-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft />
        <span>{t("libraryDetail.back")}</span>
      </button>

      <div className="library-detail__header">
        <div className="library-detail__info">
          <Title level={2} className="library-name">{library?.name}</Title>
          <div className="library-detail__status">
            <Tag color={data?.results.is_active ? "success" : "error"}>
              {data?.results.is_active ? t("libraryDetail.active") : t("libraryDetail.inactive")}
            </Tag>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} className="library-detail__content">
        <Col xs={24} md={12}>
          <Card className="info-card">
            <div className="info-section">
              <Title level={4} className="section-title">
                <FaBuilding /> {t("libraryDetail.libraryInfo")}
              </Title>
              <div className="info-item">
                <Text strong className="info-label">{t("libraryDetail.address")}:</Text>
                <Text className="info-value">{library?.address}</Text>
              </div>
              <div className="info-item">
                <Text strong className="info-label">{t("libraryDetail.phone")}:</Text>
                <Text className="info-value">{data?.results.phone}</Text>
              </div>
            </div>

            <div className="info-section">
              <Title level={4} className="section-title">
                <FaInfoCircle /> {t("libraryDetail.socialMedia")}
              </Title>
              {library?.social_media.telegram && (
                <div className="info-item">
                  <FaTelegram />
                  <a
                    href={library.social_media.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    {t("libraryDetail.telegram")}
                  </a>
                </div>
              )}
              {library?.social_media.instagram && (
                <div className="info-item">
                  <FaInstagram />
                  <a
                    href={library.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="map-card">
            <Title level={4} className="section-title">
              <FaMapMarkerAlt /> {t("libraryDetail.location")}
            </Title>
            <div className="library-detail__map">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={icon}>
                  <Popup>
                    <div className="map-popup">
                      <Title level={5}>{library?.name}</Title>
                      <Text>{library?.address}</Text>
                      <a
                        href={library?.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        {t("libraryDetail.viewOnGoogleMaps")}
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="library-detail__stats">
        <div className="stat-card">
          <FaBook />
          <div className="stat-info">
            <Text className="stat-value">{data?.results.total_books}</Text>
            <Text type="secondary" className="stat-label">{t("libraryDetail.totalBooks")}</Text>
          </div>
        </div>
      </div>

      <div className="library-detail__books">
        <Title level={3}>{t("libraryDetail.libraryBooks")}</Title>
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
