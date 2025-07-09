import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  message,
  Card,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  AuditOutlined
} from '@ant-design/icons';
import {
  Audit,
  CreateAudit,
  UpdateAudit,
  AUDIT_STATUSES
} from '@audit-system/shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

interface AuditFormProps {
  open: boolean;
  onCancel: () => void;
  audit?: Audit;
  isEdit?: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({ open, onCancel, audit, isEdit = false }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  const { data: areas } = useQuery({
    queryKey: ['audit-areas'],
    queryFn: () => api.get('/audit-areas').then(res => res.data),
  });

  const { data: standards } = useQuery({
    queryKey: ['audit-standards'],
    queryFn: () => api.get('/audit-standards').then(res => res.data),
    enabled: open
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAudit) => api.post('/audits', data),
    onSuccess: () => {
      message.success('Audit created successfully');
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create audit');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAudit }) => api.patch(`/audits/${id}`, data),
    onSuccess: () => {
      message.success('Audit updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update audit');
    },
  });

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate?.toDate(),
      endDate: values.endDate?.toDate(),
    };

    if (isEdit && audit) {
      updateMutation.mutate({ id: audit.id, data: payload });
    } else {
      createMutation.mutate(payload as CreateAudit);
    }
  };

  React.useEffect(() => {
    if (isEdit && audit) {
      form.setFieldsValue({
        name: audit.name,
        areaId: audit.areaId,
        standardId: audit.standardId,
        status: audit.status,
        startDate: audit.startDate ? dayjs(audit.startDate) : null,
        endDate: audit.endDate ? dayjs(audit.endDate) : null,
        leadAuditorId: audit.leadAuditorId,
      });
    } else {
      form.resetFields();
    }
  }, [audit, isEdit, form]);

  const activeUsers = (users as any[])?.filter((user: any) => user.isActive) || [];
  const auditors = activeUsers.filter((user: any) => {
    const role = user.role;
    return role && ['Administrator', 'Lead Auditor', 'Auditor'].includes(role.name);
  });

  return (
    <Modal
      title={isEdit ? 'Edit Audit' : 'Create New Audit'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        size="large"
      >
        <Form.Item
          name="name"
          label="Audit Name"
          rules={[{ required: true, message: 'Please input audit name!' }]}
        >
          <Input placeholder="Enter audit name" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="areaId"
              label="Audit Area"
              rules={[{ required: true, message: 'Please select audit area!' }]}
            >
              <Select placeholder="Select audit area">
                {(areas || []).map((area: any) => (
                  <Option key={area.id} value={area.id}>{area.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="standardId"
              label="Audit Standard"
            >
              <Select placeholder="Select audit standard">
                {(standards || []).map((standard: any) => (
                  <Option key={standard.id} value={standard.id}>{standard.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {isEdit && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              {AUDIT_STATUSES.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leadAuditorId"
              label="Lead Auditor"
              rules={[{ required: true, message: 'Please select lead auditor!' }]}
            >
              <Select placeholder="Select lead auditor">
                {auditors.map((user: any) => (
                  <Option key={user.id} value={user.id}>
                    {user.name} ({user.role?.name || 'No Role'})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AuditList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | undefined>();
  const navigate = useNavigate();

  const { data: audits, isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: () => api.get('/audits').then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const handleEdit = (audit: Audit) => {
    setEditingAudit(audit);
    setModalOpen(true);
  };

  const handleView = (audit: Audit) => {
    navigate(`/audits/${audit.id}`);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAudit(undefined);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Not Started': 'default',
      'Planning': 'blue',
      'Fieldwork': 'processing',
      'Reporting': 'warning',
      'Completed': 'success',
      'Cancelled': 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <AuditOutlined />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      render: (area: any) => area?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Lead Auditor',
      dataIndex: 'leadAuditor',
      key: 'leadAuditor',
      render: (leadAuditor: any) => leadAuditor?.name || '-',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Audit) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Audit Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Create Audit
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={audits as Audit[]}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} audits`,
          }}
        />
      </Card>

      <AuditForm
        open={modalOpen}
        onCancel={handleModalClose}
        audit={editingAudit}
        isEdit={!!editingAudit}
      />
    </div>
  );
};

export default AuditList;
