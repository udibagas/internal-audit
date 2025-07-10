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
  TeamOutlined,
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Department, CreateDepartment, UpdateDepartment, User } from '@audit-system/shared';
import dayjs from 'dayjs';
import { useFetch } from '@/hooks/useFetch';
import { useCrud } from '@/hooks/useCrud';

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
  const { createMutation, updateMutation, } = useCrud<Department, CreateDepartment, UpdateDepartment>('/departments');
  const { data: users } = useFetch<User[]>('/users');

  const onSubmit = async (values: CreateDepartment | UpdateDepartment) => {
    if (isEdit && department) {
      updateMutation.mutate({ id: department.id, data: values });
    } else {
      createMutation.mutate(values as CreateDepartment);
    }

    onCancel();
    form.resetFields();
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
      width={450}
      title={isEdit ? 'Edit Department' : 'Create New Department'}
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
          label="Manager"
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
      </Form>
    </Modal>
  );
};

const DepartmentList: React.FC = () => {
  const {
    editingData: editingDepartment,
    modalOpen,
    queryClient,
    useFetch: useFetchCrud,
    setModalOpen,
    handleEdit,
    handleDelete,
    handleModalClose,
  } = useCrud<Department>('/departments');

  const { data: departments, isPending } = useFetchCrud();

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: Department) => (
        <Space>
          <TeamOutlined />
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
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['departments'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: Department) => {
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
                title: 'Delete Department',
                content: 'Are you sure you want to delete this department?',
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
          <TeamOutlined /> Department Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Department
        </Button>
      </div>

      <Table
        size='middle'
        columns={columns}
        dataSource={departments as any[]}
        loading={isPending}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} departments`,
        }}
      />

      <DepartmentForm
        open={modalOpen}
        onCancel={handleModalClose}
        department={editingDepartment}
        isEdit={!!editingDepartment}
      />
    </div>
  );
};

export default DepartmentList;
