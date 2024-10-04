import React, { createContext, useState, useContext, useCallback } from 'react';
import { createComment, getCommentsByResource, updateComment, deleteComment, getCommentsByCourse } from '../../api/courses/comment.request';

const CommentContext = createContext();

export const useCommentContext = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommentsByResource = useCallback(async (resourceId) => {
    setLoading(true);
    try {
      const response = await getCommentsByResource(resourceId);
      setComments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommentsByCourse = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await getCommentsByCourse(courseId);
      setComments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (courseId, resourceId, commentData) => {
    setLoading(true);
    try {
      const response = await createComment(courseId, resourceId, commentData);
      setComments(prevComments => [response.data, ...prevComments]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editComment = useCallback(async (id, commentData) => {
    setLoading(true);
    try {
      const response = await updateComment(id, commentData);
      setComments(prevComments => 
        prevComments.map(comment => comment.id === id ? response.data : comment)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeComment = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteComment(id);
      setComments(prevComments => prevComments.filter(comment => comment.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CommentContext.Provider value={{
      comments,
      loading,
      error,
      fetchCommentsByResource,
      fetchCommentsByCourse,
      addComment,
      editComment,
      removeComment
    }}>
      {children}
    </CommentContext.Provider>
  );
};