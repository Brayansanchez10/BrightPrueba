import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateCategoryModal = ({
  visible,
  onClose,
  onUpdate,
  form,
  imagePreview: initialImagePreview, // Imagen previa pasada como prop
}) => {
  const { t } = useTranslation("global");
  const [imagePreview, setImagePreview] = useState(null); // Estado para almacenar la previsualización de la imagen
  const [imageFile, setImageFile] = useState(null); // Estado para almacenar el archivo de imagen seleccionado

  
  useEffect(() => {
    if (initialImagePreview) {
      setImagePreview(initialImagePreview); 
    }
  }, [initialImagePreview]);


  // Manejar el cambio de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (values) => {
    onUpdate({ ...values, image: imageFile }); 
  };

  return (
    <Modal
      className="custom w-[544px] h-[600px] rounded-2xl bg-white flex flex-col justify-between"
      visible={visible}
      closable={false}
      centered
      footer={null}
      onCancel={onClose}
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
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <Form
        className="px-5 py-6"
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <h1 className="text-center text-[#350b48] text-3xl font-extrabold mt-1 mb-5 text-shadow-md">
          {t('updateCategoryModal.title')}
        </h1>
        <Form.Item
          className="text-lg font-bold text-black mb-2"
          name="name"
          label={t('updateCategoryModal.nameLabel')}
          rules={[{ required: true, message: t('updateCategoryModal.namePlaceholder') }]}
        >
          <Input className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        <Form.Item
          className="text-lg font-bold text-black mb-2"
          name="description"
          label={t('updateCategoryModal.descriptionLabel')}
          rules={[{ required: true, message: t('updateCategoryModal.descriptionPlaceholder') }]}
        >
          <Input.TextArea rows={3} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
        </Form.Item>

        {/* Input para seleccionar la imagen */}
        <div className="mb-4">
          <label className="block text-lg font-bold text-black mb-2">
            {t('updateCategoryModal.imagePreview')}
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full h-[44px] rounded-xl bg-white shadow-md px-3 py-2"
            onChange={handleImageChange}
          />
        </div>

        {/* Previsualización de la imagen */}
        {imagePreview && (
          <div className="flex justify-center mt-2">
            <img
              src={imagePreview}
              alt={t('updateCategoryModal.imagePreview')}
              className="w-[189.69px] h-[148px] object-contain rounded-lg border border-gray-300"
            />
          </div>
        )}

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
