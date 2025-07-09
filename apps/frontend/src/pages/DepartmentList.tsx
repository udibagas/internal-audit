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
  Popconfirm,
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Department, CreateDepartment, UpdateDepartment, User } from '@audit-system/shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

interface DepartmentFormProps {
  open: boolean;
  onCancel: () => void;
  department?: Department & { manager?: User; users?: User[] };
  isEdit?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ open, onCancel, department, isEdit = false }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDepartment) => api.post('/departments', data),
    onSuccess: () => {
      message.success('Department created successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create department');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDepartment }) => api.patch(`/departments/${id}`, data),
    onSuccess: () => {
      message.success('Department updated successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update department');
    },
  });

  const onSubmit = async (values: CreateDepartment | UpdateDepartment) => {
    if (isEdit && department) {
      updateMutation.mutate({ id: department.id, data: values });
    } else {
      createMutation.mutate(values as CreateDepartment);
    }
  };

  React.useEffect(() => {
    if (isEdit && department) {
      form.setFieldsValue({
        name: department.name,
        description: department.description,
        managerId: department.managerId,
      });
    } else {
      form.resetFields();
    }
  }, [department, isEdit, form]);

  return (
    <Modal
      title={isEdit ? 'Edit Department' : 'Create New Department'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Department Name"
          rules={[{ required: true, message: 'Please enter department name' }]}
        >
          <Input placeholder="Enter department name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea
            placeholder="Enter department description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="managerId"
          label="Department Manager"
        >
          <Select
            placeholder="Select department manager"
            allowClear
          >
            {(users as any[])?.map((user: User) => (
              <Option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DepartmentList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments').then(res => res.data)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      message.success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete department');
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (record: Department & { manager?: User }) => (
        record.manager ? (
          <span>{record.manager.name}</span>
        ) : (
          <Tag color="orange">No Manager</Tag>
        )
      ),
    },
    {
      title: 'Users Count',
      key: 'usersCount',
      render: (record: Department & { users?: User[] }) => (
        <Tag color="blue">{record.users?.length || 0} users</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Department) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDepartment(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this department?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{ margin: 0 }}>
            <TeamOutlined /> Departments
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Department
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={departments as any[]}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />

        <DepartmentForm
          open={isModalOpen}
          onCancel={handleModalClose}
          department={editingDepartment || undefined}
          isEdit={!!editingDepartment}
        />
      </Card>
    </div>
  );
};

export default DepartmentList;
