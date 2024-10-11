import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  createGeneralComment,
  getGeneralComments,
  updateGeneralComment,
  deleteGeneralComment,
} from '../../api/courses/generalComment.request';

const GeneralCommentContext = createContext();

export const useGeneralCommentContext = () => {
  return useContext(GeneralCommentContext);
};

export const GeneralCommentProvider = ({ children }) => {
  const [generalComments, setGeneralComments] = useState([]);

  const fetchGeneralComments = useCallback(async (courseId) => {
    try {
      const response = await getGeneralComments(courseId);
      setGeneralComments(response.data);
    } catch (error) {
      console.error('Error al obtener los comentarios generales:', error);
    }
  }, []);

  const addGeneralComment = useCallback(async (data) => {
    try {
      const response = await createGeneralComment(data);
      setGeneralComments((prevComments) => [response.data, ...prevComments]);
      return response.data;
    } catch (error) {
      console.error('Error al agregar el comentario general:', error);
      throw error;
    }
  }, []);

  const editGeneralComment = useCallback(async (id, data) => {
    try {
      const response = await updateGeneralComment(id, data);
      setGeneralComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? response.data : comment
        )
      );
      return response.data;
    } catch (error) {
      console.error('Error al editar el comentario general:', error);
      throw error;
    }
  }, []);

  const removeGeneralComment = useCallback(async (id) => {
    try {
      await deleteGeneralComment(id);
      setGeneralComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar el comentario general:', error);
      throw error;
    }
  }, []);

  const value = {
    generalComments,
    fetchGeneralComments,
    addGeneralComment,
    editGeneralComment,
    removeGeneralComment,
  };

  return (
    <GeneralCommentContext.Provider value={value}>
      {children}
    </GeneralCommentContext.Provider>
  );
};