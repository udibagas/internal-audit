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
  SafetyOutlined,
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { AuditArea, CreateAuditArea, UpdateAuditArea, Department } from '@audit-system/shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface AuditAreaFormProps {
  open: boolean;
  onCancel: () => void;
  auditArea?: AuditArea;
  isEdit?: boolean;
}

const AuditAreaForm: React.FC<AuditAreaFormProps> = ({ open, onCancel, auditArea, isEdit = false }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments').then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAuditArea) => api.post('/audit-areas', data),
    onSuccess: () => {
      message.success('Audit area created successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create audit area');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAuditArea }) => api.patch(`/audit-areas/${id}`, data),
    onSuccess: () => {
      message.success('Audit area updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update audit area');
    },
  });

  const onSubmit = async (values: CreateAuditArea | UpdateAuditArea) => {
    if (isEdit && auditArea) {
      updateMutation.mutate({ id: auditArea.id, data: values });
    } else {
      createMutation.mutate(values as CreateAuditArea);
    }
  };

  React.useEffect(() => {
    if (isEdit && auditArea) {
      form.setFieldsValue({
        name: auditArea.name,
        description: auditArea.description,
        riskLevel: auditArea.riskLevel,
        departmentId: auditArea.departmentId,
      });
    } else {
      form.resetFields();
    }
  }, [auditArea, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit Audit Area' : 'Create New Audit Area'}
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
          rules={[{ required: true, message: 'Please input audit area name!' }]}
        >
          <Input placeholder="Audit area name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="riskLevel"
          label="Risk Level"
        >
          <Select placeholder="Select risk level">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
            <Option value="Critical">Critical</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="departmentId"
          label="Department"
        >
          <Select placeholder="Select department">
            {(departments as any[])?.map((dept: Department) => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AuditAreasList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuditArea, setEditingAuditArea] = useState<AuditArea | undefined>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: auditAreas, isPending } = useQuery({
    queryKey: ['audit-areas'],
    queryFn: () => api.get('/audit-areas').then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/audit-areas/${id}`),
    onSuccess: () => {
      message.success('Audit area deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete audit area');
    },
  });

  const handleEdit = (auditArea: AuditArea) => {
    setEditingAuditArea(auditArea);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAuditArea(undefined);
  };

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
      key: 'name',
      render: (_: any, record: AuditArea) => (
        <Space>
          <SafetyOutlined />
          <span>{record.name}</span>
        </Space>
      ),
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
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-areas'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: AuditArea) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'view',
            label: 'View Details',
            onClick: () => navigate(`/audit-areas/${record.id}`),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Audit Area',
                content: 'Are you sure you want to delete this audit area?',
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
          <SafetyOutlined /> Audit Area Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Audit Area
        </Button>
      </div>

      <Table
        size='small'
        columns={columns}
        dataSource={auditAreas || []}
        loading={isPending}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} audit areas`,
        }}
      />

      <AuditAreaForm
        open={modalOpen}
        onCancel={handleModalClose}
        auditArea={editingAuditArea}
        isEdit={!!editingAuditArea}
      />
    </div>
  );
};

export default AuditAreasList;
