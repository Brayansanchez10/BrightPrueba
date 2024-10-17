import React, { createContext, useState, useContext, useEffect } from 'react';
import { addLikes, removeLikes, getUserLikes } from '../../api/forum/likes.request.js';
import { useAuth } from '../auth.context';

const LikesContext = createContext();

export const useLikes = () => useContext(LikesContext);

export const LikesProvider = ({ children }) => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
  
    useEffect(() => {
      if (user && user.data && user.data.id) {
        fetchLike();
      } else {
        setLikes([]);
        setLoading(false);
      }
    }, [user]);
  
    const fetchLike = async () => {
      try {
        setLoading(true);
        const response = await getUserLikes(user.data.id);
        setLikes(response.data);
      } catch (error) {
        console.error('Error fetching Likes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const toggleLikes = async (commentsId) => {
      try {
        setLoading(true);
        const isLikes = likes.some(fav => fav.commentsId === commentsId);
        if (isLikes) {
          await removeLikes(user.data.id, commentsId);
          setLikes(likes.filter(fav => fav.commentsId !== commentsId));
        } else {
          const response = await addLikes(user.data.id, commentsId);
          setLikes([...likes, response.data]);
        }
      } catch (error) {
        console.error('Error toggling Likes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <LikesContext.Provider value={{ likes, loading, toggleLikes }}>
        {children}
      </LikesContext.Provider>
    );
  };