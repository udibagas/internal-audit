import React, { useState } from 'react';
import { Input, Button, Card, Typography, Alert, Form, Space } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Login } from '@audit-system/shared';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSubmit = async (values: Login) => {
    setLoading(true);
    setError('');

    try {
      await login(values);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          border: 'none'
        }}
        styles={{
          body: {
            padding: '40px',
          }
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}>
              <SafetyOutlined style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626' }}>
              Audit System
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Secure • Reliable • Professional
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(255, 77, 79, 0.15)'
              }}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={onSubmit}
            layout="vertical"
            size="large"
            style={{ marginTop: '10px' }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!', type: 'email' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Email address"
                style={{
                  borderRadius: '8px',
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Password"
                style={{
                  borderRadius: '8px',
                  padding: '12px 16px',
                  border: '1px solid #d9d9d9',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '30px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              © 2025 Audit System. All rights reserved.
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;
