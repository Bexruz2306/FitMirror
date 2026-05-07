import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

export default function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const token=Cookies.get('fitmirror_token');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Here you would send the feedback to your backend
      console.log('Feedback submitted:', values);
      
      // Placeholder: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      message.success(t('feedback.success'));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error sending feedback:', error);
      message.error(t('feedback.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t('feedback.title')}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {!token?  <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: t('auth.email_required'),
            },
          ]}
        >
          <Input
            placeholder={t('feedback.email_placeholder')}
            type="email"
          />
        </Form.Item>:<></>}
      

        <Form.Item
          name="feedback"
          rules={[
            {                
              required: true,
              message: t('feedback.placeholder'),
            },
          ]}
        >
          <Input.TextArea
            placeholder={t('feedback.placeholder')}
            rows={4}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Button
              block
              onClick={onClose}
              disabled={loading}
            >
              {t('feedback.cancel')}
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              style={{ background: '#1D9E75', borderColor: '#1D9E75' }}
            >
              {t('feedback.submit')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
