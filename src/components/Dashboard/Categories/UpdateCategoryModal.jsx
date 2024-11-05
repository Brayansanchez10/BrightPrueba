import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import zorroImage from "../../../assets/img/imagen1.png"; 

const UpdateCategoryModal = ({
  visible,
  onClose,
  onUpdate,
  form, 
}) => {
  const { t } = useTranslation("global");


  const validateFields = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = t('updateCategoryModal.namePlaceholder'); 
    } else if (values.name.length < 3) {
      errors.name = t('updateCategoryModal.nameShort');
    } else if (values.name.length > 20) {
      errors.name = t('updateCategoryModal.nameLong');
    }

    if (!values.description) {
      errors.description = t('updateCategoryModal.descriptionPlaceholder'); 
    } else if (values.description.length < 30) {
      errors.description = t('updateCategoryModal.descriptionShort'); 
    } else if (values.description.length > 150) {
      errors.description = t('updateCategoryModal.descriptionLong'); 
    }
    return errors;
  };

  const handleSubmit = (values) => {
    const errors = validateFields(values);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        form.setFields([{ name: field, errors: [message] }]); 
      });
      return;
    }
    onUpdate({ 
      ...values
    }); 
  };

  return (
    <Modal
      className="custom-modal w-[544px] h-[500px] rounded-3xl bg-white flex flex-col justify-between overflow-hidden"
      visible={visible}
      closable={false}
      style={{ top: '10%' }}
      footer={null}
      onCancel={onClose}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350b48] to-[#905be8] rounded-t-2xl flex items-center justify-center">
        <img 
          src={zorroImage} 
          alt="Imagen de la cabecera"
          className="w-[189.69px] h-[148px] object-contain mt-8" 
        />
        <button
          type="button"
          className="absolute top-4 right-5 text-white text-3xl font-extrabold bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <Form
        className="px-5 py-6 pb-8"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <h1 className="text-center text-[#350b48] text-3xl font-extrabold mt-1 mb-5 text-shadow-md font-bungee">
          {t('updateCategoryModal.title')}
        </h1>
        <Form.Item
          className="text-lg font-bold text-black mb-2"
          name="name"
          label={t('updateCategoryModal.nameLabel')}
          rules={[{ required: true, message: t('updateCategoryModal.namePlaceholder') }]}
        >
          <Input maxLength={20} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        <Form.Item
          className="text-lg font-bold text-black mb-2"
          name="description"
          label={t('updateCategoryModal.descriptionLabel')}
          rules={[{ required: true, message: t('updateCategoryModal.descriptionPlaceholder') }]}
        >
          <Input.TextArea rows={3} maxLength={100} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="submit"
            className="bg-[#350b48] hover:bg-[#2d0a3d] text-white font-semibold px-4 py-2 rounded-lg"
          >
            {t('updateCategoryModal.updateButton')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateCategoryModal;