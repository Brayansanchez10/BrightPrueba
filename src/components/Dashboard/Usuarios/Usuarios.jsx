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
import { useAuth } from "../../../context/auth.context";
import { useRoleContext } from "../../../context/user/role.context";
import { usePermissionContext } from "../../../context/user/permissions.context";
import { useTranslation } from "react-i18next";

const DataTable = () => {
  const { t } = useTranslation("global");
  const { rolesData } = useRoleContext();
  const { getUsers, usersData, activateAccount, updateUser, createUser, getUserById } =
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

  const [username, setUsername] = useState("");
  const { user } = useAuth();

  const { permissionsData, rolePermissions, loading, error, getPermissionsByRole } = usePermissionContext();
  const [ permisosByRol, setPermisosByRol ] = useState("");

  const [entityId, setEntityId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getUsers();
  }, [updatedDataFlag]);

  useEffect(() => {
    const fetchUserData = async () => {
        if (user && user.data && user.data.id) {
            try {
                // Obtener datos del usuario
                const userData = await getUserById(user.data.id);
                setUsername(userData.username); // Guarda el nombre de usuario (u otra información)

                // Guarda el entityId del usuario
                setEntityId(userData.entityId); // Asegúrate de tener este estado definido
                
                // Si el usuario tiene un roleId, obtener los permisos
                if (userData.roleId) {
                    const permisos = await getPermissionsByRole(userData.roleId); // Asegúrate de que esta función retorna los permisos
                    setPermisosByRol(permisos || []); // Si permisos es undefined, establece un array vacío
                    console.log("Permisos del rol", permisos);
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario o permisos del rol:", error);
                setError("Error al obtener datos del usuario o permisos del rol.");
            }
        }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const filteredUser = usersData.filter(
      (item) =>
        item.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.password.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.role.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.documentNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.firstNames.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.lastNames.toLowerCase().includes(searchValue.toLowerCase()) 
    );

    setTotalItems(filteredUser.length);
    setTotalPages(Math.ceil(filteredUser.length / itemsPerPage));
  }, [usersData, searchValue, itemsPerPage]);

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
      firstNames: selectedUser?.firstNames,
      lastNames: selectedUser?.lastNames,
      email: selectedUser?.email,
      documentNumber: selectedUser?.documentNumber,
      role: selectedUser?.role,
      state: selectedUser?.state ? true : false,
      entityId: selectedUser?.entityId,
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

  // Lógica de filtrado y paginación
  const generateIds = () => {
    const searchFiltered = usersData.filter((item) => 
      item.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.role.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.documentNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.firstNames.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.lastNames.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Filtrado por `entityId`, solo si `entityId` es distinto de `1`
    const entityFilteredCourses = entityId !== 1 
      ? searchFiltered.filter((item) => item.entityId === entityId) 
      : searchFiltered;

    // Paginación
    const paginated = entityFilteredCourses.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return paginated.map((_, index) => index + 1 + (currentPage - 1) * itemsPerPage);
  };

  // Filtrado general de usuarios
  const filteredUser = usersData.filter((item) => 
    (item.username && item.username.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.email && item.email.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.role && item.role.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.documentNumber && item.documentNumber.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.firstNames && item.firstNames.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.lastNames && item.lastNames.toLowerCase().includes(searchValue.toLowerCase()))
  ).filter((item) => 
    entityId === 1 || item.entityId === entityId
  );
  const handleUpdateUser = (values) => {
    const { username, firstNames, lastNames, email, documentNumber, role, state, entityId } = values;
    updateUser(selectedUser.id, { username, firstNames, lastNames, email, documentNumber, role, state, entityId });
    setShowUpdateModal(false);
    setUpdatedDataFlag(true);
    setSelectedUser(null);
  };


  if (loading) return <p>Cargando permisos del rol...</p>;
  if (error) return <p>{error}</p>;

  // Ejemplo de cómo ocultar botones según los permisos
  const canCreate = rolePermissions.some(perm => perm.nombre === "Crear usuario");
  const canActive = rolePermissions.some(perm => perm.nombre === "Activar usuario");
  const canEdit = rolePermissions.some(perm => perm.nombre === "Editar usuario");
  const canShow = rolePermissions.some(perm => perm.nombre === "Ver usuario");

  return (
    <div className="bg-primaryAdmin overflow-hidden min-h-screen">
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
                <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee mb-4 md:mb-0">
                  {t("datatable.Users")}
                </h2>
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                  {canCreate &&
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#4c1d95" }}
                      onClick={() => setShowCreateModal(true)}
                      className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                    >
                      <b>{t("datatable.CreateUser")}</b>
                    </Button>
                  }
                  
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

            {/* Tabla */}
            <div className="flex justify-center mt-4 md:mt-2">
              <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
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
                        className="text-lg py-3  bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
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
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
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
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
                        onClick={() => orderBy("firstNames")}
                      >
                        {t("datatable.FirstNames")}{" "}
                        {sortConfig.key === "firstNames" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
                        onClick={() => orderBy("lastNames")}
                      >
                        {t("datatable.LastNames")}{" "}
                        {sortConfig.key === "lastNames" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
                        onClick={() => orderBy("documentNumber")}
                      >
                        {t("datatable.DocumentNumber")}{" "}
                        {sortConfig.key === "documentNumber" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
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
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
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
                      <th className="py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("datatable.Actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredUser
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((item, index) => (
                      <tr key={item.id}>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.id}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.role}
                        </td>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.username}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.firstNames}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.lastNames}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.documentNumber}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          {item.email}
                        </td>
                        <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          <div className="flex items-center justify-center">
                            {item.state ? (
                              <FaCircle
                                size="14px"
                                className="text-green-500 mr-2 flex-shrink-0"
                              />
                            ) : (
                              <FaCircle
                                size="14px"
                                className="text-red-500 mr-2 flex-shrink-0"
                              />
                            )}
                            <span className="whitespace-nowrap">
                              {item.state
                                ? t("datatable.Active")
                                : t("datatable.Inactive")}
                            </span>
                          </div>
                        </td>
                        <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                          <div className="flex flex-nowrap justify-center space-x-2">
                            {canActive &&
                              <Button
                                onClick={() => handleActivateAccount(item.id)}
                                className={`${
                                  item.state
                                    ? "bg-red-500 hover:bg-red-700"
                                    : "bg-green-500 hover:bg-green-700"
                                } text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400 whitespace-nowrap`}
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
                            }
                            {canEdit &&
                              <Button
                                onClick={() => handleUpdateButtonClick(item)}
                                className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                style={{ minWidth: "50px" }}
                                icon={<ReloadOutlined />}
                              />
                            }
                            
                            {canShow &&
                              <Button
                                onClick={() => {
                                  setSelectedUserId(item.id);
                                  setShowDetailsModal(true);
                                }}
                                className="bg-purple-500 hover:bg-zinc-300 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                style={{ minWidth: "50px" }}
                                icon={<InfoCircleOutlined />}
                              />
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="flex justify-end items-center mt-5 space-x-2">
                    <span className="text-gray-500">
                      {`${(currentPage - 1) * itemsPerPage + 1} - ${
                        currentPage * itemsPerPage > totalItems
                          ? totalItems
                          : currentPage * itemsPerPage
                      }`}{" "}
                      {t("datatable.of")} {totalItems}
                    </span>
                    <div className="flex">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 rounded-full ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-800 dark:text-primary"
                        }`}
                      >
                        <FaChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 rounded-full ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-800 dark:text-primary"
                        }`}
                      >
                        <FaChevronRight size={18} />
                      </button>
                    </div>
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
