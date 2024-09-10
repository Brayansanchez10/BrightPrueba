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
      setSelectedRole(rolesData.find((role) => role._id === selectedRoleId));
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
    setSelectedRoleId(role._id);
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
      const storedPermissions = JSON.parse(localStorage.getItem(role._id));
      if (storedPermissions) {
        storedPermissionsMap[role._id] = storedPermissions;
      }
    });
    setSelectedPermissionsMap(storedPermissionsMap);
  }, [rolesData]);

  const handleAssignPermissions = (role) => {
    setSelectedRoleId(role._id);
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
          permissionIdMap[permission.nombre] = permission._id;
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
    <div className="bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 overflow-hidden min-h-screen">
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
              <h2 className="text-2xl font-black text-white text-center">
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
                        <tr key={role._id}>
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
                                onClick={() => handleDeleteRole(role._id)}
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
        className="shadow-orange shadow-white border-2 border-black rounded-lg"
        visible={showDetailsModal}
        onCancel={handleModalClose}
        footer={null}
        centered
        closable={false}
        maskStyle={{ backdropFilter: "blur(15px)" }}
      >
        <h1 className="text-center text-xl font-bold">
          {t("roles.permissions")}
        </h1>
        {selectedRole && (
          <div className="mt-4">
            <b className="text-lg">{t("roles.role")} ID:</b>{" "}
            <span className="text-sm text-green-500 font-medium">
              {selectedRole._id}{" "}
            </span>
            <p>
              <b className="text-lg">{t("roles.name")}</b>{" "}
              <span className="text-sm text-green-500 font-medium">
                {selectedRole.nombre}{" "}
              </span>
            </p>
            <p>
              <b className="text-lg">{t("roles.permissions")}:</b>
              <span className="text-base text-green-600 font-medium">
                {selectedRole &&
                  selectedRole.permisos &&
                  selectedRole.permisos.map((permiso) => (
                    <li className="text-sm ml-10" key={permiso}>
                      <span className="text-black text-lg">-</span> {permiso}
                    </li>
                  ))}
              </span>
            </p>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 mt-4 bg-neutral-700 text-base rounded-lg hover:bg-neutral-600 font-black text-white"
                onClick={handleModalClose}
              >
                {t("roles.close")}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        className="shadow-orange shadow-white border-2 border-black rounded-lg flex justify-center"
        visible={showAssignModal}
        onCancel={handleModalClose}
        footer={null}
        centered
        closable={false}
        maskStyle={{ backdropFilter: "blur(20px)" }}
      >
        <div>
          <h1 className="text-center text-xl font-bold">
            {t("roles.permissions")} 
          </h1>
          {permissionsData &&
            permissionsData.info &&
            permissionsData.info.map((permission) => (
              <div key={permission._id} className="">
                <Checkbox
                  className="text-lg"
                  checked={selectedPermissionsMap[selectedRoleId]?.includes(
                    permission._id
                  )}
                  onChange={() =>
                    handleCheckboxChange(selectedRoleId, permission._id)
                  }
                  style={{
                    color: selectedPermissionsMap[selectedRoleId]?.includes(
                      permission._id
                    )
                      ? "green"
                      : "red",
                  }}
                >
                  {permission.nombre}
                </Checkbox>
              </div>
            ))}
          <div className="space-x-2 flex justify-center mt-4">
            <button
              className=" bg-blue-500 text-white text-base font-medium px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleAssignPermissionsSubmit}
            >
              {t("roles.assignPermissions")}
            </button>
            <button
              className=" bg-neutral-700 text-white text-base font-medium px-4 py-2 rounded-lg hover:bg-neutral-600"
              onClick={handleModalClose}
            >
              {t("roles.close")}
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
        className="shadow-orange shadow-white border-2 border-black rounded-lg"
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
        closable={false}
        centered
        maskStyle={{ backdropFilter: "blur(20px)" }}
      >
        <div className="">
          <h1 className="text-center text-xl font-bold">
            {t("roles.confirmDeleteRole")}
          </h1>
          <p className="text-base text-black text-center mt-4 ">
            {t("roles.deleteConfirmation")}
          </p>
          <p className="text-base text-red-600 text-center mt-2">
            <b>{t("roles.deleteCannot")}</b>
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 border border-red-700"
              onClick={confirmDeleteRole}
            >
              {t("roles.confirm")}
            </button>
            <button
              className="bg-neutral-700 font-semibold px-4 py-2 rounded-xl hover:bg-neutral-600 text-white"
              onClick={() => setShowDeleteModal(false)}
            >
              {t("roles.cancel")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
