import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import { ReloadOutlined, InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useCategoryContext } from "../../../context/courses/category.context";
import CreateCategoryForm from "./CreateCategoryForm";
import Navbar from "../NavBar";
import DeleteCategory from "./DeleteCategory";
import DetailsCategoryModal from "./DetailsCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';

const DataTablete = () => {
  const { t } = useTranslation("global");
  const { getCategories, categories, deleteCategory, createCategory, updateCategory } = useCategoryContext();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const pagesToShow = 1;
  const [dataFlag, setDataFlag] = useState(false)

  useEffect(() => {
    getCategories();
  }, [dataFlag]);

  useEffect(() => {
    const filteredCategory = categories.filter(category =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTotalPages(Math.ceil(filteredCategory.length / itemsPerPage));
  }, [categories, searchValue, itemsPerPage]);

  const handleCreateCategory = async (category) => {
    try {
      await createCategory(category);
      Swal.fire({
        title: t("categories.createSuccess"),
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      setDataFlag(prevFlag => !prevFlag);  // Cambiamos el flag
    } catch (error) {
      Swal.fire({
        title: t("categories.createError"),
        icon: 'error',
        timer: 1500,
        showConfirmButton: true
      });
    } finally {
      setShowCategoryForm(false);
    }
  };

  const handleUpdateSubmit = async (values) => {
    try {
      await updateCategory(selectedCategory._id, values);
      Swal.fire({
        title: t("categories.updateSuccess"),
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      setDataFlag(prevFlag => !prevFlag);  // Cambiamos el flag
    } catch (error) {
      Swal.fire({
        title: t("categories.updateError"),
        icon: 'error',
        timer: 1500,
        showConfirmButton: true
      });
    } finally {
      handleUpdateModalClose();
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(categoryToDelete._id);
      Swal.fire({
        title: t("categories.deleteSuccess"),
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      setDataFlag(prevFlag => !prevFlag);  // Cambiamos el flag
    } catch (error) {
      Swal.fire({
        title: t("categories.deleteError"),
        icon: 'error',
        timer: 1500,
        showConfirmButton: true
      });
    } finally {
      setIsDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const getVisiblePageNumbers = () => {
    const pages = [];
    const half = Math.floor(pagesToShow / 1);
  
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);
  
    if (currentPage <= half) {
      end = Math.min(totalPages, end + (half - currentPage + 1));
    }
  
    if (totalPages - currentPage < half) {
      start = Math.max(1, start - (half - (totalPages - currentPage)));
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  };

  const handleCreateCategoryClick = () => {
    setSelectedCategory(null);
    setShowCategoryForm(true);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setSelectedCategory(null);
  };

  const handleDetailsButtonClick = (category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedCategory(null);
  };

  const handleUpdateButtonClick = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setImagePreview(category.image);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setSelectedCategory(null);
    form.resetFields();
    setImagePreview(null);
  };

  const handleDeleteButtonClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setCategoryToDelete(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateIds = () => {
    const filteredCategory = categories.filter(category =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredCategory
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  const filteredCategory = categories.filter(category =>
    category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    category.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${isLeftBarVisible ? "ml-56 max-w-full" : ""}`}
        >
          <Navbar />
          <div className="flex flex-col mt-6 px-4">
            <div>
              <h2 className="text-2xl font-black text-white text-center">{t("categories.title")}</h2>
              <div className="flex flex-col items-center justify-center mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  onClick={handleCreateCategoryClick}
                  className="text-center font-medium text-base mt-2"
                >
                  <b>{t("categories.createCategory")}</b>
                </Button>
                <Input
                  placeholder={t("categories.searchPlaceholder")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-44 text-center font-medium text-base mt-2"
                />
              </div>
              <div className="mt-10 flex justify-center">
                <div className="overflow-auto w-full">
                  <table className="min-w-full overflow-x-auto">
                    <thead>
                      <tr>
                        <th className="text-xl px-3 py-3 bg-blue-500 text-white border-2 cursor-pointer border-blue-800">{t("categories.id")}</th>
                        <th className="text-xl px-6 py-3 bg-green-500 text-white border-2 cursor-pointer border-blue-800">{t("categories.name")}</th>
                        <th className="text-xl px-20 py-3 bg-purple-500 text-white border-2 cursor-pointer border-blue-800">{t("categories.description")}</th>
                        <th className="text-xl px-10 py-3 bg-red-500 text-white border-2 border-blue-800">{t("categories.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategory
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((category, index) => (
                          <tr key={category._id}>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-center font-black">
                              {generateIds()[index]}
                            </td>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-center">{category.name}</td>
                            <td className="border-2 border-blue-800 bg-gray-300 text-lg text-black mt-1 text-wrap px-1">{category.description}</td>
                            <td className="border-2 border-blue-800 px-1 py-2 bg-gray-300">
                              <div className="flex justify-center space-x-4">
                                <Button
                                  className="mb-2 bg-blue-500 h-10 text-lg text-white"
                                  icon={<ReloadOutlined />}
                                  onClick={() => handleUpdateButtonClick(category)}
                                />
                                <Button
                                  className="bg-purple-600 text-white text-lg h-10"
                                  icon={<InfoCircleOutlined />}
                                  onClick={() => handleDetailsButtonClick(category)}
                                />
                                <Button
                                  className="bg-red-500 h-10 text-lg text-white"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteButtonClick(category)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <CreateCategoryForm
            visible={showCategoryForm}
            onClose={handleCategoryFormClose}
            onCreate={handleCreateCategory}
            category={selectedCategory}
          />

          <DeleteCategory
            visible={isDeleteModalVisible}
            onClose={handleDeleteModalClose}
            onConfirm={handleDeleteConfirm}
          />

          <DetailsCategoryModal
            visible={showDetailsModal}
            onClose={handleDetailsModalClose}
            category={selectedCategory}
          />

          <UpdateCategoryModal
            visible={showUpdateModal}
            onClose={handleUpdateModalClose}
            onUpdate={handleUpdateSubmit}
            category={selectedCategory}
            form={form}
            imagePreview={imagePreview}
          />
          {totalPages > 1 && (
            <div className="flex justify-center mx-auto mb-4 mt-8 space-x-2 items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-800 border"
              >
                {t("categories.previous")}
              </button>
              {getVisiblePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 ${currentPage === page ? "bg-black border text-white" : "bg-gray-200 text-gray-800 border"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-800 border"
              >
                {t("categories.next")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
