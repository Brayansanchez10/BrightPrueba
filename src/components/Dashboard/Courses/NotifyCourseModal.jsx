import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";
import hola1 from "/src/assets/img/Zorro.png";
import "../css/Custom.css";

const NotifyCourseModal = ({ visible, onClose, courseId }) => {
  const { t } = useTranslation("global");
  const [emailList, setEmailList] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (visible) {
      setSendToAll(false);
      setExpanded(false);
      setEmailList("");
    }
  }, [visible]);

  const handleEmailChange = (e) => setEmailList(e.target.value);

  const handleSendEmail = async () => {
    let recipients;
    if (sendToAll) {
      recipients = "all";
    } else {
      recipients = emailList
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      if (recipients.length === 0) {
        message.error(t("notifyCourse.invalidEmails"));
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:3068/api/send-email", {
        recipients: recipients,
        courseId: courseId,
      });

      if (response.data.success) {
        message.success(t("notifyCourse.sendSuccess"));
      } else {
        message.error(t("notifyCourse.sendError"));
      }
    } catch (error) {
      console.error("Error en el envío del correo:", error);
      message.error(t("notifyCourse.sendError"));
    }
    onClose();
  };

  return (
    <Modal
      className="custom"
      centered
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width={474}
      bodyStyle={{
        padding: 0,
        borderRadius: "20px",
        overflow: "hidden",
        height: expanded ? "580px" : "470px",
        transition: "height 0.3s ease",
        margin: 0,
      }}
    >
      <div className="relative h-[120px] bg-gradient-to-r from-[#350B48] to-[#905BE8] flex justify-center items-center">
        <img
          src={hola1}
          alt="Encabezado"
          className="absolute w-[150px] h-[140px] bottom-[-20px] z-10"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-2xl font-extrabold z-10 cursor-pointer bg-transparent"
        >
          ×
        </button>
      </div>

      <div className="p-8 bg-white text-center">
        <h1 className="text-2xl font-extrabold text-[#350B48]">NOTIFICACIÓN CURSO</h1>
        <p className="text-xl font-bold text-black mt-5">
          Selecciona de qué forma quieres hacer el envío de la notificación
        </p>

        <button
          className="w-[239px] h-[38px] mt-10 bg-[#4A48AA] text-white text-lg font-bold rounded-2xl shadow-lg transition-transform duration-200"
          onClick={() => {
            setSendToAll(true);
            setExpanded(false);
          }}
        >
          Todos los estudiantes
        </button>

        <button
          className="w-[239px] h-[38px] mt-5 bg-white text-black text-lg font-bold rounded-2xl border border-gray-300 shadow-lg transition-transform duration-200"
          onClick={() => {
            setSendToAll(false);
            setExpanded(true);
          }}
        >
          Escribe los correos
        </button>

        {!sendToAll && expanded && (
          <>
            <Input
              type="text"
              placeholder="Introduce los correos electrónicos"
              value={emailList}
              onChange={handleEmailChange}
              className="w-[239px] h-[38px] rounded-lg mt-5"
            />
            <p className="text-xs text-black mt-5">
              Separa todos los correos electrónicos con una coma{" "}
              <span className="text-[#350B48] font-bold text-sm">“ , ”</span> y
              continúa<br />
              por ejemplo{" "}
              <span className="text-[#350B48] font-bold">
                aprende@gmail.com, brightmind@gmail.com
              </span>
            </p>
          </>
        )}

        <button
          className="absolute bottom-5 right-5 w-[110px] h-[38px] bg-[#1D164E] text-white text-lg font-bold rounded-lg"
          onClick={handleSendEmail}
        >
          Enviar
        </button>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;
