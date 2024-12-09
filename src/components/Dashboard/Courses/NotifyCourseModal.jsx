import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useCoursesContext } from "../../../context/courses/courses.context";
import Swal from 'sweetalert2';
import { SendOutlined } from '@ant-design/icons';
import hola1 from "/src/assets/img/Zorro.png";
import "../css/Custom.css";

const NotifyCourseModal = ({ visible, onClose, courseId }) => {
  const { t } = useTranslation("global");
  const [emailList, setEmailList] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const { notifyAllUsersInCourse, notifySpecificUser } = useCoursesContext();

  useEffect(() => {
    if (visible) {
      setSendToAll(true);
      setExpanded(false);
      setEmailList("");
    }
  }, [visible]);

  const handleEmailChange = (e) => {
    setEmailList(e.target.value);
  };

  const handleSendEmail = async (isAll) => {
    let confirmResult;
    
    if (isAll) {
      confirmResult = await Swal.fire({
        title: t('alerts.sendEmailToAll.title'),
        text: t('alerts.sendEmailToAll.text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('alerts.sendEmailToAll.confirmButtonText'),
        cancelButtonText: t('alerts.sendEmailToAll.cancelButtonText')
      });
    } else {
      if (!emailList.trim()) {
        Swal.fire({
          icon: "error",
          title: t('alerts.emptyEmailField.title'),
          timer: 3000,
          showConfirmButton: true,
        });
        return;
      }
      confirmResult = await Swal.fire({
        title: t('alerts.confirmEmailSend.title'),
        text: t('alerts.confirmEmailSend.text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('alerts.confirmEmailSend.confirmButtonText'),
        cancelButtonText: t('alerts.confirmEmailSend.cancelButtonText')
      });
    }
  
    if (confirmResult.isConfirmed) {
      try {
        if (isAll) {
          await notifyAllUsersInCourse(courseId);
          Swal.fire({
            icon: "success",
            title: t('alerts.notificationSentAll.title'),
            timer: 1000,
            showConfirmButton: false,
          });
        } else {
          await notifySpecificUser(courseId, emailList.trim());
          Swal.fire({
            icon: "success",
            title: t('alerts.notificationSentSpecific.title'),
            timer: 1000,
            showConfirmButton: false,
          });
        }
        onClose();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: t('alerts.errorSendingNotification.title'),
          timer: 3000,
          showConfirmButton: true,
        });
      }
    }
  };
  
  const isMobile = window.innerWidth <= 768;

  return (
    <Modal
      className="custom-modal"
      centered
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width={474}
      bodyStyle={{
        padding: 0,
        borderRadius: "20px",
        overflow: "hidden",
        height: isMobile ? "480px" : expanded ? "540px" : "440px",
        transition: "height 0.3s ease",
        margin: 0,
      }}
    >
      <div className={`flex flex-col h-full ${expanded ? 'sm:h-[700px]' : ''}`}>
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

        <div className="p-8 bg-white text-center flex-grow">
          <h1 className="text-2xl font-extrabold text-[#350B48]">{t('notifyCourse.notificationCourse')}</h1>
          <p className="text-xl font-bold text-black mt-5">
            {t('notifyCourse.selectNotificationMethod')}
          </p>

          <button
            className={`w-[239px] h-[38px] mt-10 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 ${
              sendToAll
                ? "bg-[#4A48AA] text-white transform scale-105"
                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => {
              setSendToAll(true);
              setExpanded(false);
              handleSendEmail(true);
            }}
          >
            {t('notifyCourse.sendToAll')}
          </button>

          <button
            className={`w-[239px] h-[38px] mt-5 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 ${
              !sendToAll
                ? "bg-[#4A48AA] text-white transform scale-105"
                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => {
              setSendToAll(false);
              setExpanded(true);
            }}
          >
            {t('notifyCourse.sendToSpecific')}
          </button>

          {!sendToAll && expanded && (
            <div className="relative mt-5">
              <Input
                type="text"
                placeholder={t('notifyCourse.emailPlaceholder')}
                value={emailList}
                onChange={handleEmailChange}
                className="w-[239px] h-[38px] rounded-lg pr-12"
                suffix={
                  <div 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#4A48AA] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSendEmail(false)}
                  >
                    <SendOutlined className="text-white" />
                  </div>
                }
              />
              <p className="text-xs text-black mt-8" dangerouslySetInnerHTML={{ __html: t('notifyCourse.emailInstructions') }} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;
