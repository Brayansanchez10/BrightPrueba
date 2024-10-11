import React, { useCallback, useState, useRef, useEffect } from "react";
import { Modal, Button, Collapse, Spin } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { deleteResource, asignarLinkContenido, actualizarLinkContenido, actualizarContenidoArchivo } from "../../../api/courses/course.request";
import Swal from 'sweetalert2';
import "./css/AssignContentModal.css";
import hola1 from "/src/assets/img/Zorro.png";

const { Panel } = Collapse;
const ALLOWED_FILE_TYPES = ['.mov', '.docx', '.pdf', '.jpg', '.png']; 
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
    if (YOUTUBE_URL_REGEX.test(url)) {
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const urlParams = new URLSearchParams(new URL(url).search);
      const videoId = urlParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (VIMEO_URL_REGEX.test(url)) {
      const videoId = url.match(VIMEO_URL_REGEX)[4]; 
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (GOOGLE_DRIVE_URL_REGEX.test(url)) {
      const fileId = url.match(GOOGLE_DRIVE_URL_REGEX)[3]; 
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
      Swal.fire({
        icon: 'warning',
        title: t('assignContentModal.invalidFileType'),
        text: t('assignContentModal.invalidFileType'),
        timer: 3000,
        showConfirmButton: true,
      });
      e.target.value = '';
      setFileSelected(null);
    }
  }, [setContentFile, t]);

  const handleAssignContent = useCallback(async () => {
    if (!fileSelected) {
      Swal.fire({
        icon: 'warning',
        title: t('assignContentModal.noFileSelected'),
        text: t('assignContentModal.noFileSelected'),
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }

    if (!selectedCourse) {
      Swal.fire({
        icon: 'error',
        title: t('assignContentModal.courseError'),
        text: t('assignContentModal.courseError'),
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    try {
      if (editIndex !== null) {
        await actualizarContenidoArchivo(selectedCourse._id, editIndex, fileSelected);
        Swal.fire({
          icon: 'success',
          title: t("assignContentModal.linkUpdatedSuccessfully"),
          timer: 750,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        await onAssignContent();
        Swal.fire({
          icon: 'success',
          title: t('assignContentModal.contentAssignedSuccessfully'),
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('assignContentModal.errorAssigningContent'),
        text: error.message || t('assignContentModal.errorAssigningContent'),
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
      setFileSelected(null);
    }
  }, [fileSelected, onAssignContent, onClose, selectedCourse, t, editIndex]);

  const handleLinkAssignContent = useCallback(async () => {
    if (!textInput.trim()) {
      Swal.fire({
        icon: 'warning',
        title: t('assignContentModal.noTextEntered'),
        text: t('assignContentModal.noTextEntered'),
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }
  
    const trimmedInput = textInput.trim();
    
    if (!YOUTUBE_URL_REGEX.test(trimmedInput) && !VIMEO_URL_REGEX.test(trimmedInput) && !GOOGLE_DRIVE_URL_REGEX.test(trimmedInput)) {
      Swal.fire({
        icon: 'warning',
        title: t('assignContentModal.invalidVideoLink'),
        text: t('assignContentModal.invalidVideoLinkdescription'),
        timer: 3000,
        showConfirmButton: true,
      });
      return;
    }
  
    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update existing link
        await actualizarLinkContenido(selectedCourse._id, trimmedInput, editIndex);
        Swal.fire({
          icon: 'success',
          title: t("assignContentModal.linkUpdatedSuccessfully"),
          timer: 750,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Add new link
        await asignarLinkContenido(selectedCourse._id, trimmedInput);
        Swal.fire({
          icon: 'success',
          title: t("assignContentModal.contentAssignedSuccessfully"),
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('assignContentModal.errorAssigningContent'),
        text: error.message || t('assignContentModal.errorAssigningContent'),
        timer: 3000,
        showConfirmButton: true,
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
      Swal.fire({
        icon: 'success',
        title: t("assignContentModal.resourceDeleted"),
        timer: 750,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      Swal.fire({
        icon: 'error',
        title: t('assignContentModal.errorDeletingResource'),
        text: error.message || t('assignContentModal.errorDeletingResource'),
        timer: 3000,
        showConfirmButton: true,
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
                        <div className="flex ml-auto space-x-2"> 
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
