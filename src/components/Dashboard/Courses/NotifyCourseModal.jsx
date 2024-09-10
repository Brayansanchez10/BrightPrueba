import React, { useState } from "react";
import { Modal, Button, Input, Checkbox, message } from "antd";
import { useTranslation } from "react-i18next";

const NotifyCourseModal = ({ visible, onClose, onSendEmail, courseId }) => {
  const { t } = useTranslation("global");
  const [emailList, setEmailList] = useState("");
  const [sendToAll, setSendToAll] = useState(false);

  const handleEmailChange = (e) => setEmailList(e.target.value);

  const handleSendEmail = () => {
    let recipients;
    if (sendToAll) {
      recipients = 'all';
    } else {
      recipients = emailList.split(',').map(email => email.trim()).filter(email => email);
      if (recipients.length === 0) {
        message.error(t('notifyCourse.invalidEmails'));
        return;
      }
    }
    
    if (typeof onSendEmail === 'function') {
      onSendEmail(courseId, recipients).catch(error => {
        console.error('Error en el envío del correo:', error);
        message.error(t('notifyCourse.sendError'));
      });
    } else {
      console.error('onSendEmail no está definido o no es una función');
      message.error(t('notifyCourse.sendError'));
    }
    onClose();
  };

  return (
    <Modal
      className="shadow-orange shadow-white border-2 border-black rounded-lg"
      centered
      visible={visible}
      onCancel={onClose}
      closable={false}
      maskStyle={{ backdropFilter: "blur(10px)" }}
      footer={null}
    >
      <div>
        <h1 className="text-xl text-center font-bold">
          {t('notifyCourse.title')}
        </h1>
        <div className="mt-4">
          <Checkbox
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
          >
            {t('notifyCourse.sendToAll')}
          </Checkbox>
        </div>
        {!sendToAll && (
          <div className="mt-4">
            <Input
              type="text"
              placeholder={t('notifyCourse.emailPlaceholder')}
              value={emailList}
              onChange={handleEmailChange}
              className="w-full"
            />
          </div>
        )}
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            type="primary"
            onClick={handleSendEmail}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {t('notifyCourse.send')}
          </Button>
          <Button 
            onClick={onClose}
            className="bg-neutral-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-neutral-600"
          >
            {t('notifyCourse.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;