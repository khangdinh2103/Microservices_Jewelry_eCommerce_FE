import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Switch, Space, Popconfirm, message, Tabs, Card, Badge, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, CalendarOutlined } from '@ant-design/icons';
import { getUserOccasionReminders, getUpcomingOccasions, createOccasionReminder, updateOccasionReminder, deleteOccasionReminder } from '@/config/api';
import { IOccasionReminder, IUpcomingOccasion } from '@/types/backend';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const OccasionManager = () => {
  const [occasions, setOccasions] = useState<IOccasionReminder[]>([]);
  const [upcomingOccasions, setUpcomingOccasions] = useState<IUpcomingOccasion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<IOccasionReminder | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

//   const fetchOccasions = async () => {
//     setLoading(true);
//     try {
//       const query = `page=${pagination.current - 1}&size=${pagination.pageSize}`;
//       const res = await getUserOccasionReminders(query);
//       if (res && res.data) {
//         setOccasions(res.data.result || []);
//         setPagination({
//           ...pagination,
//           total: res.data.meta?.total || 0
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching occasions:', error);
//       message.error('Không thể tải danh sách dịp đặc biệt');
//     } finally {
//       setLoading(false);
//     }
//   };

const fetchOccasions = async () => {
    setLoading(true);
    try {
      const query = `page=${pagination.current - 1}&size=${pagination.pageSize}&sort=occasionDate,asc`;
      console.log('Fetching occasions with query:', query);
      const res = await getUserOccasionReminders(query);
      console.log('Occasions response:', res);
      
      if (res && res.data) {
        // API trả về cấu trúc có thuộc tính content chứa mảng dữ liệu
        if (res.data.content && Array.isArray(res.data.content)) {
          setOccasions(res.data.content);
          setPagination({
            ...pagination,
            total: res.data.totalElements || res.data.content.length
          });
        } 
        // Trường hợp khác - nếu data là mảng trực tiếp
        else if (Array.isArray(res.data)) {
          setOccasions(res.data);
          setPagination({
            ...pagination,
            total: res.data.length
          });
        }
        // Trường hợp data là object có thuộc tính data hoặc result
        else if (res.data.data && Array.isArray(res.data.data)) {
          setOccasions(res.data.data);
          setPagination({
            ...pagination,
            total: res.data.meta?.total || res.data.data.length
          });
        }
        else if (res.data.result && Array.isArray(res.data.result)) {
          setOccasions(res.data.result);
          setPagination({
            ...pagination,
            total: res.data.meta?.total || res.data.result.length
          });
        }
        else {
          console.log('Unexpected data structure:', res.data);
          setOccasions([]);
        }
      } else {
        console.log('No data in response');
        setOccasions([]);
      }
    } catch (error) {
      console.error('Error fetching occasions:', error);
      message.error('Không thể tải danh sách dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingOccasions = async () => {
    try {
      const res = await getUpcomingOccasions();
      if (res && res.data) {
        setUpcomingOccasions(res.data || []);
      }
    } catch (error) {
      console.error('Error fetching upcoming occasions:', error);
    }
  };

  useEffect(() => {
    fetchOccasions();
    fetchUpcomingOccasions();
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,
      current: pagination.current
    });
  };

  const showModal = (record?: IOccasionReminder) => {
    setEditingOccasion(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        occasionDate: dayjs(record.occasionDate)
      });
    } else {
      form.resetFields();
      // Đặt giá trị mặc định
      form.setFieldsValue({
        yearlyRecurring: true,
        reminderDaysBefore: 7
      });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        occasionDate: values.occasionDate.format('YYYY-MM-DD')
      };

      setLoading(true);
      if (editingOccasion?.id) {
        await updateOccasionReminder(editingOccasion.id, formattedValues);
        message.success('Cập nhật dịp đặc biệt thành công');
      } else {
        await createOccasionReminder(formattedValues);
        message.success('Tạo dịp đặc biệt thành công');
      }
      setModalVisible(false);
      fetchOccasions();
      fetchUpcomingOccasions();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi lưu dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteOccasionReminder(id);
      message.success('Xóa dịp đặc biệt thành công');
      fetchOccasions();
      fetchUpcomingOccasions();
    } catch (error) {
      console.error('Error deleting occasion:', error);
      message.error('Có lỗi xảy ra khi xóa dịp đặc biệt');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên dịp',
      dataIndex: 'occasionName',
      key: 'occasionName',
    },
    {
      title: 'Người nhận',
      dataIndex: 'recipientName',
      key: 'recipientName',
    },
    {
      title: 'Mối quan hệ',
      dataIndex: 'relationship',
      key: 'relationship',
    },
    {
      title: 'Ngày',
      dataIndex: 'occasionDate',
      key: 'occasionDate',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY')
    },
    {
      title: 'Nhắc trước (ngày)',
      dataIndex: 'reminderDaysBefore',
      key: 'reminderDaysBefore',
    },
    {
      title: 'Lặp lại hàng năm',
      dataIndex: 'yearlyRecurring',
      key: 'yearlyRecurring',
      render: (recurring: boolean) => (recurring ? 'Có' : 'Không')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IOccasionReminder) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa dịp này?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const UpcomingOccasionsView = () => (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ marginBottom: 16 }}>Dịp đặc biệt sắp tới</h3>
      {upcomingOccasions.length === 0 ? (
        <Card>Không có dịp đặc biệt nào sắp tới</Card>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {upcomingOccasions.map(occasion => (
            <Card 
              key={occasion.id} 
              title={
                <Space>
                  <CalendarOutlined />
                  {occasion.occasionName}
                </Space>
              }
              extra={
                <Badge 
                  count={occasion.daysUntil} 
                  style={{ backgroundColor: occasion.daysUntil <= 7 ? '#ff4d4f' : '#52c41a' }}
                  overflowCount={99}
                />
              }
              style={{ width: 300 }}
            >
              <p><strong>Người nhận:</strong> {occasion.recipientName} ({occasion.relationship})</p>
              <p><strong>Ngày:</strong> {dayjs(occasion.occasionDate).format('DD/MM/YYYY')}</p>
              <p><strong>Còn lại:</strong> {occasion.daysUntil} ngày</p>
              {occasion.giftPreferences && (
                <p>
                  <strong>Quà yêu thích:</strong> {occasion.giftPreferences}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const items = [
    {
      key: 'upcoming',
      label: 'Sắp tới',
      children: <UpcomingOccasionsView />
    },
    {
      key: 'all',
      label: 'Tất cả dịp đặc biệt',
      children: (
        <>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              Thêm dịp đặc biệt
            </Button>
          </div>
          <Table 
            columns={columns} 
            dataSource={occasions} 
            rowKey="id"
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </>
      )
    }
  ];

  return (
    <div>
      <Tabs defaultActiveKey="upcoming" items={items} />
      
      <Modal
        title={editingOccasion ? "Cập nhật dịp đặc biệt" : "Thêm dịp đặc biệt mới"}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            yearlyRecurring: true,
            reminderDaysBefore: 7
          }}
        >
          <Form.Item
            name="occasionName"
            label="Tên dịp"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịp' }]}
          >
            <Input placeholder="Ví dụ: Sinh nhật, Kỷ niệm..." />
          </Form.Item>
          
          <Form.Item
            name="recipientName"
            label="Người nhận"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
          >
            <Input placeholder="Tên người nhận quà/chúc mừng" />
          </Form.Item>
          
          <Form.Item
            name="relationship"
            label="Mối quan hệ"
            rules={[{ required: true, message: 'Vui lòng nhập mối quan hệ' }]}
          >
            <Input placeholder="Ví dụ: Bạn bè, Gia đình, Đồng nghiệp..." />
          </Form.Item>
          
          <Form.Item
            name="occasionDate"
            label="Ngày diễn ra"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          
          <Form.Item
            name="reminderDaysBefore"
            label="Nhắc trước (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập số ngày nhắc trước' }]}
          >
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="yearlyRecurring"
            label="Lặp lại hàng năm"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="giftPreferences"
            label="Quà yêu thích"
          >
            <Input.TextArea placeholder="Gợi ý quà tặng..." rows={2} />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea placeholder="Ghi chú thêm..." rows={2} />
          </Form.Item>
          
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingOccasion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OccasionManager;