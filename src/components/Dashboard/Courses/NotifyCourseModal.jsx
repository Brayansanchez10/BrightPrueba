import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from 'axios'; 
import hola1 from "/src/assets/img/Zorro.png";

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
      width={474}
      bodyStyle={{
        padding: 0,
        borderRadius: '20px',
        overflow: 'hidden',
        height: expanded ? '530px' : '444px',
        transition: 'height 0.3s ease',
        margin: 0,
      }}
    >
      <div
        style={{
          height: '100px',
          background: 'linear-gradient(to right, #350B48, #905BE8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <img
          src={hola1}
          alt="Encabezado"
          style={{
            width: '150px', 
            height: '120px', 
            position: 'absolute',
            bottom: '-20px', 
            zIndex: 2,
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            fontWeight: '900',
            color: 'white',
            cursor: 'pointer',
            zIndex: 3,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '20px 40px', backgroundColor: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#350B48' }}>NOTIFICACIÓN CURSO</h1>
        <p style={{ fontSize: '20px', fontWeight: 700, color: 'black', marginTop: '20px' }}>
          Selecciona de qué forma quieres hacer el envío de la notificación
        </p>

        <Button
          style={{
            width: '239px',
            height: '38px',
            borderRadius: '20px',
            backgroundColor: '#4A48AA',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            marginTop: '40px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
          }}
          onClick={() => {
            setSendToAll(true);
            setExpanded(false); 
          }}
        >
          Todos los estudiantes
        </Button>

        <Button
          style={{
            width: '239px',
            height: '38px',
            borderRadius: '20px',
            backgroundColor: 'white',
            color: 'black',
            fontSize: '16px',
            fontWeight: 700,
            marginTop: '20px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e0e0e0',
          }}
          onClick={() => {
            setSendToAll(false);
            setExpanded(true); 
          }}
        >
          Escribe los correos
        </Button>

        {!sendToAll && expanded && (
          <>
            <Input
              type="text"
              placeholder="Introduce los correos electrónicos"
              value={emailList}
              onChange={handleEmailChange}
              style={{
                width: '239px',
                height: '38px',
                borderRadius: '10px',
                marginTop: '20px',
              }}
            />
            <p
              style={{
                textAlign: 'center',
                marginTop: '20px',
                color: 'black',
                fontSize: '10px',
              }}
            >
              Separa todos los correos electrónicos con una coma <span style={{ color: '#350B48', fontWeight: 'bold', fontSize: '14'}}>“ , ”</span> y continúa<br />
              por ejemplo <span style={{ color: '#350B48', fontWeight: 'bold' }}>aprende@gmail.com, brightmind@gmail.com</span>
            </p>
          </>
        )}

        <Button
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '110px',
            height: '40px',
            backgroundColor: '#1D164E',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
          }}
          onClick={handleSendEmail}
        >
          Enviar
        </Button>
      </div>
    </Modal>
  );
};

export default NotifyCourseModal;
