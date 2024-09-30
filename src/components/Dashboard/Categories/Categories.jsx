import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LeftBar from "../../Dashboard/LeftBar";
import { useCategoryContext } from "../../../context/courses/category.context";
import CreateCategoryForm from "./CreateCategoryForm";
import Navbar from "../NavBar";
import DeleteCategory from "./DeleteCategory";
import DetailsCategoryModal from "./DetailsCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import {
  FaArrowAltCircleLeft,
  FaArrowCircleLeft,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

const DataTablete = () => {
  const { t } = useTranslation("global");
  const {
    getCategories,
    categories,
    deleteCategory,
    createCategory,
    updateCategory,
  } = useCategoryContext();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0); 
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
  const [dataFlag, setDataFlag] = useState(false);

  useEffect(() => {
    getCategories();
  }, [dataFlag]);

  useEffect(() => {
    const filteredCategory = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTotalItems(filteredCategory.length); 
    setTotalPages(Math.ceil(filteredCategory.length / itemsPerPage));
  }, [categories, searchValue, itemsPerPage]);

  const handleCreateCategory = async (category) => {
    try {
      await createCategory(category);
      Swal.fire({
        title: t("categories.createSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag); 
    } catch (error) {
      Swal.fire({
        title: t("categories.createError"),
        icon: "error",
        timer: 1500,
        showConfirmButton: true,
      });
    } finally {
      setShowCategoryForm(false);
    }
  };

  const handleUpdateSubmit = async (values) => {
    try {
      await updateCategory(selectedCategory.id, values);
      Swal.fire({
        title: t("categories.updateSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag); 
    } catch (error) {
      Swal.fire({
        title: t("categories.updateError"),
        icon: "error",
        timer: 1500,
        showConfirmButton: true,
      });
    } finally {
      handleUpdateModalClose();
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      Swal.fire({
        title: t("categories.deleteSuccess"),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setDataFlag((prevFlag) => !prevFlag);
    } catch (error) {
      Swal.fire({
        title: t("categories.deleteError"),
        icon: "error",
        timer: 1500,
        showConfirmButton: true,
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
    const filteredCategory = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        category.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filteredCategory
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  const filteredCategory = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="bg-gray-200 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar />
          <div className="flex flex-col mt-14">
            <div>
              <div className="flex flex-row items-center justify-between pl-[72px] pr-12">
                <h2 className="text-3xl text-purple-900 font-bungee">
                  {t("categories.title")}
                </h2>
                <div className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg">
                  <FaSearch size={"18px"} className="mt-1 mr-2" />
                  <input
                    type="search"
                    className="outline-none w-full md:w-[280px] lg:w-[360px]"
                    placeholder={t("datatable.SearchByName")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: "#4c1d95" }}
                onClick={handleCreateCategoryClick}
                className="text-center font-medium text-base ml-[72px]"
              >
                <b>{t("categories.createCategory")}</b>
              </Button>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="overflow-auto w-full px-6 mx-12 py-6 bg-white rounded-t-xl rounded-b-xl shadow-lg shadow-purple-300">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="text-lg px-3 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.id")}
                      </th>
                      <th className="text-lg px-8 py-3  bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.name")}
                      </th>
                      <th className="text-lg px-6 py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.description")}
                      </th>
                      <th className="px-40 py-3 bg-white text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategory
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((category, index) => (
                        <tr key={category.id}>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            {generateIds()[index]}
                          </td>
                          <td className="text-center border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black border-t-transparent border-b-cyan-200">
                            {category.name}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            {category.description}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                            <div className="flex justify-center space-x-4">
                              <Button
                                className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl min-w-[120px] shadow-md shadow-gray-400"
                                icon={<ReloadOutlined />}
                                onClick={() =>
                                  handleUpdateButtonClick(category)
                                }
                              />
                              <Button
                                className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 min-w-[120px] shadow-md shadow-gray-400"
                                icon={<InfoCircleOutlined />}
                                onClick={() =>
                                  handleDetailsButtonClick(category)
                                }
                              />
                              <Button
                                className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 min-w-[120px] shadow-md shadow-gray-400"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  handleDeleteButtonClick(category)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex justify-end items-center mt-5 space-x-2">
                    {/* Botón anterior */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded-full ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-800"
                      }`}
                    >
                      <FaChevronLeft size={13} />
                    </button>

                    {/* Mostrar el rango actual */}
                    <span className="text-gray-600">
                      {`${(currentPage - 1) * itemsPerPage + 1} - ${
                        currentPage * itemsPerPage > totalItems
                          ? totalItems
                          : currentPage * itemsPerPage
                      }`}{" "}
                      {t("datatable.of")} {totalItems}
                    </span>

                    {/* Botón siguiente */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded-full ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-800"
                      }`}
                    >
                      <FaChevronRight size={13} />
                    </button>
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
