import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useRoleContext } from '../../../context/user/role.context';
import { useUserContext } from "../../../context/user/user.context"; 
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import zorroImage from "../../../assets/img/imagen1.png"; 
import "../css/Custom.css";
import { getEntity } from "../../../api/user/entities.request.js";

const { Option } = Select;

const UpdateUserModal = ({ visible, onCancel, onUpdate, user }) => {
  const { rolesData } = useRoleContext();
  const { checkIfUserExists, checkIfDocumentExists } = useUserContext();
  const [form] = Form.useForm();
  const { t } = useTranslation("global");
  const [shake, setShake] = useState(false);
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    async function loadEntities() {
      try {
        const response = await getEntity();
        setEntities(response.data);
      } catch (error) {
        console.error("Error loading entities:", error);
        setError("Failed to load entities");
      }
    } 
    loadEntities();
  }, []);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(user);
    }
  }, [visible, user, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { username, email, documentNumber } = values;
  
      const currentUserId = user?.id;
  
      // Verifica si existe otro usuario con el mismo username o email
      if (checkIfUserExists(username, email, currentUserId)) {
        Swal.fire({
          icon: "error",
          title: t("UpdateUserModal.userExists"),
          confirmButtonText: "OK",
        });
        return;
      }
  
      // Verifica si existe otro usuario con el mismo número de documento
      if (checkIfDocumentExists(documentNumber, currentUserId)) {
        Swal.fire({
          icon: "error",
          title: t("UpdateUserModal.documentNumberExists"),
          confirmButtonText: "OK",
        });
        return;
      }
  
      // Actualiza la información del usuario
      onUpdate(values);
      console.log("Datos enviados del update:", values);
  
      Swal.fire({
        icon: "success",
        title: t("UpdateUserModal.userUpdatedSuccess"),
        showConfirmButton: false,
        timer: 1500,
      });
  
      form.resetFields();
      onCancel(); // Cierra el modal
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };  

  return (
    <Modal
      className={`custom-modal w-[544px] h-auto sm:h-[989px] rounded-3xl bg-white flex flex-col justify-between overflow-hidden ${shake ? "shake" : ""}`}
      visible={visible}
      footer={null}
      closable={false}
      style={{ top: '5%' }}
      onCancel={onCancel}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
        <img
          src={zorroImage}
          alt="Zorro"
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
        onFinish={handleFormSubmit}
        className="bg-white px-5 py-6 pb-8"
        form={form}
        layout="vertical"
      >
        <h1 className="text-center text-[#350b48] text-3xl font-extrabold mt-1 mb-5 font-bungee">
          {t('UpdateUserModal.updateUserTitle')}
        </h1>

        <Form.Item
          className="mb-4"
          name="username"
          label={<span className="text-lg font-bold">{t('UpdateUserModal.username')}</span>}
          rules={[
            { required: true, message: t("validations.usernameRequired") },
            { min: 5, message: t("validations.usernameMinLength") },
            { max: 30, message: t("validations.usernameMaxLength") }
          ]}
        >
          <Input maxLength={30} className="w-full h-[34px] text-base font-normal rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="firstNames"
          label={<span className="text-lg font-bold">{t('CreateUserModal.firstNames')}</span>}
          rules={[{ required: true, message: t("CreateUserModal.firstNamesRequired") }]}
        >
          <Input minLength={3} maxLength={60} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="lastNames"
          label={<span className="text-lg font-bold">{t('CreateUserModal.lastNames')}</span>}
          rules={[{ required: true, message: t("CreateUserModal.lastNamesRequired") }]}
        >
          <Input minLength={3} maxLength={60} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="documentNumber"
          label={<span className="text-lg font-bold">{t('CreateUserModal.documentNumber')}</span>}
          rules={[{ required: true, message: t("CreateUserModal.documentNumberRequired") }]}
        >
          <Input type="number" minLength={3} maxLength={20} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3"  onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="email"
          label={<span className="text-lg font-bold">{t('UpdateUserModal.email')}</span>}
          rules={[
            { required: true, message: t("CreateUserModal.emailRequired") },
            { type: "email", message: t("CreateUserModal.emailInvalid") },
            { max: 80, message: t("validations.maxEmail") }
          ]}
        >
          <Input maxLength={80} className="w-full h-[34px] text-base font-normal rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="role"
          label={<span className="text-lg font-bold">{t('UpdateUserModal.role')}</span>}
          rules={[{ required: true, message: t('UpdateUserModal.roleRequired') }]}
        >
          <Select className="w-full h-[34px] text-base rounded-xl bg-white shadow-md px-3 border-none">
            {rolesData.map((role) => (
              <Option key={role.id} value={role.nombre}>
                {role.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="state"
          label={<span className="text-lg font-bold">{t('UpdateUserModal.state')}</span>}
          rules={[{ required: true, message: t('UpdateUserModal.stateRequired') }]}
        >
          <Select className="w-full h-[34px] text-base rounded-xl bg-white shadow-md px-3 border-none">
            <Option value={true}>{t('UpdateUserModal.active')}</Option>
            <Option value={false}>{t('UpdateUserModal.inactive')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="entityId"
          label={<span className="text-lg font-bold">{t('UpdateUserModal.selectEntty')}</span>}
          rules={[{ required: true, message: t('UpdateUserModal.selectEntty') }]}
        >
          <Select className="w-full h-[34px] text-base rounded-xl bg-white shadow-md px-3 border-none">
            {entities
              .filter((entity) => entity.id !== 1) // Filtra la entidad con id 1
              .map((entity) => (
                <Option key={entity.id} value={entity.id}>
                  {entity.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <div className="flex justify-center pt-2 space-x-4">
          <button
            type="submit"
            className="bg-[#350b48] text-white rounded-xl h-[41px] w-[133px] text-lg font-bold cursor-pointer"
          >
            {t('UpdateUserModal.update')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
