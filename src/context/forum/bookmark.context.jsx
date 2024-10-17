import React, { createContext, useState, useContext, useEffect } from 'react';
import { addBookmark, removeBookmark, getUserBookmark } from '../../api/forum/bookmark.request.js';
import { useAuth } from '../auth.context';


const BookmarkContext = createContext();

export const useBookMark = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
    const [bookmark, setBookmark] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
  
    useEffect(() => {
      if (user && user.data && user.data.id) {
        fetchBookmarks();
      } else {
        setBookmark([]);
        setLoading(false);
      }
    }, [user]);
  
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await getUserBookmark(user.data.id);
        setBookmark(response.data);
      } catch (error) {
        console.error('Error fetching Bookmark:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const toggleBookmark = async (commentId) => {
      try {
        setLoading(true);
        const isBookmark = bookmark.some(fav => fav.commentId === commentId);
        if (isBookmark) {
          await removeBookmark(user.data.id, commentId);
          setBookmark(bookmark.filter(fav => fav.commentId !== commentId));
        } else {
          const response = await addBookmark(user.data.id, commentId);
          setBookmark([...bookmark, response.data]);
        }
      } catch (error) {
        console.error('Error toggling Bookmark:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <BookmarkContext.Provider value={{ bookmark, loading, toggleBookmark }}>
        {children}
      </BookmarkContext.Provider>
    );
  };
