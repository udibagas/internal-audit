import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
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
  TeamOutlined,
  MoreOutlined,
  ReloadOutlined,
  UserOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { AuditTeam, CreateAuditTeam, UpdateAuditTeam, User, Audit } from '@audit-system/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFetch } from '@/hooks/useFetch';
import { create, deleteById, updateById } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

interface AuditTeamFormProps {
  open: boolean;
  onCancel: () => void;
  auditTeam?: AuditTeam;
  isEdit?: boolean;
  users?: User[];
  audits?: Audit[];
}

const AuditTeamForm: React.FC<AuditTeamFormProps> = ({ open, onCancel, auditTeam, isEdit = false, users = [], audits = [] }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateAuditTeam) => create('/audit-teams', data),
    onSuccess: () => {
      message.success('Team member added successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-teams'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to add team member');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAuditTeam }) => updateById('/audit-teams', id, data),
    onSuccess: () => {
      message.success('Team member updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-teams'] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update team member');
    },
  });

  const onSubmit = async (values: CreateAuditTeam | UpdateAuditTeam) => {
    if (isEdit && auditTeam) {
      updateMutation.mutate({ id: auditTeam.id, data: values });
    } else {
      createMutation.mutate(values as CreateAuditTeam);
    }
  };

  React.useEffect(() => {
    if (isEdit && auditTeam) {
      form.setFieldsValue({
        auditId: auditTeam.auditId,
        userId: auditTeam.userId,
        role: auditTeam.role,
      });
    } else {
      form.resetFields();
    }
  }, [auditTeam, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit Team Member' : 'Add Team Member'}
      open={open}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      onOk={() => form.submit()}
      okText={isEdit ? 'Update' : 'Add'}
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
          name="auditId"
          label="Audit"
          rules={[{ required: true, message: 'Please select an audit' }]}
        >
          <Select
            placeholder="Select audit"
            showSearch
            optionFilterProp="label"
            disabled={isEdit}
          >
            {audits.map((audit) => (
              <Option key={audit.id} value={audit.id} label={audit.name}>
                {audit.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="userId"
          label="User"
          rules={[{ required: true, message: 'Please select a user' }]}
        >
          <Select
            placeholder="Select user"
            showSearch
            optionFilterProp="label"
            disabled={isEdit}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id} label={user.name}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select role">
            <Option value="Lead Auditor">Lead Auditor</Option>
            <Option value="Auditor">Auditor</Option>
            <Option value="Observer">Observer</Option>
            <Option value="Technical Expert">Technical Expert</Option>
            <Option value="Member">Member</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AuditTeamsList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuditTeam, setEditingAuditTeam] = useState<AuditTeam | undefined>();
  const queryClient = useQueryClient();

  const { data: auditTeams, isPending } = useFetch<AuditTeam[]>('/audit-teams');
  const { data: users } = useFetch<User[]>('/users');
  const { data: audits } = useFetch<Audit[]>('/audits');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteById('/audit-teams', id),
    onSuccess: () => {
      message.success('Team member removed successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-teams'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to remove team member');
    },
  });

  const handleEdit = (auditTeam: AuditTeam) => {
    setEditingAuditTeam(auditTeam);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAuditTeam(undefined);
  };

  const getRoleColor = (roleName?: string) => {
    if (!roleName) return 'default';

    const colors = {
      'Lead Auditor': 'red',
      'Auditor': 'blue',
      'Observer': 'green',
      'Technical Expert': 'purple',
      'Member': 'default',
    };
    return colors[roleName as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Audit',
      dataIndex: 'auditId',
      key: 'audit',
      render: (auditId: number) => {
        const audit = audits?.find((a: any) => a.id === auditId);
        return (
          <Space>
            <AuditOutlined />
            <span>{audit?.name || `Audit #${auditId}`}</span>
          </Space>
        );
      },
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (userId: number) => {
        const user = users?.find((u: any) => u.id === userId);
        return (
          <Space>
            <UserOutlined />
            <div>
              <div>{user?.name || `User #${userId}`}</div>
              {user?.email && <div className="text-gray-500 text-sm">{user.email}</div>}
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: 'Assigned',
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-teams'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: AuditTeam) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'remove',
            label: 'Remove',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Remove Team Member',
                content: 'Are you sure you want to remove this team member?',
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
          <TeamOutlined /> Audit Teams
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Team Member
        </Button>
      </div>

      <Table
        size='middle'
        columns={columns}
        dataSource={auditTeams}
        loading={isPending}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} team members`,
        }}
      />

      <AuditTeamForm
        open={modalOpen}
        onCancel={handleModalClose}
        auditTeam={editingAuditTeam}
        isEdit={!!editingAuditTeam}
        users={users}
        audits={audits}
      />
    </div>
  );
};

export default AuditTeamsList;
