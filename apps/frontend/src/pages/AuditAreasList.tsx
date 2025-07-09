import React from 'react';
import { Table, Button, Popconfirm, message, Card, Typography, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, deleteItem } from '@/lib/api';
import { AuditArea } from '@audit-system/shared';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AuditAreasList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['audit-areas'],
    queryFn: () => getItems<AuditArea[]>('/audit-areas'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteItem('/audit-areas', id),
    onSuccess: () => {
      message.success('Audit area deleted');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'Low': 'green',
      'Medium': 'orange',
      'High': 'red',
      'Critical': 'purple',
    };
    return colors[riskLevel as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <strong>{name}</strong>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || '-'
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (riskLevel: string) => riskLevel ? (
        <Tag color={getRiskColor(riskLevel)}>{riskLevel}</Tag>
      ) : '-'
    },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      render: (_: any, record: AuditArea) => (record as any).department?.name || '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AuditArea) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/audit-areas/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this audit area?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Audit Areas</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/audit-areas/new')}
        >
          Add Audit Area
        </Button>
      </div>

      <Card>
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data || []}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} audit areas`,
          }}
        />
      </Card>
    </div>
  );
};

export default AuditAreasList;
