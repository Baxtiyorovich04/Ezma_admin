import { Form, Input, Button, Switch, message } from 'antd';
import { useAddLib } from '../hooks/useAddLib';
import '../scss/pages/_addLibrary.scss';

const AddLibrary = () => {
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
      message.success('Library added successfully');
    } catch (err) {
      message.error('Failed to add library');
    }
  };

  return (
    <div className="add-library">
      <h1 className="add-library__title">Add New Library</h1>
      
      {error && <div className="add-library__error">{error}</div>}

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="add-library__form"
      >
        <div className="add-library__section">
          <h2 className="add-library__section-title">User Information</h2>
          <div className="add-library__grid">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input library name!' }]}
            >
              <Input placeholder="Enter library name" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please input phone number!' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </div>
        </div>

        <div className="add-library__section">
          <h2 className="add-library__section-title">Library Information</h2>
          <div className="add-library__grid">
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please input address!' }]}
            >
              <Input placeholder="Enter library address" />
            </Form.Item>

            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: 'Please input latitude!' }]}
            >
              <Input placeholder="Enter latitude" />
            </Form.Item>

            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true, message: 'Please input longitude!' }]}
            >
              <Input placeholder="Enter longitude" />
            </Form.Item>
          </div>
        </div>

        <div className="add-library__section">
          <h2 className="add-library__section-title">Social Media</h2>
          <div className="add-library__grid">
            <Form.Item name="telegram" label="Telegram">
              <Input placeholder="Enter Telegram link" />
            </Form.Item>

            <Form.Item name="instagram" label="Instagram">
              <Input placeholder="Enter Instagram link" />
            </Form.Item>

            <Form.Item name="facebook" label="Facebook">
              <Input placeholder="Enter Facebook link" />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="can_rent_books"
          label="Allow Book Rental"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <div className="add-library__actions">
          <Button onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Add Library
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddLibrary;