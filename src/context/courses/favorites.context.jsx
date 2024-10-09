import React, { createContext, useState, useContext, useEffect } from 'react';
import { addFavorite, removeFavorite, getUserFavorites } from '../../api/courses/favorites.request';
import { useAuth } from '../auth.context';

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.data && user.data.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getUserFavorites(user.data.id);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (courseId) => {
    try {
      setLoading(true);
      const isFavorite = favorites.some(fav => fav.courseId === courseId);
      if (isFavorite) {
        await removeFavorite(user.data.id, courseId);
        setFavorites(favorites.filter(fav => fav.courseId !== courseId));
      } else {
        const response = await addFavorite(user.data.id, courseId);
        setFavorites([...favorites, response.data]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, loading, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};