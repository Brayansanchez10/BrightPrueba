import React, { useState, useEffect } from "react";
import { Modal, Spin, Input } from "antd";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";
import {
  getForumCategoryById,
  deleteForumCategory as apiDeleteForumCategory,
} from "../../../api/forum/forumCategories.request";
import { useForumCategories } from "../../../context/forum/forumCategories.context";

const DeleteForumCategory = ({
  visible,
  onClose,
  category,
  onDeleteSuccess = () => {},
}) => {
  const { t } = useTranslation("global");
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forum, setForum] = useState({ id: null, name: "" });
  const { getAllForumCategories } = useForumCategories();
  const [categories, setCategories] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await getAllForumCategories();
      setCategories(response);
    } catch (err) {
      console.error("Error al obtener todas los roles:", err);
    }
  };

  useEffect(() => {
    if (visible && category) {
      fetchForum();
      setConfirmationInput("");
    } else {
      setForum({ id: null, name: "" });
      setConfirmationInput("");
    }
  }, [visible, category]);

  useEffect(() => {
    setIsConfirmDisabled(confirmationInput !== forum.name);
  }, [confirmationInput, forum.name]);

  const fetchForum = async () => {
    setLoading(true);
    try {
      const response = await getForumCategoryById(category);
      setForum(response.data);
    } catch (error) {
      console.error("Error fetching forum category", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (confirmationInput !== forum.name) {
      Swal.fire({
        icon: "error",
        title: t("forumCategory.nameMatchError"),
        text: t("forumCategory.nameMatchErrorMessage"),
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    try {
      await apiDeleteForumCategory(forum.id);
      Swal.fire({
        icon: "success",
        title: t("forumCategory.AlertDelete"),
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        if (typeof onDeleteSuccess === 'function') {
          onDeleteSuccess();
        }
        onClose();
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting forum category", error);
      Swal.fire({
        icon: "error",
        title: t("forumCategory.deleteError"),
        text: error.response?.data?.message || t("forumCategory.genericError"),
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return null;
  }

  return (
    <Modal
      className="custom-modal w-[543px] bg-white rounded-3xl"
      centered
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      styles={{
        body: {
          overflow: "hidden",
        },
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[350px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
            <img
              src={zorroImage}
              alt="Zorro"
              className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2"
            />
            <button
              className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="p-5 text-center">
            <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4 font-bungee">
              {t("forumCrud.deleteTitle")}
            </h1>
            <p className="text-lg font-semibold mb-3">
              {t("forumCrud.deleteMessage")} {forum.name}?
            </p>
            <p className="text-sm font-extrabold text-red-500 mb-6">
              <b>{t("roles.deleteCannot")}</b>
            </p>
            <div className="mb-4">
              <p className="text-xl font-black text-red-500 mb-2">"{forum.name}"</p>
              <p className="text-sm font-semibold mb-2">
                {t("deleteCategory.messageD")}
              </p>
              <Input
                placeholder={t("deleteCourse.camp")}
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className={`bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md transition-all duration-300 ${
                  isConfirmDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#ff2f22]"
                }`}
                onClick={confirmDeleteCategory}
                disabled={isConfirmDisabled}
              >
                {t("roles.confirm")}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DeleteForumCategory;