import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Space,
  Tag,
  message,
  Dropdown,
  MenuProps,
  Card,
  Descriptions,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  MoreOutlined,
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  AuditOutlined,
  BookOutlined
} from '@ant-design/icons';
import {
  AuditPlanItem,
  CreateAuditPlanItem,
  UpdateAuditPlanItem,
  User,
  AuditArea,
  AuditStandard,
  AuditPlan
} from '@audit-system/shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFetch } from '@/hooks/useFetch';
import { create, deleteById, getAll, getById, updateById } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface AuditPlanItemFormProps {
  open: boolean;
  onCancel: () => void;
  auditPlanItem?: AuditPlanItem;
  isEdit?: boolean;
  planId: number;
  users?: User[];
  auditAreas?: AuditArea[];
  auditStandards?: AuditStandard[];
}

const AuditPlanItemForm: React.FC<AuditPlanItemFormProps> = ({
  open,
  onCancel,
  auditPlanItem,
  isEdit = false,
  planId,
  users = [],
  auditAreas = [],
  auditStandards = []
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateAuditPlanItem) => create("/audit-plans/items", data),
    onSuccess: () => {
      message.success('Plan item created successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plan-items', planId] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create plan item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAuditPlanItem }) => updateById('/audit-plans/items', id, data),
    onSuccess: () => {
      message.success('Plan item updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plan-items', planId] });
      onCancel();
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update plan item');
    },
  });

  const onSubmit = async (values: any) => {
    const data = {
      ...values,
      planId,
      plannedStartDate: values.plannedStartDate ? values.plannedStartDate.toDate() : undefined,
      plannedEndDate: values.plannedEndDate ? values.plannedEndDate.toDate() : undefined,
    };

    if (isEdit && auditPlanItem) {
      updateMutation.mutate({ id: auditPlanItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  React.useEffect(() => {
    if (isEdit && auditPlanItem) {
      form.setFieldsValue({
        areaId: auditPlanItem.areaId,
        standardId: auditPlanItem.standardId,
        plannedStartDate: auditPlanItem.plannedStartDate ? dayjs(auditPlanItem.plannedStartDate) : undefined,
        plannedEndDate: auditPlanItem.plannedEndDate ? dayjs(auditPlanItem.plannedEndDate) : undefined,
        auditFrequency: auditPlanItem.auditFrequency,
        priority: auditPlanItem.priority,
        status: auditPlanItem.status,
        assignedAuditorId: auditPlanItem.assignedAuditorId,
      });
    } else {
      form.resetFields();
    }
  }, [auditPlanItem, isEdit, form]);

  return (
    <Modal
      width={600}
      title={isEdit ? 'Edit Plan Item' : 'Add Plan Item'}
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
          name="areaId"
          label="Audit Area"
          rules={[{ required: true, message: 'Please select an audit area!' }]}
        >
          <Select placeholder="Select audit area" showSearch optionFilterProp="label">
            {auditAreas.map((area) => (
              <Option key={area.id} value={area.id} label={area.name}>
                {area.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="standardId"
          label="Standard"
        >
          <Select placeholder="Select standard" showSearch optionFilterProp="label" allowClear>
            {auditStandards.map((standard) => (
              <Option key={standard.id} value={standard.id} label={standard.name}>
                {standard.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="plannedStartDate"
          label="Start Date"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="plannedEndDate"
          label="End Date"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="auditFrequency"
          label="Frequency"
        >
          <Select placeholder="Select frequency" allowClear>
            <Option value="Annual">Annual</Option>
            <Option value="Semi-Annual">Semi-Annual</Option>
            <Option value="Quarterly">Quarterly</Option>
            <Option value="Monthly">Monthly</Option>
            <Option value="Ad-hoc">Ad-hoc</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
        >
          <Select placeholder="Select priority" allowClear>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
        >
          <Select placeholder="Select status">
            <Option value="Planned">Planned</Option>
            <Option value="Scheduled">Scheduled</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="assignedAuditorId"
          label="Assigned Auditor"
        >
          <Select placeholder="Select auditor" showSearch optionFilterProp="label" allowClear>
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

const AuditPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlanItem, setEditingPlanItem] = useState<AuditPlanItem | undefined>();
  const queryClient = useQueryClient();

  const planId = Number(id);

  // Fetch audit plan
  const { data: auditPlan, isPending: planLoading } = useQuery({
    queryKey: ['audit-plan', planId],
    queryFn: () => getById<AuditPlan>('/audit-plan', planId),
    enabled: !!planId,
    refetchOnWindowFocus: false,
  });

  // Fetch audit plan items
  const { data: planItems, isPending: itemsLoading } = useQuery({
    queryKey: ['audit-plan-items', planId],
    queryFn: () => getAll<AuditPlanItem[]>('/audit-plans/items/' + planId),
    enabled: !!planId,
    refetchOnWindowFocus: false,
  });

  // Fetch supporting data
  const { data: users } = useFetch<User[]>('/users')
  const { data: auditAreas } = useFetch<AuditArea[]>('/audit-areas')
  const { data: auditStandards } = useFetch<AuditStandard[]>('/audit-standards')

  const deletePlanItemMutation = useMutation({
    mutationFn: (id: number) => deleteById('/audit-plan-items', id),
    onSuccess: () => {
      message.success('Plan item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-plan-items', planId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete plan item');
    },
  });

  const handleEditPlanItem = (planItem: AuditPlanItem) => {
    setEditingPlanItem(planItem);
    setModalOpen(true);
  };

  const handleDeletePlanItem = (id: number) => {
    deletePlanItemMutation.mutate(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPlanItem(undefined);
  };

  const getStatusColor = (status?: string) => {
    const colors = {
      'Planned': 'default',
      'Scheduled': 'blue',
      'In Progress': 'orange',
      'Completed': 'green',
      'Cancelled': 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPriorityColor = (priority?: string) => {
    const colors = {
      'High': 'red',
      'Medium': 'orange',
      'Low': 'green',
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  const planItemColumns = [
    {
      title: 'Audit Area',
      dataIndex: 'areaId',
      key: 'area',
      render: (areaId: number) => {
        const area = auditAreas?.find((a: any) => a.id === areaId);
        return (
          <Space>
            <AuditOutlined />
            <span>{area?.name || `Area #${areaId}`}</span>
          </Space>
        );
      },
    },
    {
      title: 'Standard',
      dataIndex: 'standardId',
      key: 'standard',
      render: (standardId?: number) => {
        if (!standardId) return '-';
        const standard = auditStandards?.find((s: any) => s.id === standardId);
        return (
          <Space>
            <BookOutlined />
            <span>{standard?.name || `Standard #${standardId}`}</span>
          </Space>
        );
      },
    },
    {
      title: 'Planned Dates',
      key: 'dates',
      render: (_: any, record: AuditPlanItem) => (
        <Space direction="vertical" size="small">
          {record.plannedStartDate && (
            <div>
              <CalendarOutlined /> Start: {dayjs(record.plannedStartDate).format('MMM DD, YYYY')}
            </div>
          )}
          {record.plannedEndDate && (
            <div>
              <CalendarOutlined /> End: {dayjs(record.plannedEndDate).format('MMM DD, YYYY')}
            </div>
          )}
          {!record.plannedStartDate && !record.plannedEndDate && '-'}
        </Space>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority?: string) =>
        priority ? <Tag color={getPriorityColor(priority)}>{priority}</Tag> : '-',
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
      title: 'Assigned Auditor',
      dataIndex: 'assignedAuditorId',
      key: 'assignedAuditor',
      render: (auditorId?: number) => {
        if (!auditorId) return '-';
        const auditor = users?.find((u: any) => u.id === auditorId);
        return (
          <Space>
            <UserOutlined />
            <span>{auditor?.name || `User #${auditorId}`}</span>
          </Space>
        );
      },
    },
    {
      title: <Button type='link' onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-plan-items', planId] })}><ReloadOutlined /></Button>,
      key: 'actions',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: AuditPlanItem) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEditPlanItem(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Plan Item',
                content: 'Are you sure you want to delete this plan item?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => handleDeletePlanItem(record.id),
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

  if (planLoading) {
    return <div>Loading...</div>;
  }

  if (!auditPlan) {
    return <div>Audit plan not found</div>;
  }

  const creator = users?.find((u: any) => u.id === auditPlan.createdById);
  const approver = auditPlan.approvedById ? users?.find((u: any) => u.id === auditPlan.approvedById) : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/audit-plans')}
            style={{ marginRight: 16 }}
          >
            Back to Plans
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            {auditPlan.name}
          </Title>
        </div>
      </div>

      <Tabs defaultActiveKey="details">
        <TabPane tab="Plan Details" key="details">
          <Card>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Plan Name" span={2}>
                {auditPlan.name}
              </Descriptions.Item>
              <Descriptions.Item label="Fiscal Year">
                {auditPlan.fiscalYear}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  auditPlan.status === 'Draft' ? 'default' :
                    auditPlan.status === 'Approved' ? 'blue' :
                      auditPlan.status === 'Active' ? 'green' :
                        auditPlan.status === 'Completed' ? 'purple' : 'orange'
                }>
                  {auditPlan.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {auditPlan.description || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                <Space>
                  <UserOutlined />
                  {creator?.name || `User #${auditPlan.createdById}`}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(auditPlan.createdAt).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              {auditPlan.approvedById && (
                <>
                  <Descriptions.Item label="Approved By">
                    <Space>
                      <UserOutlined />
                      {approver?.name || `User #${auditPlan.approvedById}`}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Approved At">
                    {auditPlan.approvedAt ? dayjs(auditPlan.approvedAt).format('MMMM DD, YYYY HH:mm') : '-'}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab={`Plan Items (${planItems?.length || 0})`} key="items">
          <div style={{ marginBottom: 16 }}>
            <Button
              variant='solid'
              color='default'
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add Plan Item
            </Button>
          </div>

          <Table
            columns={planItemColumns}
            dataSource={planItems}
            loading={itemsLoading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} plan items`,
            }}
          />
        </TabPane>
      </Tabs>

      <AuditPlanItemForm
        open={modalOpen}
        onCancel={handleModalClose}
        auditPlanItem={editingPlanItem}
        isEdit={!!editingPlanItem}
        planId={planId}
        users={users}
        auditAreas={auditAreas}
        auditStandards={auditStandards}
      />
    </div>
  );
};

export default AuditPlanDetail;
