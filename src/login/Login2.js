import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../host/requests/registerUser';
import { useStore } from '../store/store';
import { httpPostRequisets } from '../host/Requiests';
import './login.scss';

const { Title, Text } = Typography;

export default function AuthPage() {
  // Zustand store-dan setUser funksiyasini olamiz
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {setUser}=useStore();

  // Qurilma ID'sini olish
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  // Qurilma nomini aniqlash
  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows PC';
    if (/Mac/.test(ua)) return 'MacBook';
    return 'Web Browser';
  };

  // Login muvaffaqiyatli bo'lgandagi umumiy mantiq
  const handleAuthSuccess = (resData) => {
    const token = resData?.token;
    const userData = resData?.user;
   


    if (token) {
      // 1. Tokenni kuki-faylga saqlash
      Cookies.set('fitmirror_token', token, { expires: 1/2 });
      
      // 2. Zustand store-ga butun user obyektini yuborish
      if (userData) {
        setUser(userData.email, userData.fullName); // Email va fullName ni store ga saqlash
      }
      
      message.success(t('auth.welcome') || "Xush kelibsiz!");
      navigate('/');
    }
  };

  // Google orqali kirish
  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    setLoading(true);
    try {
      const payload = {
        token: credentialResponse.credential,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
      };

      const res = await httpPostRequisets('/users/google', payload);
      const resData = res.data?.data || res.data;
      handleAuthSuccess(resData);
    } catch (err) {
      console.error("Google Login Error:", err);
      message.error(err.response?.data?.message || t('auth.google_error'));
    } finally {
      setLoading(false);
    }
  };

  // Email va parol orqali kirish
  const onFinish = async (values) => {
  
    setLoading(true);
    try {
      const payload = {
        ...values,
        deviceId: getDeviceId(),
        
      };
      
      const res = await loginUser(payload);
      const resData = res.data?.data || res.data;
      handleAuthSuccess(resData);
    } catch (err) {
      message.error(err.response?.data?.message || t('auth.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_box">
      {/* Chap panel */}
      <div className="login_box_top">
        <div className="logo-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </div>
        <div className="brand-name">FitMirror</div>
        <Text className="sidebar-subtitle">
          {t('auth.sidebar_subtitle')}
        </Text>
      </div>

      {/* O'ng panel */}
      <div className="login_box_bottom">
        <div className="login-card">
          <div style={{ textAlign: 'center' }}>
            <Title level={2} className="welcome-title">
              {t('auth.login_tab') || 'Xush kelibsiz'}
            </Title>
            <Text className="subtitle-text">
              {t('auth.login_subtitle')}
            </Text>
          </div>

          <div className="google-btn-container">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => message.error(t('auth.google_service_error'))}
              theme="filled_blue"
              shape="pill"
              size="large"
              text="continue_with"
              width="100%"
            />
          </div>

          <Divider plain>{t('auth.or') || 'yoki email orqali'}</Divider>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item 
              name="email" 
              rules={[{ required: true, type: 'email', message: t('auth.email_required') }]}
              style={{ marginBottom: 18 }}
            >
              <Input prefix={<MailOutlined />} placeholder={t('auth.email_placeholder')} />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[{ required: true, message: t('auth.password_required') }]}
              style={{ marginBottom: 10 }}
            >
              <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password_placeholder')} />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Text 
                className="forgot-password-link"
                onClick={() => message.info(t('auth.coming_soon'))}
              >
                {t('auth.forgot_password') || 'Parolni unutdingizmi?'}
              </Text>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="submit-btn"
              >
                {t('auth.login_button') || 'Platformaga kirish'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}