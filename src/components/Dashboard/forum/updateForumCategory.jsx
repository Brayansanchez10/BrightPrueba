import React, { useState, useEffect, useRef } from "react";
import { Modal, Select, Form, Input} from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context";

const { Option } = Select;

const UpdateCategoriesForum = ({ visible, onClose, onUpdate, imagePreview: initialImagePreview, form }) => {
    const { t } = useTranslation("global");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); 
    const MAX_COURSE_NAME_LENGTH = 30;
    const MIN_DESCRIPTION_LENGTH = 30;

    useEffect(() => {
        if (initialImagePreview) {
          setImagePreview(initialImagePreview); 
        }
      }, [initialImagePreview]);
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          setImageFile(file); 
          setImagePreview(URL.createObjectURL(file)); 
        }
    };

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
    
        if (!imagePreview && !imageFile) {
          errors.image = t('updateCategoryModal.imageRequired');
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
    
        // Si no se ha subido una nueva imagen, usar la imagen previa
        onUpdate({ 
          ...values, 
          image: imageFile ? imageFile : initialImagePreview 
        }); 
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
            <span className="text-red-500">{imageFile || imagePreview ? '' : t('updateCategoryModal.imageRequired')}</span>
            </div>
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

export default UpdateCategoriesForum;