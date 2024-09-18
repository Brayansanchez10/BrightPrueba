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
        onCancel(); 

        Swal.fire({
          icon: 'success',
          title: t('UpdateUserModal.userUpdatedSuccess'),
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    };

    return (
      <Modal
        className="custom w-[544px] h-[600px] rounded-2xl bg-white flex flex-col justify-between"
        visible={visible}
        closable={false}
        centered
        footer={null}
        onCancel={onCancel}
      >
        <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
          <img
            src="/src/assets/img/imagen1.png"
            alt="Imagen de la cabecera"
            className="w-[189.69px] h-[148px] object-contain mt-8"
          />
          <button
            type="button"
            className="absolute top-4 right-5 text-white text-3xl font-extrabold bg-transparent border-none cursor-pointer"
            onClick={onCancel}
          >
            &times;
          </button>
        </div>

        <Form
          className="px-5 py-6"
          form={form}
          layout="vertical"
          initialValues={user}
        >
          <h1 className="text-center text-[#350b48] text-3xl font-extrabold mt-1 mb-5 text-shadow-md">
            {t('UpdateUserModal.updateUserTitle')}
          </h1>
          
          <Form.Item
            className="text-lg font-bold text-black mb-2"
            name="username"
            label={t('UpdateUserModal.username')}
            rules={[{ required: true, message: t('UpdateUserModal.usernameRequired') }]}
          >
            <Input className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
          </Form.Item>

          <Form.Item
            className="text-lg font-bold text-black mb-2"
            name="email"
            label={t('UpdateUserModal.email')}
            rules={[{ required: true, message: t('UpdateUserModal.emailRequired') }]}
          >
            <Input className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
          </Form.Item>

          <Form.Item
            className="text-lg font-bold text-black mb-2"
            name="role"
            label={t('UpdateUserModal.role')}
            rules={[{ required: true, message: t('UpdateUserModal.roleRequired') }]}
          >
            <Select className="w-full h-[34px] rounded-xl bg-white shadow-md text-center">
              {rolesData.map((role) => (
                <Option key={role._id} value={role.nombre}>
                  {role.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="text-lg font-bold text-black mb-2"
            name="state"
            label={t('UpdateUserModal.state')}
            rules={[{ required: true, message: t('UpdateUserModal.stateRequired') }]}
          >
            <Select className="w-full h-[34px] rounded-xl bg-white shadow-md text-center">
              <Option value={true}>{t('UpdateUserModal.active')}</Option>
              <Option value={false}>{t('UpdateUserModal.inactive')}</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-[#350b48] hover:bg-[#2d0a3d] text-white font-semibold px-4 py-2 rounded-lg"
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
