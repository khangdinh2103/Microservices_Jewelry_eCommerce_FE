import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, changeUserPassword } from "@/config/api";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserUpdateInfo = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getUserProfile();
            if (res) {
                form.setFieldsValue(res);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (values: any) => {
        setLoading(true);
        const res = await updateUserProfile(values);
        setLoading(false);
        if (res) {
            message.success("Cập nhật thông tin thành công");
        }
    };

    return (
        <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
            </Form.Item>
        </Form>
    );
};

const UserChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (values: any) => {
        setLoading(true);
        const res = await changeUserPassword(values);
        setLoading(false);
        if (res) {
            message.success("Đổi mật khẩu thành công");
            form.resetFields();
        }
    };

    return (
        <Form form={form} onFinish={handleChangePassword} layout="vertical">
            <Form.Item label="Mật khẩu cũ" name="oldPassword" rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, message: "Nhập mật khẩu mới" }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Đổi mật khẩu</Button>
            </Form.Item>
        </Form>
    );
};

const ManageAccount = ({ open, onClose }: IProps) => {
    const items: TabsProps['items'] = [
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserChangePassword />,
        },
    ];

    return (
        <Modal
            title="Quản lý tài khoản"
            open={open}
            onCancel={() => onClose(false)}
            maskClosable={false}
            footer={null}
            destroyOnClose={true}
            width={isMobile ? "100%" : "600px"}
        >
            <Tabs defaultActiveKey="user-update-info" items={items} />
        </Modal>
    );
};

export default ManageAccount;
