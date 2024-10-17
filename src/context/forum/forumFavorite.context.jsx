import React, { createContext, useState, useContext, useEffect } from 'react';
import { addForumFavorite, removeForumTopic, getUserForumFavorites } from '../../api/forum/forumFavoriteTopic.request.js';
import { useAuth } from '../auth.context';

const ForumFavoriteContext = createContext();

export const useForumFavorite = () => useContext(ForumFavoriteContext);

export const ForumFavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.data && user.data.id){
            fetchForumFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }
    }, [user]);

    const fetchForumFavorites = async () => {
        try {
          setLoading(true);
          const response = await getUserForumFavorites(user.data.id);
          setFavorites(response.data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        } finally {
          setLoading(false);
        }
    };

    const toggleForumFavorites = async (topicId) => {
        try {
            setLoading(true);
            const isFavorite = favorites.some(fav => fav.topicId === topicId);
            if(isFavorite) {
                await removeForumTopic(user.data.id, topicId);
                setFavorites(favorites.filter(fav => fav.topicId !== topicId));
            } else {
                const response = await addForumFavorite(user.data.id, topicId)
                setFavorites([...favorites, response.data]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ForumFavoriteContext.Provider value={{ favorites, loading, toggleForumFavorites}}>
            {children}
        </ForumFavoriteContext.Provider>
    );
};