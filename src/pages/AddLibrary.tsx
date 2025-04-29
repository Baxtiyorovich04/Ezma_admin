import { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Switch, message, Card, Typography, AutoComplete } from 'antd';
import { useAddLib } from '../hooks/useAddLib';
import '../scss/pages/_addLibrary.scss';
import { useTranslation } from 'react-i18next';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title } = Typography;

// Tashkent coordinates
const TASHKENT_COORDINATES: LatLngTuple = [41.2995, 69.2401];

const AddLibrary = () => {
  const { t } = useTranslation();
  const { addLibrary, loading, error } = useAddLib();
  const [form] = Form.useForm();
  const [position, setPosition] = useState<LatLngTuple>(TASHKENT_COORDINATES);
  const [addressOptions, setAddressOptions] = useState<{ value: string; label: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(TASHKENT_COORDINATES, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add marker
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      markerRef.current = L.marker(TASHKENT_COORDINATES, {
        icon: icon,
        draggable: true
      }).addTo(mapRef.current);

      // Handle marker drag
      markerRef.current.on('dragend', () => {
        const coords = markerRef.current!.getLatLng();
        const newPosition: LatLngTuple = [coords.lat, coords.lng];
        setPosition(newPosition);
        form.setFieldsValue({
          latitude: coords.lat.toString(),
          longitude: coords.lng.toString(),
        });
        updateAddress(newPosition);
      });

      // Handle map click
      mapRef.current.on('click', (e) => {
        const coords = e.latlng;
        const newPosition: LatLngTuple = [coords.lat, coords.lng];
        markerRef.current!.setLatLng(coords);
        setPosition(newPosition);
        form.setFieldsValue({
          latitude: coords.lat.toString(),
          longitude: coords.lng.toString(),
        });
        updateAddress(newPosition);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateAddress = async (coords: LatLngTuple) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        form.setFieldsValue({
          address: data.display_name,
        });
      }
    } catch (error) {
      message.error(t('addLibrary.addressError'));
    }
  };

  const searchAddress = async (query: string) => {
    if (!query) {
      setAddressOptions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=uz&limit=5`
      );
      const data = await response.json();
      const options = data.map((item: any) => ({
        value: item.display_name,
        label: item.display_name,
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)] as LatLngTuple,
      }));
      setAddressOptions(options);
    } catch (error) {
      message.error(t('addLibrary.searchError'));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddressSelect = (value: string, option: any) => {
    if (mapRef.current && markerRef.current) {
      const newPosition = option.coordinates as LatLngTuple;
      setPosition(newPosition);
      mapRef.current.setView(newPosition, 13);
      markerRef.current.setLatLng(newPosition);
      
      form.setFieldsValue({
        address: value,
        latitude: newPosition[0].toString(),
        longitude: newPosition[1].toString(),
      });
    }
  };

  const onFinish = async (values: any) => {
    const libraryData = {
      user: {
        password: values.password,
        name: values.name,
        phone: values.phone,
      },
      library: {
        address: values.address,
        social_media: {
          telegram: values.telegram || '',
          instagram: values.instagram || '',
          facebook: values.facebook || '',
        },
        can_rent_books: values.can_rent_books,
        latitude: position[0].toString(),
        longitude: position[1].toString(),
      },
    };

    try {
      await addLibrary(libraryData);
      message.success(t('addLibrary.success'));
    } catch (err) {
      message.error(t('addLibrary.error'));
    }
  };

  return (
    <div className="add-library">
      <h1 className="add-library__title">{t('addLibrary.title')}</h1>
      
      {error && <div className="add-library__error">{error}</div>}

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="add-library__form"
      >
        <div className="add-library__section">
          <h2 className="add-library__section-title">{t('addLibrary.userInfo')}</h2>
          <div className="add-library__grid">
            <Form.Item
              name="name"
              label={t('addLibrary.name')}
              rules={[{ required: true, message: t('addLibrary.nameRequired') }]}
            >
              <Input placeholder={t('addLibrary.namePlaceholder')} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={t('addLibrary.phone')}
              rules={[{ required: true, message: t('addLibrary.phoneRequired') }]}
            >
              <Input placeholder={t('addLibrary.phonePlaceholder')} />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('addLibrary.password')}
              rules={[{ required: true, message: t('addLibrary.passwordRequired') }]}
            >
              <Input.Password placeholder={t('addLibrary.passwordPlaceholder')} />
            </Form.Item>
          </div>
        </div>

        <div className="add-library__section">
          <h2 className="add-library__section-title">{t('addLibrary.libraryInfo')}</h2>
          <div className="add-library__grid">
            <Form.Item
              name="address"
              label={t('addLibrary.address')}
              rules={[{ required: true, message: t('addLibrary.addressRequired') }]}
            >
              <AutoComplete
                options={addressOptions}
                onSearch={searchAddress}
                onSelect={handleAddressSelect}
                placeholder={t('addLibrary.addressPlaceholder')}
                notFoundContent={searchLoading ? t('addLibrary.searching') : t('addLibrary.noResults')}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="latitude"
              label={t('addLibrary.latitude')}
              rules={[{ required: true, message: t('addLibrary.latitudeRequired') }]}
            >
              <Input placeholder={t('addLibrary.latitudePlaceholder')} readOnly />
            </Form.Item>

            <Form.Item
              name="longitude"
              label={t('addLibrary.longitude')}
              rules={[{ required: true, message: t('addLibrary.longitudeRequired') }]}
            >
              <Input placeholder={t('addLibrary.longitudePlaceholder')} readOnly />
            </Form.Item>
          </div>

          <Card className="map-card">
            <Title level={4} className="section-title">
              {t('addLibrary.location')}
            </Title>
            <div id="map" className="add-library__map"></div>
          </Card>
        </div>

        <div className="add-library__section">
          <h2 className="add-library__section-title">{t('addLibrary.socialMedia')}</h2>
          <div className="add-library__grid">
            <Form.Item name="telegram" label={t('addLibrary.telegram')}>
              <Input placeholder={t('addLibrary.telegramPlaceholder')} />
            </Form.Item>

            <Form.Item name="instagram" label={t('addLibrary.instagram')}>
              <Input placeholder={t('addLibrary.instagramPlaceholder')} />
            </Form.Item>

            <Form.Item name="facebook" label={t('addLibrary.facebook')}>
              <Input placeholder={t('addLibrary.facebookPlaceholder')} />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="can_rent_books"
          label={t('addLibrary.allowRental')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <div className="add-library__actions">
          <Button onClick={() => form.resetFields()}>
            {t('addLibrary.reset')}
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            {t('addLibrary.submit')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddLibrary;