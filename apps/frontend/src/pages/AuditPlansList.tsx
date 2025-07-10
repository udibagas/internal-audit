import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Dropdown,
  MenuProps
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  MoreOutlined,
  ReloadOutlined,
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { AuditPlan, CreateAuditPlan, UpdateAuditPlan, User } from '@audit-system/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { useFetch } from '@/hooks/useFetch';
import { create, deleteById, updateById } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

interface AuditPlanFormProps {
  open: boolean;
  onCancel: () => void;
  auditPlan?: AuditPlan;
  isEdit?: boolean;
  users?: User[];
}

const AuditPlanForm: React.FC<AuditPlanFormProps> = ({ open, onCancel, auditPlan, isEdit = false, users = [] }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateAuditPlan) => create('/audit-plans', data),
    onSuccess: () => {
      message.success('Audit plan created successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plans'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create audit plan');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAuditPlan }) => updateById('/update-plans', id, data),
    onSuccess: () => {
      message.success('Audit plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plans'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update audit plan');
    },
  });

  const onSubmit = async (values: CreateAuditPlan | UpdateAuditPlan) => {
    if (isEdit && auditPlan) {
      updateMutation.mutate({ id: auditPlan.id, data: values });
    } else {
      createMutation.mutate(values as CreateAuditPlan);
    }
  };

  React.useEffect(() => {
    if (isEdit && auditPlan) {
      form.setFieldsValue({
        name: auditPlan.name,
        fiscalYear: auditPlan.fiscalYear,
        description: auditPlan.description,
        status: auditPlan.status,
        createdById: auditPlan.createdById,
      });
    } else {
      form.resetFields();
    }
  }, [auditPlan, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit Audit Plan' : 'Create New Audit Plan'}
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
          label="Plan Name"
          rules={[{ required: true, message: 'Please input plan name!' }]}
        >
          <Input placeholder="Audit Plan Name" />
        </Form.Item>

        <Form.Item
          name="fiscalYear"
          label="Fiscal Year"
          rules={[{ required: true, message: 'Please input fiscal year!' }]}
        >
          <Input placeholder="e.g., 2024" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea placeholder="Plan description" rows={3} />
        </Form.Item>

        {isEdit && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="Draft">Draft</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Archived">Archived</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="createdById"
          label="Created By"
          rules={[{ required: true, message: 'Please select creator!' }]}
        >
          <Select placeholder="Select user" showSearch optionFilterProp="label">
            {users.map((user) => (
              <Option key={user.id} value={user.id} label={user.name}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AuditPlansList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuditPlan, setEditingAuditPlan] = useState<AuditPlan | undefined>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: auditPlans, isPending } = useFetch<AuditPlan[]>('/audit-plans');
  const { data: users } = useFetch<User[]>('/users')

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteById('/audit-plans', id),
    onSuccess: () => {
      message.success('Audit plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plans'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete audit plan');
    },
  });

  const handleEdit = (auditPlan: AuditPlan) => {
    setEditingAuditPlan(auditPlan);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAuditPlan(undefined);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';

    const colors = {
      'Draft': 'default',
      'Approved': 'blue',
      'Active': 'green',
      'Completed': 'purple',
      'Archived': 'orange',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Plan Name',
      key: 'name',
      render: (_: any, record: AuditPlan) => (
        <Space>
          <FileTextOutlined />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Fiscal Year',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
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
      title: 'Created By',
      dataIndex: 'createdById',
      key: 'createdBy',
      render: (createdById: number) => {
        const user = users?.find((u: any) => u.id === createdById);
        return (
          <Space>
            <UserOutlined />
            <span>{user?.name || `User #${createdById}`}</span>
          </Space>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-plans'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: AuditPlan) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => navigate(`/audit-plans/${record.id}`),
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
                title: 'Delete Audit Plan',
                content: 'Are you sure you want to delete this audit plan?',
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
          <FileTextOutlined /> Audit Plans
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Audit Plan
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={auditPlans}
        loading={isPending}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} audit plans`,
        }}
      />

      <AuditPlanForm
        open={modalOpen}
        onCancel={handleModalClose}
        auditPlan={editingAuditPlan}
        isEdit={!!editingAuditPlan}
        users={users}
      />
    </div>
  );
};

export default AuditPlansList;
