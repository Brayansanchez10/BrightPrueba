import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";
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
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

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
  const [itemsPerPage, setItemsPerPage] = useState(0);
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(6);
      } else if (width < 1024) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(12);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dataFlag]);

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
            <div className="px-4 md:px-12">
              <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-2">
                <h2 className="text-3xl text-purple-900 font-bungee mb-4 md:mb-0">
                  {t("categories.title")}
                </h2>
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#4c1d95" }}
                    onClick={handleCreateCategoryClick}
                    className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                  >
                    <b>{t("categories.createCategory")}</b>
                  </Button>
                  <div className="flex w-full md:w-auto px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg order-1 md:order-2">
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
              </div>
            </div>
            <div className="flex justify-center mt-4 md:mt-2">
              <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-white rounded-xl shadow-lg shadow-purple-300">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.id")}
                      </th>
                      <th className="text-lg py-3  bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.name")}
                      </th>
                      <th className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("categories.description")}
                      </th>
                      <th className="py-3 bg-white text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
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
                            {category.id}
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
                                className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                icon={<ReloadOutlined />}
                                style={{ minWidth: "50px" }}
                                onClick={() =>
                                  handleUpdateButtonClick(category)
                                }
                              />
                              <Button
                                className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                icon={<InfoCircleOutlined />}
                                style={{ minWidth: "50px" }}
                                onClick={() =>
                                  handleDetailsButtonClick(category)
                                }
                              />
                              <Button
                                className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                icon={<DeleteOutlined />}
                                style={{ minWidth: "50px" }}
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
                    <span className="text-gray-600">
                      {`${(currentPage - 1) * itemsPerPage + 1} - ${
                        currentPage * itemsPerPage > totalItems
                          ? totalItems
                          : currentPage * itemsPerPage
                      }`}{" "}
                      {t("datatable.of")} {totalItems}
                    </span>
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
            imagePre
            view={imagePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTablete;
