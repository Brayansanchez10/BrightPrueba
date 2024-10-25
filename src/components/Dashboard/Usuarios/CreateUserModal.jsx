import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useRoleContext } from "../../../context/user/role.context";
import { useUserContext } from "../../../context/user/user.context";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png"; 

const { Option } = Select;

const CreateUserModal = ({ visible, onCancel, onCreate }) => {
  const { rolesData } = useRoleContext();
  const { checkIfUserExists } = useUserContext();
  const [form] = Form.useForm();
  const { t } = useTranslation("global");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { username, email, documentNumber } = values;

      if (checkIfUserExists(username, email, documentNumber)) {
        Swal.fire({
          icon: "error",
          title: t("CreateUserModal.userExists"),
          confirmButtonText: "OK",
        });
        return;
      }

      onCreate(values);

      Swal.fire({
        icon: "success",
        title: t("CreateUserModal.userCreatedSuccess"),
        showConfirmButton: false,
        timer: 1500,
      });

      form.resetFields();
      onCancel(); 
    } catch (error) {
      setShake(true); 
      setTimeout(() => setShake(false), 500); 
    }
  };

  return (
    <Modal
      className={`custom w-[544px] h-[600px] rounded-2xl bg-white flex flex-col justify-between ${shake ? "shake" : ""}`} 
      visible={visible}
      closable={false}
      centered
      footer={null}
      onCancel={onCancel}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#18116A] to-blue-500 rounded-t-2xl flex items-center justify-center">
        <img
          src={zorroImage}
          alt="Zorro"
          className="absolute max-w-[200px] max-h-[150px] object-contain mt-8"
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
        className="bg-secondary px-5 py-6"
        form={form}
        layout="vertical"
      >
        <h1 className="text-center text-[#18116A] dark:text-primary text-3xl font-extrabold mt-1 mb-5 text-shadow-md font-bungee">
          {t("CreateUserModal.createUserTitle")}
        </h1>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="username"
          label={<span className="text-primary">{t("CreateUserModal.username")}</span>}
          rules={[
            { required: true, message: t("validations.usernameRequired") },
            { min: 5, message: t("validations.usernameMinLength") },
            { max: 30, message: t("validations.usernameMaxLength") }
          ]}
        >
          <Input maxLength={30} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="firstNames"
          label={<span className="text-primary">{t("CreateUserModal.firstNames")}</span>}
          rules={[{ required: true, message: t("CreateUserModal.firstNamesRequired") }]}
        >
          <Input minLength={3} maxLength={60} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="lastNames"
          label={<span className="text-primary">{t("CreateUserModal.lastNames")}</span>}
          rules={[{ required: true, message: t("CreateUserModal.lastNamesRequired") }]}
        >
          <Input minLength={3} maxLength={60} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="documentNumber"
          label={<span className="text-primary">{t("CreateUserModal.documentNumber")}</span>}
          rules={[{ required: true, message: t("CreateUserModal.documentNumberRequired") }]}
        >
          <Input minLength={3} maxLength={20} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="email"
          label={<span className="text-primary">{t("CreateUserModal.email")}</span>}
          rules={[
            { required: true, message: t("CreateUserModal.emailRequired") },
            { type: "email", message: t("CreateUserModal.emailInvalid") },
            { max: 80, message: t("validations.maxEmail") }
          ]}
        >
          <Input maxLength={80} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="role"
          label={<span className="text-primary">{t("CreateUserModal.role")}</span>}
          rules={[{ required: true, message: t("CreateUserModal.roleRequired") }]}
        >
          <Select className="w-full h-[34px] rounded-xl bg-white shadow-md text-center">
            {rolesData.map((role) => (
              <Option key={role.id} value={role.nombre}>
                {role.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="text-lg font-bold mb-2"
          name="state"
          label={<span className="text-primary">{t("CreateUserModal.state")}</span>}
          rules={[{ required: true, message: t("CreateUserModal.stateRequired") }]}
        >
          <Select className="w-full h-[34px] rounded-xl bg-white shadow-md text-center">
            <Option value="active">{t("CreateUserModal.active")}</Option>
            <Option value="inactive">{t("CreateUserModal.inactive")}</Option>
          </Select>
        </Form.Item>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="bg-[#18116A] hover:bg-[#16105e] text-white font-semibold px-4 py-2 rounded-lg"
            onClick={handleFormSubmit}
          >
            {t("CreateUserModal.create")}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
