import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import LeftBar from "../LeftBar";
import Navbar from "../NavBar";
import DetailsUserModal from "./UserDetailsModal";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { useUserContext } from "../../../context/user/user.context";
import { useRoleContext } from "../../../context/user/role.context";
import { useTranslation } from "react-i18next";

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
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
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
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerPage(6);
      } else if (width < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(10);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updatedDataFlag]);

  useEffect(() => {
    if (selectedUserId) {
      setSelectedUser(usersData.find((user) => user.id === selectedUserId));
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

  useEffect(() => {
    setTotalItems(filteredUsers.length);
  }, [filteredUsers]);

  const handleActivateAccount = (userId) => {
    setUpdatedDataFlag(true);
    activateAccount(userId);
  };

  const orderBy = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
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
      setUpdatedDataFlag(true);
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
    updateUser(selectedUser.id, { username, email, role, state });
    setShowUpdateModal(false);
    setUpdatedDataFlag(true);
    setSelectedUser(null);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="bg-gray-200 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar className="" />
          <div className="flex flex-col mt-14">
            <div className="px-4 md:px-12">
              <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-2">
                <h2 className="text-3xl text-purple-900 font-bungee mb-4 md:mb-0">
                  {t("datatable.Users")}
                </h2>
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#4c1d95" }}
                    onClick={() => setShowCreateModal(true)}
                    className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                  >
                    <b>{t("datatable.CreateUser")}</b>
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

            {/* Tabla */}
            <div className="flex justify-center mt-4 md:mt-2">
              <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-white rounded-xl shadow-lg shadow-purple-300">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th
                        className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200"
                        onClick={() => orderBy("id")}
                      >
                        {t("datatable.ID")}{" "}
                        {sortConfig.key === "id" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3  bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200"
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
                        className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200"
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
                        className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200"
                        onClick={() => orderBy("email")}
                      >
                        {t("datatable.Email")}{" "}
                        {sortConfig.key === "email" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3 bg-white border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200"
                        onClick={() => orderBy("state")}
                      >
                        {t("datatable.Status")}{" "}
                        {sortConfig.key === "state" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th className="py-3 bg-white text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200">
                        {t("datatable.Actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                          {item.id}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black border-t-transparent border-b-cyan-200">
                          {item.role}
                        </td>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                          {item.username}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black border-t-transparent border-b-cyan-200">
                          {item.email}
                        </td>
                        <td className="pl-14 border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black border-t-transparent border-b-cyan-200">
                          {item.state ? (
                            <FaCircle
                              size="14px"
                              className="text-green-500 -mb-[21px] -ml-8"
                            />
                          ) : (
                            <FaCircle
                              size="14px"
                              className="text-red-500 -mb-[21px] -ml-8"
                            />
                          )}
                          {item.state
                            ? t("datatable.Active")
                            : t("datatable.Inactive")}
                        </td>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-white text-lg text-black text-center border-t-transparent border-b-cyan-200">
                          <Button
                            onClick={() => handleActivateAccount(item.id)}
                            className={`${
                              item.state
                                ? "bg-red-500 hover:bg-red-700"
                                : "bg-green-500 hover:bg-green-700"
                            } text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400`}
                            style={{ minWidth: "120px" }}
                          >
                            {item.state ? (
                              <>
                                <FaUserTimes
                                  size="16px"
                                  className="inline-block mr-1.5 -mt-1"
                                />
                                {t("datatable.Desactivate")}
                              </>
                            ) : (
                              <>
                                <FaUserCheck
                                  size="16px"
                                  className="inline-block mr-1.5 -mt-1"
                                />
                                {t("datatable.Activate")}
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={() => handleUpdateButtonClick(item)}
                            className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                            style={{ minWidth: "50px" }}
                            icon={<ReloadOutlined />}
                          ></Button>

                          <Button
                            onClick={() => {
                              setSelectedUserId(item.id);
                              setShowDetailsModal(true);
                            }}
                            className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl ml-2 shadow-md shadow-gray-400"
                            style={{ minWidth: "50px" }}
                            icon={<InfoCircleOutlined />}
                          ></Button>
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
