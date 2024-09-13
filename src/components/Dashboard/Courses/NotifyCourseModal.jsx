import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from 'axios'; 
import hola1 from "/src/assets/img/hola1.png";

const NotifyCourseModal = ({ visible, onClose, courseId }) => {
  const { t } = useTranslation("global");
  const [emailList, setEmailList] = useState("");
  const [sendToAll, setSendToAll] = useState(false);

  const handleEmailChange = (e) => setEmailList(e.target.value);

  const handleSendEmail = async () => {
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

    try {
        const response = await axios.post('http://localhost:3068/api/send-email', {
            recipients: recipients,
            courseId: courseId
        });

        if (response.data.success) {
            message.success(t('notifyCourse.sendSuccess'));
        } else {
            message.error(t('notifyCourse.sendError'));
        }
    } catch (error) {
        console.error('Error en el envío del correo:', error);
        message.error(t('notifyCourse.sendError'));
    }
    onClose();
};


  return (
    <Modal
      centered
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width={544}
      bodyStyle={{ padding: 0, borderRadius: '20px', overflow: 'hidden' }}
    >
      <div
        style={{
          height: '125px',
          background: 'linear-gradient(to right, #350B48, #905BE8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <img
          src={hola1}
          alt="Encabezado"
          style={{
            width: '187.61px',
            height: '167.37px',
            position: 'absolute',
            bottom: '-40px',
          }}
        />
      </div>

      <div style={{ padding: '60px 40px', backgroundColor: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#350B48' }}>
          ENVÍA UNA NOTIFICACIÓN MEDIANTE EMAIL A TUS ESTUDIANTES
        </h1>
        <p style={{ fontSize: '20px', fontWeight: 700, color: 'black', marginTop: '20px' }}>
          Selecciona de qué forma quieres hacer el envío de la notificación
        </p>

        <Button
          style={{
            width: '454px',
            height: '61px',
            borderRadius: '20px',
            backgroundColor: '#4A48AA',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            marginTop: '40px',
            boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.45)',
          }}
          onClick={() => setSendToAll(true)}
        >
          Enviar a todos los estudiantes registrados
        </Button>

        <Button
          style={{
            width: '454px',
            height: '61px',
            borderRadius: '20px',
            backgroundColor: 'white',
            color: 'black',
            fontSize: '20px',
            fontWeight: 700,
            marginTop: '20px',
            boxShadow: '0px 4px 35px rgba(0, 0, 0, 0.50)',
            border: '1px solid #e0e0e0',
          }}
          onClick={() => setSendToAll(false)}
        >
          Escribe los correos de tus estudiantes...
        </Button>

        {!sendToAll && (
          <div className="mt-4">
            <Input
              type="text"
              placeholder={t('notifyCourse.emailPlaceholder')}
              value={emailList}
              onChange={handleEmailChange}
              className="w-full mt-4"
              style={{
                width: '454px',
                borderRadius: '10px',
                marginTop: '30px',
              }}
            />
          </div>
        )}

        <Button
          type="primary"
          onClick={handleSendEmail}
          style={{
            width: '454px',
            height: '61px',
            borderRadius: '20px',
            backgroundColor: '#4A48AA',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            marginTop: '40px',
          }}
        >
          Enviar notificación
        </Button>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;
