import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, Typography, message, Row, Col } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, getItem, createItem, updateItem } from '@/lib/api';
import { AuditArea, CreateAuditArea, UpdateAuditArea, Department } from '@audit-system/shared';

const { Title } = Typography;
const { Option } = Select;

const AuditAreasForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEdit = id && id !== 'new';

  const { data: auditArea, isLoading: isLoadingAuditArea } = useQuery({
    queryKey: ['audit-area', id],
    queryFn: () => getItem<AuditArea>('/audit-areas', Number(id)),
    enabled: !!isEdit,
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getItems<Department[]>('/departments'),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAuditArea) => createItem('/audit-areas', data),
    onSuccess: () => {
      message.success('Audit area created successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
      navigate('/audit-areas');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create audit area');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAuditArea }) =>
      updateItem('/audit-areas', id, data),
    onSuccess: () => {
      message.success('Audit area updated successfully');
      queryClient.invalidateQueries({ queryKey: ['audit-areas'] });
      navigate('/audit-areas');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update audit area');
    },
  });

  useEffect(() => {
    if (isEdit && auditArea) {
      form.setFieldsValue({
        name: auditArea.name,
        description: auditArea.description,
        riskLevel: auditArea.riskLevel,
        departmentId: auditArea.departmentId,
      });
    }
  }, [auditArea, isEdit, form]);

  const onFinish = (values: any) => {
    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const onCancel = () => {
    navigate('/audit-areas');
  };

  if (isEdit && isLoadingAuditArea) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>{isEdit ? 'Edit Audit Area' : 'Create New Audit Area'}</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input audit area name!' }]}
          >
            <Input placeholder="Enter audit area name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description (optional)"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="Department"
                rules={[{ required: true, message: 'Please select department!' }]}
              >
                <Select placeholder="Select department">
                  {(departments || []).map((dept: Department) => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuditAreasForm;
