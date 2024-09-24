import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";
import {
  ReloadOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import LeftBar from "../LeftBar";
import Navbar from "../NavBar";
import DetailsUserModal from "./UserDetailsModal";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { useUserContext } from "../../../context/user/user.context";
import { useRoleContext } from "../../../context/user/role.context";
import { useTranslation } from 'react-i18next';

const DataTable = () => {
  const { t } = useTranslation("global");
  const { rolesData } = useRoleContext();
  const { getUsers, usersData, activateAccount, updateUser, createUser } =
    useUserContext();
  const [updatedDataFlag, setUpdatedDataFlag] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [form] = Form.useForm();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

  useEffect(() => {
    getUsers();
  }, [updatedDataFlag]);

  useEffect(() => {
    if (updatedDataFlag) {
      setUpdatedDataFlag(false);
    }
  }, [usersData, updatedDataFlag]);

  useEffect(() => {
    if (selectedUserId) {
      setSelectedUser(usersData.find((user) => user._id === selectedUserId));
    }
  }, [selectedUserId, usersData]);

  useEffect(() => {
    form.setFieldsValue({
      username: selectedUser?.username,
      email: selectedUser?.email,
      role: selectedUser?.role,
      state: selectedUser?.state ? true : false,
    });
  }, [selectedUser, form]);

  const filteredUsers = usersData.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const handleActivateAccount = (userId) => {
    setUpdatedDataFlag(true);
    activateAccount(userId);
  };

  const orderBy = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    let sortableData = [...usersData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData()
    .filter((item) => filteredUsers.includes(item))
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateButtonClick = (item) => {
    setSelectedUser(item);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedUser(null);
  };

  const handleCreateFormSubmit = async (values) => {
    try {
      await createUser(values);
      form.resetFields();
      setShowCreateModal(false);
      setUpdatedDataFlag(true); // Agregar esta línea para actualizar la tabla después de crear un usuario
    } catch (error) {
      console.error(error);
    }
  };

  const generateIds = () => {
    return currentItems.map(
      (_, index) => index + 1 + (currentPage - 1) * itemsPerPage
    );
  };

  const handleUpdateUser = (values) => {
    const { username, email, role, state } = values;
    updateUser(selectedUser._id, { username, email, role, state });
    setShowUpdateModal(false);
    setUpdatedDataFlag(true);
    setSelectedUser(null);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="bg-gray-300 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar className="" />
          <div className="flex flex-col mt-10">
            <div>
              <h2 className="text-2xl font-black  text-black text-center">
                {t("datatable.Users")}
              </h2>
              <div className="flex flex-col items-center justify-center mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  onClick={() => setShowCreateModal(true)}
                  className="text-center font-medium text-base"
                >
                  <b>{t("datatable.CreateUser")}</b>
                </Button>
                <Input
                  placeholder={t("datatable.SearchByName")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-40 text-center font-medium text-base mt-2"
                />
              </div>
            </div>
            <div className="mt-10 flex justify-center">
            <div className="overflow-auto w-full px-4">
              <table className="min-w-full overflow-x-auto">
                <thead>
                  <tr>
                    <th
                      className="text-xl px-3 py-3 bg-blue-500 text-white border-2 cursor-pointer border-blue-800"
                      onClick={() => orderBy("id")}
                    >
                      {t("datatable.ID")}{" "}
                    </th>
                    <th
                      className="text-xl px-8 py-3  bg-yellow-500 text-white border-2 cursor-pointer border-blue-800"
                      onClick={() => orderBy("role")}
                    >
                      {t("datatable.Role")}{" "}
                      {sortConfig.key === "role" &&
                        (sortConfig.direction === "ascending" ? (
                          <CaretUpOutlined />
                        ) : (
                          <CaretDownOutlined />
                        ))}
                    </th>
                    <th
                      className="text-xl px-6 py-3 bg-green-500 text-white border-2 cursor-pointer border-blue-800"
                      onClick={() => orderBy("username")}
                    >
                      {t("datatable.Name")}{" "}
                      {sortConfig.key === "username" &&
                        (sortConfig.direction === "ascending" ? (
                          <CaretUpOutlined />
                        ) : (
                          <CaretDownOutlined />
                        ))}
                    </th>
                    <th
                      className="text-xl px-10 py-3 bg-purple-500 text-white border-2 cursor-pointer border-blue-800"
                      onClick={() => orderBy("email")}
                    >
                      {t("datatable.Email")}{" "}
                    </th>
                    <th
                      className="text-xl px-10 py-3 bg-gray-500 text-white border-2 cursor-pointer border-blue-800"
                      onClick={() => orderBy("state")}
                    >
                      {t("datatable.Status")}{" "}  
                    </th>
                    <th className="px-40 py-3 bg-red-500 text-white text-xl border-2 border-blue-800">
                      {t("datatable.Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item._id}>
                      <td className="border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1 font-black text-center">
                        {generateIds()[index]}
                      </td>
                      <td className=" text-center border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1">
                        {item.role}
                      </td>
                      <td className="border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1 text-center">
                        {item.username}
                      </td>
                      <td className=" text-center border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1">
                        {item.email}
                      </td>
                      <td className="text-center border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1">
                        {item.state ? t("datatable.Active") : t("datatable.Inactive")}
                      </td> 
                      <td className="border-2 border-blue-800 px-6 py-2 bg-gray-300 text-lg text-black mt-1 text-center ">
                        <button 
                          onClick={() => handleActivateAccount(item._id)}
                          className={`${
                            item.state
                              ? "bg-red-500 hover:bg-red-700"
                              : "bg-green-500 hover:bg-green-700"
                          } text-white font-bold py-2 px-4 rounded flex-1  `}
                        >
                          {item.state ? t("datatable.Desactivate") : t("datatable.Activate")}
                        </button>
                        <button
                          onClick={() => handleUpdateButtonClick(item)}
                          className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded ml-2 flex-1"
                        >
                          {t("datatable.Update")}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserId(item._id);
                            setShowDetailsModal(true);
                          }}
                          className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-2 px-4 rounded ml-2 flex-1"
                        >
                          <InfoCircleOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
            {totalPages > 1 && (
            <div className="flex justify-center mt-10 mb-10">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
              >
                {t("datatable.Previous")}
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === index + 1
                      ? "bg-black border text-white"
                      : "bg-gray-200 text-gray-800 border"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
              >
                {t("datatable.Next")}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>

      <CreateUserModal
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onCreate={handleCreateFormSubmit}
        rolesData={rolesData}
      />

      <UpdateUserModal 
        visible={showUpdateModal}
        onCancel={handleCloseUpdateModal}
        onUpdate={handleUpdateUser}
        user={selectedUser}
        rolesData={rolesData}
        form={form}
      />

      <DetailsUserModal
        visible={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default DataTable;
