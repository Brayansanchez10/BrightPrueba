import React from "react";
import { Modal, Select, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const UpdateEntityModal = ({ visible, onClose, onUpdate, form }) => {
    const { t } = useTranslation("global");
    const MAX_COURSE_NAME_LENGTH = 30;
    const MIN_DESCRIPTION_LENGTH = 30;

    const validateFields = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = t('updateCategoryModal.namePlaceholder'); 
        } else if (values.name.length < 3) {
            errors.name = t('updateCategoryModal.nameShort');
        } else if (values.name.length > 20) {
            errors.name = t('updateCategoryModal.nameLong');
        }

        if (!values.type) {
            errors.type = t('updateCategoryModal.descriptionPlaceholder'); 
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
        onUpdate(values);
    };

    return (
        <Modal
            className="custom-modal w-[544px] rounded-3xl bg-white flex flex-col justify-between"
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
                    {t('updateEntityModal.title')}
                </h1>
                <Form.Item
                    className="text-lg font-bold text-black mb-2"
                    name="name"
                    label={t('updateCategoryModal.nameLabel')}
                    rules={[
                        { required: true, message: t('updateCategoryModal.namePlaceholder') },
                        { min: 3, message: t('updateCategoryModal.nameShort') },
                        { max: 20, message: t('updateCategoryModal.nameLong') }
                    ]}
                >
                    <Input maxLength={20} className="w-full h-[34px] rounded-xl bg-white shadow-md px-3" />
                </Form.Item>

                <Form.Item
                    className="text-lg font-bold text-black mb-2"
                    name="type"
                    label="Tipo"
                    rules={[{ required: true, message: t('updateCategoryModal.descriptionPlaceholder') }]}
                >
                    <Select className="w-full h-[34px] rounded-xl bg-white shadow-md">
                        <Option value="Persona">{t('createEntityForm.person')}</Option>
                        <Option value="Empresa">{t('createEntityForm.company')}</Option>
                    </Select>
                </Form.Item>
                
                <div className="flex justify-center mt-6">
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

export default UpdateEntityModal;
