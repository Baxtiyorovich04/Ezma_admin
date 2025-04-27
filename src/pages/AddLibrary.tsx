import { Form, Input, Button, Switch, message } from 'antd';
import { useAddLib } from '../hooks/useAddLib';
import '../scss/pages/_addLibrary.scss';
import { useTranslation } from 'react-i18next';

const AddLibrary = () => {
  const { t } = useTranslation();
  const { addLibrary, loading, error } = useAddLib();
  const [form] = Form.useForm();

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
        latitude: values.latitude,
        longitude: values.longitude,
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
              <Input placeholder={t('addLibrary.addressPlaceholder')} />
            </Form.Item>

            <Form.Item
              name="latitude"
              label={t('addLibrary.latitude')}
              rules={[{ required: true, message: t('addLibrary.latitudeRequired') }]}
            >
              <Input placeholder={t('addLibrary.latitudePlaceholder')} />
            </Form.Item>

            <Form.Item
              name="longitude"
              label={t('addLibrary.longitude')}
              rules={[{ required: true, message: t('addLibrary.longitudeRequired') }]}
            >
              <Input placeholder={t('addLibrary.longitudePlaceholder')} />
            </Form.Item>
          </div>
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