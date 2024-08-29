import React, { useCallback, useState, useRef, useEffect } from "react";
import { Modal, Button, Collapse, notification, Spin } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { deleteResource, asignarLinkContenido, actualizarLinkContenido, actualizarContenidoArchivo } from "../../../api/courses/course.request";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const ALLOWED_FILE_TYPES = ['.mov', '.docx', '.pdf', '.jpg', '.png']; // Removido '.mp4'

// Expresión regular para validar URLs de YouTube
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|playlist\?list=)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:\S*)?$/i;
const VIMEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/i;
const GOOGLE_DRIVE_URL_REGEX = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(\/[^?]*)(\?.*)?$/i;


const AssignContentModal = ({
  visible,
  onClose,
  onAssignContent,
  selectedCourse,
  setContentFile,
  setContentText,
}) => {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [selection, setSelection] = useState('file');
  const [editIndex, setEditIndex] = useState(null);
  const [editLink, setEditLink] = useState('');
  const imgRefs = useRef([]);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    setFileSelected(null);
    setTextInput('');
    setLoading(false);
    setSelection('file');
    setEditIndex(null);
    setEditLink('');
    if (imgRefs.current) imgRefs.current.forEach(img => (img.src = ""));
  };
  
  const getEmbedUrl = (url) => {
    // Verifica si es un enlace de tipo 'youtu.be' o 'youtube.com/watch'
    if (YOUTUBE_URL_REGEX.test(url)) {
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const urlParams = new URLSearchParams(new URL(url).search);
      const videoId = urlParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    // Verifica si es un enlace de Vimeo
    if (VIMEO_URL_REGEX.test(url)) {
      const videoId = url.match(VIMEO_URL_REGEX)[4]; // El ID del video de Vimeo
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Verifica si es un enlace de Google Drive
    if (GOOGLE_DRIVE_URL_REGEX.test(url)) {
      const fileId = url.match(GOOGLE_DRIVE_URL_REGEX)[3]; // El ID del archivo de Google Drive
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return '';
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
      setFileSelected(file);
      setContentFile(file);
    } else {
      notification.warning({
        message: t('assignContentModal.invalidFileType'),
        description: t('assignContentModal.invalidFileType'),
        duration: 3,
      });
      e.target.value = '';
      setFileSelected(null);
    }
  }, [setContentFile, t]);

  const handleAssignContent = useCallback(async () => {
    if (!fileSelected) {
      notification.warning({
        message: t('assignContentModal.noFileSelected'),
        description: t('assignContentModal.noFileSelected'),
        duration: 3,
      });
      return;
    }

    if (!selectedCourse) {
      notification.error({
        message: t('assignContentModal.courseError'),
        description: t('assignContentModal.courseError'),
        duration: 3,
      });
      return;
    }

    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update existing link
        await actualizarContenidoArchivo(selectedCourse._id, editIndex, fileSelected);
        toast.success(t("assignContentModal.linkUpdatedSuccessfully"), {
          autoClose: 750,
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        await onAssignContent();
        notification.success({
          message: t('assignContentModal.contentAssignedSuccessfully'),
          duration: 3,
        });
        onClose();
      }
    } catch (error) {
      notification.error({
        message: t('assignContentModal.errorAssigningContent'),
        description: error.message || t('assignContentModal.errorAssigningContent'),
        duration: 3,
      });
    } finally {
      setLoading(false);
      setFileSelected(null);
    }
  }, [fileSelected, onAssignContent, onClose, selectedCourse, t]);

  const handleLinkAssignContent = useCallback(async () => {
    if (!textInput.trim()) {
      notification.warning({
        message: t('assignContentModal.noTextEntered'),
        description: t('assignContentModal.noTextEntered'),
        duration: 3,
      });
      return;
    }
  
    const trimmedInput = textInput.trim();
    
    // Validar URL de YouTube, Vimeo o Google Drive
    if (!YOUTUBE_URL_REGEX.test(trimmedInput) && !VIMEO_URL_REGEX.test(trimmedInput) && !GOOGLE_DRIVE_URL_REGEX.test(trimmedInput)) {
      notification.warning({
        message: t('assignContentModal.invalidVideoLink'),
        description: t('assignContentModal.invalidVideoLinkdescription'),
        duration: 3,
      });
      return;
    }
  
    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update existing link
        await actualizarLinkContenido(selectedCourse._id, trimmedInput, editIndex);
        toast.success(t("assignContentModal.linkUpdatedSuccessfully"), {
          autoClose: 750,
          onClose: () => {
            window.location.reload();
          },
        });
      } else {
        // Add new link
        await asignarLinkContenido(selectedCourse._id, trimmedInput);
        toast.success(t("assignContentModal.contentAssignedSuccessfully"), {
          autoClose: 750,
          onClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      notification.error({
        message: t('assignContentModal.errorAssigningContent'),
        description: error.message || t('assignContentModal.errorAssigningContent'),
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  }, [textInput, selectedCourse, editIndex, t]);

  const handleEditResource = (index, url) => {
    setEditIndex(index);
    setEditLink(url);
    setSelection('link');
    setTextInput(url);
  };


  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleRemoveResource = async (index) => {
    try {
      await deleteResource(selectedCourse._id, index);
      toast.success(t("assignContentModal.resourceDeleted"), {
        autoClose: 750,
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      notification.error({
        message: t('assignContentModal.errorDeletingResource'),
        description: error.message || t('assignContentModal.errorDeletingResource'),
        duration: 3,
      });
    }
  };

  return (
    <Modal
      className="shadow-md border-2 border-gray-300 rounded-lg"
      centered
      visible={visible}
      closable={false}
      onCancel={handleCancel}
      style={{ backdropFilter: "blur(15px)" }}
      footer={null}
    >
      <div className="bg-gradient-to-tl from-teal-400 to-blue-500 p-6 rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <h1 className="font-bold text-center text-2xl text-white mb-4">
              {t('assignContentModal.title')} <span className="font-black">{selectedCourse?.title || ""}</span>
            </h1>
            {selectedCourse?.content?.length ? (
              <Collapse className="mt-6 bg-white border-2 border-gray-300 rounded-lg">
                {selectedCourse.content.map((url, index) => (
                  <Panel
                    className="hover:bg-gray-200"
                    header={
                      <div className="flex justify-between items-center">
                        <span>{t('assignContentModal.resource')} {index + 1}</span>
                        <div className="flex ml-auto space-x-2"> {/* Nuevo div contenedor para los botones */}
                          <Button
                            type="danger"
                            icon={<DeleteFilled />}
                            onClick={() => handleRemoveResource(index)}
                          />
                          <Button
                            type="default"
                            icon={<EditFilled />}
                            onClick={() => handleEditResource(index, url)}
                          />
                        </div>
                      </div>
                    }
                    key={index}
                  >
                   {url.startsWith('https://www.youtube.com') || url.startsWith('https://youtu.be') || url.startsWith('https://vimeo.com') || GOOGLE_DRIVE_URL_REGEX.test(url) ? (
                      <div>
                        <p className="font-bold text-lg text-gray-700">{t('assignContentModal.videoLink')}:</p>
                        <iframe
                          src={getEmbedUrl(url)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-64"
                          title={`Video ${index}`}
                        />
                      </div>
                    ) : url.endsWith(".pdf") ? (
                      <div>
                        <p>{t('assignContentModal.downloadPDF')}</p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline" 
                          download
                        >
                          {`${t('assignContentModal.downloadPDF')}`}
                        </a>
                      </div>
                    ) : (
                      <img
                        ref={(el) => (imgRefs.current[index] = el)}
                        src={url}
                        alt={`Content ${index}`}
                        className="w-full mb-4 rounded-lg border border-gray-300"
                      />
                    )}
                  </Panel>
                ))}
              </Collapse>
            ) : null}
            <div className="mt-4">
              <div className="flex mb-4 justify-center gap-4">
                <Button
                  type={selection === 'file' ? 'primary' : 'default'}
                  onClick={() => setSelection('file')}
                  className="flex-1"
                >
                  {t('assignContentModal.file')}
                </Button>
                <Button
                  type={selection === 'link' ? 'primary' : 'default'}
                  onClick={() => setSelection('link')}
                  className="flex-1"
                >
                  {t('assignContentModal.link')}
                </Button>
              </div>
              {selection === 'file' ? (
                <div className="flex flex-col items-center">
                  <input
                    id="file"
                    type="file"
                    accept={ALLOWED_FILE_TYPES.join(', ')}
                    onChange={handleFileChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <input
                    id="link"
                    type="text"
                    value={textInput}
                    onChange={handleTextChange}
                    placeholder={t('assignContentModal.placeholderlink')}
                    className="p-2 rounded-lg w-full"
                  />
                </div>
              )}
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  type="primary"
                  onClick={selection === 'file' ? handleAssignContent : handleLinkAssignContent}
                >
                  {t('assignContentModal.assign')}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400"
                >
                  {t('assignContentModal.cancel')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AssignContentModal;
