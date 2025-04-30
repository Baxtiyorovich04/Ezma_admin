import { useState, useRef } from "react";
import {
  useProfile,
  useUpdateProfile,
  ProfileUpdatePayload,
} from "../hooks/useProfile";
import {
  Card,
  Input,
  Avatar,
  Spin,
  Alert,
  Form,
  Divider,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import useAuthStore from "../store/isAuth";
import noImage from "../assets/images/no-image.png";

const Profile = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      form.resetFields();
      setImagePreview(null);
      setImageFile(null);
    } else {
      // Start editing
      form.setFieldsValue({
        name: profile?.name || "",
        phone: profile?.phone || "",
      });
      setIsEditing(true);
    }
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: { name: string; phone: string }) => {
    const payload: ProfileUpdatePayload = {
      name: values.name,
      phone: values.phone,
      image: imageFile,
    };

    try {
      await updateProfile.mutateAsync(payload);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <Spin size="large" />
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description="Profil ma'lumotlarini yuklashda muammo yuzaga keldi."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar" onClick={handleImageClick}>
              {isEditing && (
                <div className="avatar-overlay">
                  <CameraOutlined />
                </div>
              )}
              <Avatar
                size={120}
                src={imagePreview || profile?.image || noImage}
                icon={<UserOutlined />}
                className={isEditing ? "editable" : ""}
              />
              {isEditing && (
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="edit-button"
                >
                  <EditOutlined />
                  Tahrirlash
                </button>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogoutOutlined />
                  Chiqish
                </button>
              </>
            ) : (
              <div className="edit-actions">
                <button
                  onClick={() => form.submit()}
                  className="save-button"
                >
                  <SaveOutlined />
                  Saqlash
                </button>
                <button
                  onClick={handleEditToggle}
                  className="cancel-button"
                >
                  <CloseOutlined /> 
                  Bekor qilish
                </button>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {!isEditing ? (
          <div className="profile-info">
            <div className="info-item">
              <UserOutlined className="info-icon" />
              <div className="info-content">
                <span className="info-label">Ism</span>
                <span className="info-value">{profile?.name}</span>
              </div>
            </div>
            <div className="info-item">
              <PhoneOutlined className="info-icon" />
              <div className="info-content">
                <span className="info-label">Telefon</span>
                <span className="info-value">{profile?.phone}</span>
              </div>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="profile-form"
            initialValues={{
              name: profile?.name || "",
              phone: profile?.phone || "",
            }}
          >
            <Form.Item
              name="name"
              label="Ism"
              rules={[
                { required: true, message: "Iltimos, ismingizni kiriting" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ismingiz" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon raqam"
              rules={[
                {
                  required: true,
                  message: "Iltimos, telefon raqamingizni kiriting",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Telefon raqamingiz"
              />
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
