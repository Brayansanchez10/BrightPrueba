import React, { useState, useEffect } from "react";
import LeftBar from "../../Dashboard/LeftBar";
import { Button, Form } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useRoleContext } from "../../../context/user/role.context";
import { usePermissionContext } from "../../../context/user/permissions.context";
import CreateRolForm from "../Roles/CreateRolForm";
import DeleteRolModal from "./DeleteRolModal";
import AssignPermissionsModal from "./AssignPermissionsModal";
import DetailsModal from "./DetailsModal";
import Navbar from "../../Dashboard/NavBar";
import { useTranslation } from "react-i18next";
import "../css/Custom.css";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../../../context/auth.context";
import { useUserContext } from "../../../context/user/user.context";

const { useForm } = Form;

const DataTable = () => {
  const { t } = useTranslation("global");
  const [form] = useForm();
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  
  const { getUserById } = useUserContext();
 

  const { rolesData, updateRole, deleteRole } = useRoleContext();
  const { permissionsData, rolePermissions, loading, error, getPermissionsByRole } = usePermissionContext();
  const [ permisosByRol, setPermisosByRol ] = useState("");

  const [permissionsUpdated, setPermissionsUpdated] = useState(false);
  const [updatedDataFlag, setUpdatedDataFlag] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

  // Estados para modales
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (selectedRoleId) {
      setSelectedRole(rolesData.find((role) => role.id === selectedRoleId));
    }
  }, [selectedRoleId, rolesData]);

  useEffect(() => {
    const fetchUserData = async () => {
        if (user && user.data && user.data.id) {
            try {
                // Obtener datos del usuario
                const userData = await getUserById(user.data.id);
                setUsername(userData.username); // Guarda el nombre de usuario (u otra información)
                
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
    form.setFieldsValue({
      name: selectedRole?.name,
      permissions: selectedRole?.permissions,
    });
  }, [selectedRole, form]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const filteredRoles = rolesData.filter((role) =>
    Object.values(role).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

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
    if (updatedDataFlag) {
      setUpdatedDataFlag(false);
    }
  }, [rolesData, updatedDataFlag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    setTotalItems(filteredRoles.length);
  }, [filteredRoles]);

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
    let sortableData = [...rolesData];
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

  const generateIds = () => {
    return rolesData.map((_, index) => index + 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData()
    .filter((item) => filteredRoles.includes(item))
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewPermissions = (role) => {
    setShowDetailsModal(true);
    setSelectedRoleId(role.id);
  };

  const handleDeleteRole = (roleId) => {
    setSelectedRoleId(roleId);
    setShowDeleteModal(true);
  };

  const [selectedPermissionsMap, setSelectedPermissionsMap] = useState({});

  const handleCheckboxChange = (roleId, permissionId) => {
    setSelectedPermissionsMap((prevMap) => {
      const selectedPermissions = prevMap[roleId] || [];
      const updatedPermissions = selectedPermissions.includes(permissionId)
        ? selectedPermissions.filter((id) => id !== permissionId)
        : [...selectedPermissions, permissionId];

      localStorage.setItem(roleId, JSON.stringify(updatedPermissions));

      return {
        ...prevMap,
        [roleId]: updatedPermissions,
      };
    });
  };

  useEffect(() => {
    const storedPermissionsMap = {};
    rolesData.forEach((role) => {
      const storedPermissions = JSON.parse(localStorage.getItem(role.id));
      if (storedPermissions) {
        storedPermissionsMap[role.id] = storedPermissions;
      }
    });
    setSelectedPermissionsMap(storedPermissionsMap);
  }, [rolesData]);

  const handleAssignPermissions = (role) => {
    setSelectedRoleId(role.id);
    setShowAssignModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsModal(false);
    setShowAssignModal(false);
    setSelectedRoleId(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleCreateRol = (role) => {
    console.log("Nuevo rol:", role);
    setShowForm(false);
  };

  const handleAssignPermissionsSubmit = async () => {
    try {
      if (selectedRole) {
        const permissionIdMap = {};
        permissionsData.info.forEach((permission) => {
          permissionIdMap[permission.nombre] = permission.id;
          setPermissionsUpdated(true);
        });

        const updatedPermissions = [
          ...new Set([
            ...(selectedRole.permissions || []).map(
              (nombre) => permissionIdMap[nombre]
            ),
            ...(selectedPermissionsMap[selectedRoleId] || []),
          ]),
        ];

        await updateRole(selectedRoleId, {
          nombre: selectedRole?.nombre,
          permisos: updatedPermissions,
        });

        setShowAssignModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (loading) return <p>Cargando permisos del rol...</p>;
  if (error) return <p>{error}</p>;

  // Ejemplo de cómo ocultar botones según los permisos
  const canCreate = rolePermissions.some(perm => perm.nombre === "Crear role");
  const canAssing = rolePermissions.some(perm => perm.nombre === "Asignar permisos");
  const canShow = rolePermissions.some(perm => perm.nombre === "Ver role");
  const canDelete = rolePermissions.some(perm => perm.nombre === "Eliminar role");
  
  

  return (
    <div className="bg-primaryAdmin overflow-hidden min-h-screen">
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
                <h2 className="text-3xl text-purple-900 dark:text-primary font-bungee mb-4 md:mb-0">
                  {t("roles.title")}
                </h2>
                <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                  {canCreate && 
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#4c1d95" }}
                      onClick={() => setShowForm(true)}
                      className="w-full md:w-auto rounded-lg order-2 md:order-1 mt-6 sm:mt-4 md:mt-0"
                    >
                      <b>{t("roles.createRole")}</b>
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
            <div className="flex justify-center mt-4 md:mt-2">
              <div className="overflow-auto w-full px-4 md:px-6 mx-4 md:mx-12 py-6 bg-secondaryAdmin rounded-xl shadow-lg shadow-purple-300 dark:shadow-purple-900">
                <table className="min-w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th
                        className="text-lg py-3 bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
                        onClick={() => orderBy("id")}
                      >
                        ID {""}
                        {sortConfig.key === "id" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th
                        className="text-lg py-3  bg-secondaryAdmin text-primary border-2 cursor-pointer border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]"
                        onClick={() => orderBy("nombre")}
                      >
                        {t("roles.role")} {""}
                        {sortConfig.key === "nombre" &&
                          (sortConfig.direction === "ascending" ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          ))}
                      </th>
                      <th className="py-3 bg-secondaryAdmin text-primary text-lg border-2 border-x-transparent font-bungee border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                        {t("roles.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesData &&
                      currentItems.map((role, index) => (
                        <tr key={role.id}>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                            {role.id}
                          </td>
                          <td className="text-center border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                            {role.nombre}
                          </td>
                          <td className="border-2 border-x-transparent px-6 py-2 bg-secondaryAdmin text-primary text-lg text-center border-t-transparent border-b-cyan-200 dark:border-b-[#00d8a257]">
                           <div className="flex justify-center space-x-2">
                             {canAssing &&
                              <Button
                                className="bg-green-500 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleAssignPermissions(role)}
                              />
                             }
                              {canShow &&
                                <Button
                                  className="bg-purple-500 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                  icon={<InfoCircleOutlined />}
                                  onClick={() => handleViewPermissions(role)}
                                />
                              }     
                              {canDelete &&
                                <Button
                                  className="bg-red-500 text-white font-bold py-1.5 px-4 rounded-3xl shadow-md shadow-gray-400"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteRole(role.id)}
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
      {/* Modales */}
      <DetailsModal
        visible={showDetailsModal}
        onClose={handleModalClose}
        selectedRole={selectedRole}
        permissionsData={permissionsData}
        selectedRoleId={selectedRoleId}
        selectedPermissionsMap={selectedPermissionsMap}
      />
      <AssignPermissionsModal
        visible={showAssignModal}
        onCancel={handleModalClose}
        selectedRoleId={selectedRoleId}
        selectedRole={selectedRole}
        permissionsData={permissionsData}
        selectedPermissionsMap={selectedPermissionsMap}
        handleCheckboxChange={handleCheckboxChange}
        handleAssignPermissionsSubmit={handleAssignPermissionsSubmit}
      />
      <CreateRolForm
        visible={showForm}
        onClose={handleFormClose}
        onCreate={handleCreateRol}
      />
      <DeleteRolModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        roleId={selectedRoleId}
        deleteRole={deleteRole}
      />
    </div>
  );
};

export default DataTable;
