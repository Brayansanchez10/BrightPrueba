import React, { createContext, useState, useContext, useCallback } from 'react';
import { createRating, getRatingsByCourse, getRatingsByResource, updateRating, deleteRating } from "../../api/courses/ratings.request.js";

const RatingsContext = createContext();

export const useRatingsContext = () => useContext(RatingsContext);

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatingsByCourse = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await getRatingsByCourse(courseId);
      setRatings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRatingsByResource = useCallback(async (resourceId) => {
    setLoading(true);
    try {
      const response = await getRatingsByResource(resourceId);
      setRatings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRating = useCallback(async (courseId, resourceId, ratingData) => {
    setLoading(true);
    try {
      const response = await createRating(courseId, resourceId, ratingData);
      setRatings(prevRatings => [...prevRatings, response.data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const editRating = useCallback(async (id, ratingData) => {
    setLoading(true);
    try {
      const response = await updateRating(id, ratingData);
      setRatings(prevRatings => 
        prevRatings.map(rating => rating.id === id ? response.data : rating)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRating = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteRating(id);
      setRatings(prevRatings => prevRatings.filter(rating => rating.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RatingsContext.Provider value={{
      ratings,
      loading,
      error,
      fetchRatingsByCourse,
      fetchRatingsByResource,
      addRating,
      editRating,
      removeRating
    }}>
      {children}
    </RatingsContext.Provider>
  );
};