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
  Dropdown,
  MenuProps
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  AuditOutlined,
  MoreOutlined,
  ReloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  Audit,
  CreateAudit,
  UpdateAudit,
  AUDIT_STATUSES,
  User,
  AuditArea,
  AuditStandard
} from '@audit-system/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { useFetch } from '@/hooks/useFetch';

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

  const { data: users } = useFetch<User[]>('/users')
  const { data: areas } = useFetch<AuditArea[]>('/audit-areas')
  const { data: standards } = useFetch<AuditStandard[]>('/audit-standards')

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
      width={450}
      title={isEdit ? 'Edit Audit' : 'Create New Audit'}
      open={open}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      onOk={() => form.submit()}
      okText={isEdit ? 'Update' : 'Create'}
      okButtonProps={{
        variant: 'solid',
        color: 'default',
        loading: createMutation.isPending || updateMutation.isPending
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        labelAlign='left'
        onFinish={onSubmit}
        style={{ paddingTop: '20px' }}
        requiredMark={false}
        colon={false}
        variant='filled'
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input audit name!' }]}
        >
          <Input placeholder="Enter audit name" />
        </Form.Item>

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

        <Form.Item
          name="standardId"
          label="Standard"
        >
          <Select placeholder="Select audit standard">
            {(standards || []).map((standard: any) => (
              <Option key={standard.id} value={standard.id}>{standard.name}</Option>
            ))}
          </Select>
        </Form.Item>

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

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select end date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

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
      </Form>
    </Modal>
  );
};

const AuditList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | undefined>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: audits, isPending } = useFetch<Audit[]>('/audits');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/audits/${id}`),
    onSuccess: () => {
      message.success('Audit deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete audit');
    },
  });

  const handleEdit = (audit: Audit) => {
    setEditingAudit(audit);
    setModalOpen(true);
  };

  const handleView = (audit: Audit) => {
    navigate(`/audits/${audit.id}`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
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
      key: 'name',
      render: (_: any, record: Audit) => (
        <Space>
          <AuditOutlined />
          <span>{record.name}</span>
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
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audits'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: Audit) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Audit',
                content: 'Are you sure you want to delete this audit?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => handleDelete(record.id),
              });
            },
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
        <Title level={3} style={{ margin: 0 }}>
          <AuditOutlined /> Audit Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Create Audit
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={audits as Audit[]}
        loading={isPending}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} audits`,
        }}
      />

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
