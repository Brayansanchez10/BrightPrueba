import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftBar from "../../Dashboard/LeftBar";
import { Button, Form } from "antd";
import Swal from "sweetalert2";
import Navbar from "../NavBar";
import { useForumCategories } from "../../../context/forum/forumCategories.context";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { ReloadOutlined, InfoCircleOutlined, DeleteOutlined, } from "@ant-design/icons";

const DataTablete = () => {
    const { t } = useTranslation("global");
    const { categories, getAllForumCategories, deleteForumCategory } = useForumCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dataFlag, setDataFlag] = useState(false);
    const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
    const [form] = Form.useForm();

    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1)
    
    //Modal de creación
    

    useEffect(() => {
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

      const handleRemove = async (category) => {
        try {
            await deleteForumCategory(category.id);
            Swal.fire({
                icon: "success",
                title: t("Topic.topicDelete"),
                showConfirmButton: false,
                timer: 700,
            });
            setDataFlag((prevFlag) => !prevFlag);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: t("Topic.topicDeleteError"),
                showConfirmButton: false,
                timer: 1000,
            });
        }
      };

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
                                    {t("Foro Categorias")}
                                </h2>
                                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: "#4c1d95" }}
                                        className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                                    >
                                        <b>{t("Crear Categoria")}</b>
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
                                                {t("id")}
                                            </th>
                                            <th className="text-lg py-3  bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                                                {t("name")}
                                            </th>
                                            <th className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                                                {t("description")}
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
                                                    />
                                                    <Button
                                                        className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                        icon={<InfoCircleOutlined />}
                                                        style={{ minWidth: "50px" }}
                                                    />
                                                    <Button
                                                        className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                        icon={<DeleteOutlined />}
                                                        style={{ minWidth: "50px" }}
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


                </div>
            </div>
        </div>
      );
};

export default DataTablete;