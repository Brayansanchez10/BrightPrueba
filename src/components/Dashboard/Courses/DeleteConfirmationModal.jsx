import React from "react";
import { Modal } from "antd";
import "./css/DeleteConfirmationModal.css";
import pulpoImage from "../../../assets/img/pulpo.png";

const DeleteConfirmationModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      className="custom-delete-modal"
      centered
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      transitionName="" 
    >
      <div className="close-icon-container" onClick={onClose}>
        <span className="close-icon">X</span> 
      </div>

      <div className="modal-header">
        <img src={pulpoImage} alt="Pulpo" className="header-image" />
      </div>
      <div className="modal-body">
        <h1 className="delete-title">ELIMINAR CURSO</h1>
        <p className="confirmation-message">¿Estás seguro que deseas eliminar el curso de Python?</p>
        <p className="warning-message">Esta acción no se podrá revertir.</p>
        <div className="button-container">
          <button 
            className="delete-button"
            onClick={onConfirm} 
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;