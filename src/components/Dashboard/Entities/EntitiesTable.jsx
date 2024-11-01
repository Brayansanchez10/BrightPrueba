import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";

import LeftBar from "../../Dashboard/LeftBar";
import Navbar from "../NavBar";

import Swal from "sweetalert2";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { ReloadOutlined, InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import CreateEntityModal from "./createEntity.jsx";
import UpdateEntityModal from "./updateEntity.jsx";
import DeleteEntityModal from "./deleteEntity.jsx";
import DetailsEntityModal from "./detailsEntity.jsx";

import { useTranslation } from "react-i18next";
import { useEntity } from "../../../context/user/entities.context";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";

const DataTablete = () => {
    const { t } = useTranslation("global");
    const { getEntity, createEntity, updateEntity, deleteEntity, entity } = useEntity();
    const [dataFlag, setDataFlag] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [form] = Form.useForm();

    const [showEntityForm, setShowEntityForm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        getEntity();
    }, []);

    useEffect(() => {
        const filteredEntity= entity.filter(
            (entities) =>
                (entities.name && entities.name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (entities.type && entities.type.toLowerCase().includes(searchValue.toLowerCase()))
        );
    
        setTotalItems(filteredEntity.length);
        setTotalPages(Math.ceil(filteredEntity.length / itemsPerPage));
    }, [entity, searchValue, itemsPerPage]);

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
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generateIds = () => {
        const filteredEntity = entity.filter(
            (entities) =>
                (entities.name && entities.name.toLowerCase().includes(searchValue.toLowerCase())) ||
                (entities.type && entities.type.toLowerCase().includes(searchValue.toLowerCase()))
        );
    
        return filteredEntity
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
    };
    
    const filteredEntity = entity.filter(
        (entities) =>
            (entities.name && entities.name.toLowerCase().includes(searchValue.toLowerCase())) ||
            (entities.type && entities.type.toLowerCase().includes(searchValue.toLowerCase()))
    );

    const handleCreateEntityClick = () => {
        setSelectedEntity(null);
        setShowEntityForm(true);
    };

    const handleEntityFormClose = async () => {
        try {
            await getEntity();
            setShowEntityForm(false);
        } catch (error) {
            console.error("Error creating Entity: ", error);
        }
    };

    const handleDelete = (entities) => {
        setSelectedEntity(entities.id);
        setShowDeleteModal(true);
    };
    

    const handleUpdateSubmit = async (values) => {
        try {
          await updateEntity(selectedEntity.id, values);
          Swal.fire({
            title: t("categories.updateSuccess"),
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(error);
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

    const handleUpdateButtonClick = (entities) => {
        setSelectedEntity(entities);
        form.setFieldsValue({
          name: entities.name,
          type: entities.type,
        });
        setShowUpdateModal(true);
    };
    
    const handleUpdateModalClose = async () => {
        try {
            await getEntity();
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error creating Entity: ", error);
        }
    };


    const handleDetailsButtonClick = (entities) => {
        setSelectedEntity(entities);
        setShowDetailsModal(true);
    };
    
    const handleDetailsModalClose = () => {
        setShowDetailsModal(false);
        selectedEntity(null);
    };

    return (
        <div className="bg-primaryAdmin overflow-hidden min-h-screen">
            <div className="flex h-full">
                <LeftBar onVisibilityChange={setIsLeftBarVisible} />
                <div
                    className={`w-full transition-all duration-300 ${isLeftBarVisible ? "ml-56 max-w-full" : ""}`}
                >
                    <Navbar />
                    <div className="flex flex-col mt-14">
                        <div className="px-4 md:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-2">
                                <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee mb-4 md:mb-0">
                                    {t("entities.title")}
                                </h2>
                                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: "#4c1d95" }}
                                            className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                                            onClick={handleCreateEntityClick}
                                        >
                                            <b>{t("entities.createEntity")}</b>
                                        </Button>
                                    
                                    <div className="flex w-full md:w-auto px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-lg order-1 md:order-2">
                                        <FaSearch size={"18px"} className="mt-1 mr-2" />
                                        <input
                                            type="search"
                                            className="bg-white outline-none w-full md:w-[280px] lg:w-[360px]"
                                            placeholder={t("datatable.SearchByName")}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 md:mt-2">
                            <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                                <table className="min-w-full overflow-x-auto">
                                    <thead>
                                        <tr>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.id")}
                                            </th>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.name")}
                                            </th>
                                            <th className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("entities.type")}
                                            </th>
                                            <th className="py-3 bg-secondaryAdmin text-primary text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                {t("categories.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEntity
                                            .slice(
                                                (currentPage - 1) * itemsPerPage,
                                                currentPage * itemsPerPage
                                            )
                                            .map((entities) => (
                                                <tr key={entities.id}>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {entities.id}
                                                    </td>
                                                    <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {entities.name}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        {entities.type}
                                                    </td>
                                                    <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                                                        <div className="flex justify-center space-x-4">

                                                                <Button
                                                                    className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                                                    icon={<ReloadOutlined />}
                                                                    style={{ minWidth: "50px" }}
                                                                    onClick={() =>
                                                                        handleUpdateButtonClick(entities)
                                                                    }
                                                                />

                                                                <Button
                                                                    className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                                    icon={<InfoCircleOutlined />}
                                                                    style={{ minWidth: "50px" }}
                                                                    onClick={() => handleDetailsButtonClick(entities)}
                                                                />

                                                                <Button
                                                                    className="bg-red-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => handleDelete(entities)} 
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
                                            className={`py-1 px-2 rounded-full text-white ${currentPage === 1 ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-800"}`}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <div className="text-lg font-semibold">{currentPage}</div>
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`py-1 px-2 rounded-full text-white ${currentPage === totalPages ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-800"}`}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <CreateEntityModal 
                        visible={showEntityForm}
                        onClose={handleEntityFormClose}
                        onCreate={() => setShowEntityForm(false)}
                        form={form}
                        entities={selectedEntity}
                    />
                    <UpdateEntityModal 
                        visible={showUpdateModal}
                        onClose={handleUpdateModalClose}
                        onUpdate={handleUpdateSubmit}
                        entities={selectedEntity}
                        form={form}
                        entity={entity}
                    />
                    <DetailsEntityModal
                        visible={showDetailsModal}
                        onClose={handleDetailsModalClose}
                        entities={selectedEntity}
                    />

                    <DeleteEntityModal 
                        visible={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        entities={selectedEntity}
                        deleteEntity = {deleteEntity}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataTablete;