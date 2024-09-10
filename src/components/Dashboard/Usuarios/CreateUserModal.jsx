import React, { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useRoleContext } from "../../../context/user/role.context";
import { useUserContext } from "../../../context/user/user.context";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const CreateUserModal = ({ visible, onCancel, onCreate }) => {
  const { rolesData } = useRoleContext();
  const { checkIfUserExists } = useUserContext();
  const [form] = Form.useForm();
  const { t } = useTranslation("global");

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { username, email } = values;

      // Verifica si el usuario ya existe
      if (checkIfUserExists(username, email)) {
        Swal.fire({
          icon: "error",
          title: t("CreateUserModal.userExists"),
          confirmButtonText: "OK",
        });
        return;
      }

      onCreate(values);

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: t("CreateUserModal.userCreatedSuccess"),
        showConfirmButton: false,
        timer: 1500, // Duración del mensaje
      });

      form.resetFields();
      onCancel(); // Cerrar el modal después de crear el usuario
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <Modal
      className="shadow-orange shadow-white border-2 border-black rounded-lg"
      centered
      visible={visible}
      closable={false}
      onCancel={onCancel}
      footer={null}
      maskStyle={{ backdropFilter: "blur(15px)" }}
    >
      <Form
        className="bg-gradient-to-tr from-teal-400 to-blue-500 shadow-lg rounded-lg py-2"
        form={form}
        layout="vertical"
      >
        <h1 className="text-2xl text-white text-center font-black">
          {t("CreateUserModal.createUserTitle")}
        </h1>
        <Form.Item
          className="text-base font-semibold mx-10 mt-4"
          name="username"
          label={t("CreateUserModal.username")}
          rules={[
            { required: true, message: t("CreateUserModal.usernameRequired") },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="text-base font-semibold mx-10"
          name="email"
          label={t("CreateUserModal.email")}
          rules={[
            { required: true, message: t("CreateUserModal.emailRequired") },
            { type: "email", message: t("CreateUserModal.emailInvalid") },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="text-base font-semibold mx-10"
          name="role"
          label={t("CreateUserModal.role")}
          rules={[
            { required: true, message: t("CreateUserModal.roleRequired") },
          ]}
        >
          <Select>
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
          label={t("CreateUserModal.state")}
          rules={[
            { required: true, message: t("CreateUserModal.stateRequired") },
          ]}
        >
          <Select className="text-center">
            <Option value={true}>{t("CreateUserModal.active")}</Option>
            <Option value={false}>{t("CreateUserModal.inactive")}</Option>
          </Select>
        </Form.Item>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white font-medium rounded-lg"
            onClick={handleFormSubmit}
          >
            {t("CreateUserModal.create")}
          </button>
          <button
            className="bg-neutral-700 hover:bg-neutral-600 text-white font-medium px-4 py-2 rounded-lg"
            key="cancel"
            onClick={onCancel}
          >
            {t("CreateUserModal.cancel")}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
