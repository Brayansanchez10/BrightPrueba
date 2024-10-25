import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { useCoursesContext } from "../../../context/courses/courses.context";
import hola1 from "/src/assets/img/Zorro.png";
import "../css/Custom.css";

const NotifyCourseModal = ({ visible, onClose, courseId }) => {
  const { t } = useTranslation("global");
  const [emailList, setEmailList] = useState("");
  const [sendToAll, setSendToAll] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const { notifyAllUsersInCourse, notifySpecificUser } = useCoursesContext();

  useEffect(() => {
    if (visible) {
      setSendToAll(null);
      setExpanded(false);
      setEmailList("");
    }
  }, [visible]);

  const handleEmailChange = (e) => {
    setEmailList(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      if (sendToAll) {
        await notifyAllUsersInCourse(courseId);
        message.success(t('notifyCourse.successNotifyAll'));
      } else {
        if (emailList.trim()) {
          await notifySpecificUser(courseId, emailList.trim());
          message.success(t('notifyCourse.successNotifySpecific'));
        } else {
          message.error(t('notifyCourse.emptyEmail'));
        }
      }
      onClose();
    } catch (error) {
      message.error(t('notifyCourse.errorSending'));
    }
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

      <div className="p-8 bg-secondary text-center h-full">
        <h1 className="text-2xl font-extrabold text-[#350B48] dark:text-primary">{t('notifyCourse.notificationCourse')}</h1>
        <p className="text-xl font-bold text-black dark:text-gray-300 mt-5">
          {t('notifyCourse.selectNotificationMethod')}
        </p>

        <button
          className={`w-[239px] h-[38px] mt-10 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 ${
            sendToAll === true
              ? "bg-[#4A48AA] text-white transform scale-105"
              : "bg-white text-black border border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => {
            setSendToAll(true);
            setExpanded(false);
          }}
        >
          {t('notifyCourse.sendToAll')}
        </button>

        <button
          className={`w-[239px] h-[38px] mt-5 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 ${
            sendToAll === false
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

        {sendToAll === false && expanded && (
          <>
            <Input
              type="text"
              placeholder={t('notifyCourse.emailPlaceholder')}
              value={emailList}
              onChange={handleEmailChange}
              className="w-[239px] h-[38px] rounded-lg mt-5"
            />
            <p className="text-xs text-black dark:text-gray-300 mt-5" dangerouslySetInnerHTML={{ __html: t('notifyCourse.emailInstructions') }} />
          </>
        )}

        <button
          className="absolute bottom-5 right-5 w-[110px] h-[38px] bg-[#1D164E] text-white text-lg font-bold rounded-lg"
          onClick={handleSendEmail}
        >
          {t('notifyCourse.send')}
        </button>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;
