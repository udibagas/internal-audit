import React from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
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
import { Role, CreateRole, UpdateRole, User } from '@audit-system/shared';
import dayjs from 'dayjs';
import { useCrud } from '@/hooks/useCrud';

const { Title } = Typography;

interface RoleFormProps {
  open: boolean;
  onCancel: () => void;
  role?: Role & { users?: User[] };
  isEdit?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({ open, onCancel, role, isEdit = false }) => {
  const [form] = Form.useForm();
  const { createMutation, updateMutation, } = useCrud<User, CreateRole, UpdateRole>('/roles');

  const onSubmit = async (values: CreateRole | UpdateRole) => {
    if (isEdit && role) {
      updateMutation.mutate({ id: role.id, data: values });
    } else {
      createMutation.mutate(values as CreateRole);
    }

    onCancel();
    form.resetFields();
  };

  React.useEffect(() => {
    if (isEdit && role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
    } else {
      form.resetFields();
    }
  }, [role, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit Role' : 'Create New Role'}
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
          label="Role Name"
          rules={[{ required: true, message: 'Please enter role name' }]}
        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea
            placeholder="Enter role description"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const RoleList: React.FC = () => {
  const {
    editingData: editingRole,
    modalOpen,
    queryClient,
    useFetch: useFetchCrud,
    setModalOpen,
    handleEdit,
    handleDelete,
    handleModalClose,
  } = useCrud<Role>('/roles');

  const { data: roles, isPending } = useFetchCrud();

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: Role) => (
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
      render: (text: string) => text || '-',
    },
    {
      title: 'Users Count',
      key: 'usersCount',
      render: (record: Role & { users?: User[] }) => (
        <Tag color="blue">{record.users?.length || 0} users</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['roles'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: Role) => {
        const menuItems: MenuProps['items'] = [
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
                title: 'Delete Role',
                content: 'Are you sure you want to delete this role?',
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
          <SafetyOutlined /> Role Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Role
        </Button>
      </div>

      <Table
        size='middle'
        columns={columns}
        dataSource={roles}
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
            `${range[0]}-${range[1]} of ${total} roles`,
        }}
      />

      <RoleForm
        open={modalOpen}
        onCancel={handleModalClose}
        role={editingRole}
        isEdit={!!editingRole}
      />
    </div>
  );
};

export default RoleList;
