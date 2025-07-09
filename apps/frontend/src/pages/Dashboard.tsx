import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { AuditOutlined, UserOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Audits"
              value={12}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Audits"
              value={5}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={28}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Open Findings"
              value={8}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Audits" extra={<a href="/audits">View All</a>}>
            <div>No recent audits data available</div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Findings" extra={<a href="/findings">View All</a>}>
            <div>No recent findings data available</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
