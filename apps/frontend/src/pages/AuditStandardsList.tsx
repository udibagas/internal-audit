import React from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Space,
  Tag,
  Dropdown,
  MenuProps
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { AuditStandard, CreateAuditStandard, UpdateAuditStandard } from '@audit-system/shared';
import dayjs from 'dayjs';
import { useCrud } from '@/hooks/useCrud';

const { Title } = Typography;

interface AuditStandardFormProps {
  open: boolean;
  onCancel: () => void;
  auditStandard?: AuditStandard;
  isEdit?: boolean;
}

const AuditStandardForm: React.FC<AuditStandardFormProps> = ({ open, onCancel, auditStandard, isEdit = false }) => {
  const [form] = Form.useForm();
  const { createMutation, updateMutation, } = useCrud<AuditStandard, CreateAuditStandard, UpdateAuditStandard>('/departments');

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      effectiveDate: values.effectiveDate?.toDate(),
    };

    if (isEdit && auditStandard) {
      updateMutation.mutate({ id: auditStandard.id, data: payload });
    } else {
      createMutation.mutate(payload as CreateAuditStandard);
    }

    onCancel();
    form.resetFields();
  };

  React.useEffect(() => {
    if (isEdit && auditStandard) {
      form.setFieldsValue({
        name: auditStandard.name,
        description: auditStandard.description,
        version: auditStandard.version,
        effectiveDate: auditStandard.effectiveDate ? dayjs(auditStandard.effectiveDate) : null,
        isActive: auditStandard.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [auditStandard, isEdit, form]);

  return (
    <Modal
      width={450}
      title={isEdit ? 'Edit Audit Standard' : 'Create New Audit Standard'}
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
          rules={[{ required: true, message: 'Please input standard name!' }]}
        >
          <Input placeholder="Audit standard name" />
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
          name="version"
          label="Version"
        >
          <Input placeholder="e.g., 1.0, 2023.1" />
        </Form.Item>

        <Form.Item
          name="effectiveDate"
          label="Effective Date"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {isEdit && (
          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

const AuditStandardsList: React.FC = () => {
  const {
    editingData: editingAuditStandard,
    modalOpen,
    queryClient,
    useFetch: useFetchCrud,
    setModalOpen,
    handleEdit,
    handleDelete,
    handleModalClose,
  } = useCrud<AuditStandard>('/audit-standards');

  const { data: auditStandards, isPending } = useFetchCrud();

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: AuditStandard) => (
        <Space>
          <BookOutlined />
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
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: (text: string) => text || '-',
    },
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (date: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
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
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-standards'] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: AuditStandard) => {
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
                title: 'Delete Audit Standard',
                content: 'Are you sure you want to delete this audit standard?',
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
          <BookOutlined /> Audit Standards Management
        </Title>
        <Button
          variant='solid'
          color='default'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Audit Standard
        </Button>
      </div>

      <Table
        size='middle'
        columns={columns}
        dataSource={auditStandards || []}
        loading={isPending}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleEdit(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} audit standards`,
        }}
      />

      <AuditStandardForm
        open={modalOpen}
        onCancel={handleModalClose}
        auditStandard={editingAuditStandard}
        isEdit={!!editingAuditStandard}
      />
    </div>
  );
};

export default AuditStandardsList;
