import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useRoleContext } from '../../../context/user/role.context';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const UpdateUserModal = ({ visible, onCancel, onUpdate, user }) => {
  const { rolesData } = useRoleContext();
  const [form] = Form.useForm();
  const { t } = useTranslation("global");

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(user);
    }
  }, [visible, user, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      onUpdate(values);
      onCancel(); // Close the modal

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: t('UpdateUserModal.userUpdatedSuccess'),
        showConfirmButton: false,
        timer: 1000, // Duración del mensaje
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Modal
      className="shadow-orange shadow-white border-2 border-black rounded-lg"
      visible={visible}
      closable={false}
      centered
      maskStyle={{ backdropFilter: "blur(15px)" }}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        className="bg-gradient-to-tr from-teal-400 to-blue-500 shadow-lg rounded-lg py-2"
        form={form}
        layout="vertical"
        initialValues={user}
      >
        <h1 className="text-2xl text-white font-bold text-center">
          {t('UpdateUserModal.updateUserTitle')}
        </h1>
        <Form.Item
          className="text-base font-semibold mx-10 mt-4"
          name="username"
          label={t('UpdateUserModal.username')}
          rules={[{ required: true, message: t('UpdateUserModal.usernameRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="text-base font-semibold mx-10"
          name="email"
          label={t('UpdateUserModal.email')}
          rules={[{ required: true, message: t('UpdateUserModal.emailRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="text-base font-semibold mx-10"
          name="role"
          label={t('UpdateUserModal.role')}
          rules={[{ required: true, message: t('UpdateUserModal.roleRequired') }]}
        >
          <Select className="text-center">
            {rolesData.map((role) => (
              <Option key={role._id} value={role.nombre}>
                {role.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="text-base font-semibold mx-10"
          name="state"
          label={t('UpdateUserModal.state')}
          rules={[{ required: true, message: t('UpdateUserModal.stateRequired') }]}
        >
          <Select className="text-center">
            <Option value={true}>{t('UpdateUserModal.active')}</Option>
            <Option value={false}>{t('UpdateUserModal.inactive')}</Option>
          </Select>
        </Form.Item>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="bg-neutral-700 hover:bg-neutral-600 text-white font-medium px-4 py-2 rounded-lg"
            onClick={onCancel}
          >
            {t('UpdateUserModal.cancel')}
          </button>
          <button
            className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white font-medium rounded-lg"
            onClick={handleFormSubmit}
          >
            {t('UpdateUserModal.update')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
