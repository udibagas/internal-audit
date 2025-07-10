import React from 'react';
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
  Dropdown,
  MenuProps
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { User, CreateUser, UpdateUser, Role, Department } from '@audit-system/shared';
import dayjs from 'dayjs';
import { useFetch } from '@/hooks/useFetch';
import { useCrud } from '@/hooks/useCrud';

const { Title } = Typography;
const { Option } = Select;

interface UserFormProps {
  open: boolean;
  onCancel: () => void;
  user?: User;
  isEdit?: boolean;
  roles?: any[];
  departments?: any[];
}

const UserForm: React.FC<UserFormProps> = ({ open, onCancel, user, isEdit = false, roles = [], departments = [] }) => {
  const [form] = Form.useForm();
  const { createMutation, updateMutation, } = useCrud<User, CreateUser, UpdateUser>('/users');

  const onSubmit = async (values: CreateUser | UpdateUser) => {
    if (isEdit && user) {
      updateMutation.mutate({ id: user.id, data: values });
    } else {
      createMutation.mutate(values as CreateUser);
    }

    onCancel();
    form.resetFields();
  };

  React.useEffect(() => {
    if (isEdit && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        departmentId: user.departmentId,
        isActive: user.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [user, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit User' : 'Create New User'}
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
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        )}

        <Form.Item
          name="roleId"
          label="Role"
        >
          <Select placeholder="Select role">
            {roles.map((role: any) => (
              <Option key={role.id} value={role.id}>{role.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="departmentId"
          label="Department"
        >
          <Select placeholder="Select department">
            {departments.map((dept: any) => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {isEdit && (
          <Form.Item
            name="isActive"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

const UserList: React.FC = () => {
  const {
    editingData,
    modalOpen,
    queryClient,
    useFetch: useFetchCrud,
    setModalOpen,
    handleEdit,
    handleDelete,
    handleModalClose,
  } = useCrud<User>('/users');

  const { data: users, isPending } = useFetchCrud('/users');
  const { data: roles } = useFetch<Role[]>('/roles');
  const { data: departments } = useFetch<Department[]>('/departments');

  const getRoleColor = (roleName?: string) => {
    if (!roleName) return 'default';

    const colors = {
      'Administrator': 'red',
      'Lead Auditor': 'blue',
      'Auditor': 'blue',
      'Auditee': 'green',
      'Viewer': 'orange',
    };
    return colors[roleName as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: User) => (
        <Space>
          <UserOutlined />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => (
        <Tag color={getRoleColor(role?.name)}>{role?.name || '-'}</Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: any) => department?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['/users'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: User) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'deactivate',
            label: 'Deactivate',
            icon: <DeleteOutlined />,
            danger: true,
            disabled: !record.isActive,
            onClick: () => {
              Modal.confirm({
                title: 'Deactivate User',
                content: 'Are you sure you want to deactivate this user?',
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
          <UserOutlined /> User Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      <Table
        size='middle'
        columns={columns}
        dataSource={users}
        loading={isPending}
        rowKey="id"
        onRow={(record) => ({
          onDoubleClick: () => handleEdit(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
      />

      <UserForm
        open={modalOpen}
        onCancel={handleModalClose}
        user={editingData}
        isEdit={!!editingData}
        roles={roles}
        departments={departments}
      />
    </div>
  );
};

export default UserList;
