import React, { useState, useEffect } from "react";
import LeftBar from "../../Dashboard/LeftBar";
import { Button, Modal, Checkbox, Pagination, Input, Form } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useRoleContext } from "../../../context/user/role.context";
import { usePermissionContext } from "../../../context/user/permissions.context";
import CreateRolForm from "../Roles/CreateRolForm";
import Navbar from "../../Dashboard/NavBar";
import { useTranslation } from "react-i18next";
import zorroImage from "../../../assets/img/Zorro.png";
import "../css/Custom.css";
import holaImage from "../../../assets/img/hola1.png";

const { useForm } = Form;

const DataTable = () => {
  const { t } = useTranslation("global");
  const [permissionsUpdated, setPermissionsUpdated] = useState(false);

  const { rolesData, updateRole, deleteRole } = useRoleContext();
  const { permissionsData } = usePermissionContext();

  const [updatedDataFlag, setUpdatedDataFlag] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form] = useForm();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [selectedRole, setSelectedRole] = useState(null);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (selectedRoleId) {
      setSelectedRole(rolesData.find((role) => role.id === selectedRoleId));
    }
  }, [selectedRoleId, rolesData]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1600) {
        setItemsPerPage(5);
      } else if (width < 2000) {
        setItemsPerPage(5);
      } else {
        setItemsPerPage(5);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set the correct itemsPerPage

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
  
  const confirmDeleteRole = async () => {
    try {
      await deleteRole(selectedRoleId);
  
      Swal.fire({
        icon: 'success',
        title: 'Rol eliminado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setShowDeleteModal(false);
        setUpdatedDataFlag(true); // Trigger data refresh
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar el rol',
        text: error.message || 'An error occurred while deleting the role.',
        timer: 3000,
        showConfirmButton: true,
      });
    }
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

  return (
    <div className="bg-gray-300 overflow-hidden min-h-screen">
      <div className="flex h-full">
        <LeftBar onVisibilityChange={setIsLeftBarVisible} />
        <div
          className={`w-full transition-all duration-300 ${
            isLeftBarVisible ? "ml-56 max-w-full" : ""
          }`}
        >
          <Navbar />
          <div className="flex justify-center mt-10">
            <div>
              <h2 className="text-2xl font-black text-black text-center">
                {t("roles.title")}
              </h2>
              <div className="flex flex-col items-center justify-center mt-6">
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  onClick={() => setShowForm(true)}
                  className=""
                >
                  <b>{t("roles.createRole")}</b>
                </Button>
                <Input
                  placeholder={t("roles.SearchRoles")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-40 mt-2"
                />
              </div>
              <div className="overflow-x-auto flex mt-10 mb-4 w-screen justify-center">
                <table className="bg-gray-300 w-full mx-10">
                  <thead>
                    <tr>
                      <th
                        className="px-4 py-4 bg-blue-500 text-white border-2 border-blue-800 cursor-pointer"
                        onClick={() => orderBy("id")}
                      >
                        ID {""}
                      </th>
                      <th
                        className="px-6 py-4 bg-green-500 text-white border-2 border-blue-800 cursor-pointer"
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
                      <th className="px-10 py-4  bg-red-500 text-white border-2 border-blue-800">
                        {t("roles.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesData &&
                      currentItems.map((role, index) => (
                        <tr key={role.id}>
                          <td className="border-2 border-blue-800  text-black text-center py-4 text-lg font-black">
                            {generateIds()[index]}
                          </td>
                          <td className="border-2 border-blue-800  text-black text-center py-4 text-lg">
                            {role.nombre}
                          </td>
                          <td className="border-2 border-blue-800  text-black text-center py-4 text-lg">
                            <div className="flex justify-center space-x-6">
                              <Button
                                className="bg-green-500 h-10 text-lg text-white"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleAssignPermissions(role)}
                              ></Button>
                              <Button
                                className="bg-purple-600 h-10 text-lg text-white"
                                icon={<InfoCircleOutlined />}
                                onClick={() => handleViewPermissions(role)}
                              ></Button>
                              <Button
                                className="bg-red-600 h-10 text-lg text-white"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteRole(role.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mb-6 mt-10">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-800 border"
                  >
                    {t("roles.previus")}
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
                    {t("roles.next")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       <Modal
      className="custom w-[543px] h-[400px] bg-white rounded-3xl"
      centered
      visible={showDetailsModal}
      onCancel={handleModalClose}
      footer={null}
      closable={false}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="p-0">
        <div className="relative w-full h-[125px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex items-center justify-center">
          <img 
            src={zorroImage} 
            alt="Zorro"
            className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2" 
          />
          <button
            className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
            onClick={handleModalClose}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-6">
          <h1 className="text-center text-[#350B48] text-3xl font-extrabold mt-14 mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
            {t("roles.permissions")}
          </h1>
          {selectedRole && (
            <div>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t("roles.role")} ID:</strong>
                <br />
                <span className="text-lg text-black-500 font-medium">{selectedRole.id}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t("roles.name")}:</strong>
                <br />
                <span className="text-lg text-black-500 font-medium">{selectedRole.nombre}</span>
              </p>
              <p className="mb-5">
                <strong className="font-bold text-xl text-black">{t("roles.permissions")}:</strong>
                <br />
                <span className="text-base text-black-600 font-medium">
                  {selectedRole &&
                    selectedRole.permisos &&
                    selectedRole.permisos.map((permiso) => (
                      <li className="text-sm ml-10" key={permiso}>
                        <span className="text-black text-lg">-</span> {permiso}
                      </li>
                    ))}
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex justify-center">
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      className="custom"
      centered
      visible={showAssignModal}
      onCancel={handleModalClose}
      closable={false}
      footer={null}
      bodyStyle={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-5 right-8 cursor-pointer" onClick={handleModalClose}>
        <span className="text-white text-2xl font-bold">X</span>
      </div>
      <div className="h-[115px] bg-gradient-to-r from-[#18116A] to-blue-500 flex justify-center items-center">
        <img src={holaImage} alt="Zorro" className="w-[182px] h-[168px] mt-12 object-contain" />
      </div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#18116A] mt-5 mb-4">
          {t("roles.assignPermissions").toUpperCase()}
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-6">
          ¿{t("roles.description")}?
        </p>
        {permissionsData &&
          permissionsData.info &&
          permissionsData.info.map((permission) => (
            <div key={permission.id} className="mb-3">
              <Checkbox
                className="text-lg"
                checked={selectedPermissionsMap[selectedRoleId]?.includes(
                  permission.id
                )}
                onChange={() =>
                  handleCheckboxChange(selectedRoleId, permission.id)
                }
                style={{
                  color: selectedPermissionsMap[selectedRoleId]?.includes(
                    permission.id
                  )
                    ? "green"
                    : "red",
                }}
              >
                {permission.nombre}
              </Checkbox>
            </div>
          ))}
        <div className="flex justify-center space-x-2 mt-6">
          <button
            className="bg-[#18116A] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#140e5b] transition-all duration-300"
            onClick={handleAssignPermissionsSubmit}
          >
            {t("roles.assignPermissions")}
          </button>
        </div>
      </div>
    </Modal>
      <CreateRolForm
        visible={showForm}
        onClose={handleFormClose}
        onCreate={handleCreateRol}
      />
     <Modal
      className="custom w-[543px] h-[350px] bg-white rounded-3xl"
      centered
      visible={showDeleteModal}
      onCancel={() => setShowDeleteModal(false)}
      footer={null}
      closable={false}
      bodyStyle={{
        overflow: "hidden",
      }}
    >
      <div className="relative w-full h-[125px] bg-gradient-to-r from-[#872626] to-red-500 flex justify-center items-center">
        <img 
          src={zorroImage} 
          alt="Zorro"
          className="absolute w-[146px] h-[155px] top-0 left-1/2 transform -translate-x-1/2" 
        />
        <button
          className="absolute top-2 right-5 bg-transparent text-white text-3xl font-bold cursor-pointer"
          onClick={() => setShowDeleteModal(false)}
        >
          ×
        </button>
      </div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-extrabold text-[#D84545] mt-5 mb-4">
          {t("roles.confirmDeleteRole")}
        </h1>
        <p className="text-lg font-semibold mb-3">
          {t("roles.deleteConfirmation")}
        </p>
        <p className="text-sm font-extrabold text-red-500 mb-6">
          <b>{t("roles.deleteCannot")}</b>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-[#FF4236] text-white font-bold text-lg rounded-2xl min-w-[133px] h-9 px-4 shadow-md hover:bg-[#ff2f22] transition-all duration-300"
            onClick={confirmDeleteRole}
          >
            {t("roles.confirm")}
          </button>
        </div>
      </div>
    </Modal>
    </div>
  );
};

export default DataTable;
