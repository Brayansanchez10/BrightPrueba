import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAnswersByComment as getAnswersByCommentApi, 
    createAnswer as createAnswerApi, 
    updateAnswer as updateAnswerApi, 
    deleteAnswer as deleteAnswerApi } 
from '../../api/courses/answerQuestion.request.js';

const AnswersQuestionContext = createContext();

export const useAnswers = () => useContext(AnswersQuestionContext);

export const AnswersQuestionProvider = ({ children }) => {
    const [answers, setAnswers] = useState([]);

     // Función obtener respuestas por comentario
     const getAnswersByComment = async (commentsId) => {
        try {
            const res = await getAnswersByCommentApi(commentsId);
            setAnswers(res.data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener las Respuestas:", error);
            return null;
        }
    };

    const createAnswer = async ({ content, userId, commentsId}) => {
        try {
            const newAnswerData = {
                content,
                userId: Number(userId),
                commentsId: Number(commentsId)
            };
            console.log(newAnswerData);

            const res = await createAnswerApi(newAnswerData);
            setAnswers([...answers, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Función para actualizar una respuesta
    const updateAnswer = async (id, answerData) => {
        try {
            const res = await updateAnswerApi(id, answerData);
            setAnswers(answers.map((answer) => (answer._id === id ? res.data : answer)));
            console.log(res.data);
            return res.data;
          } catch (error) {
            console.error(error);
            return null;
          }
    };

    // Función para eliminar una respuesta
    const deleteAnswer = async (id) => {
        try {
            await deleteAnswerApi(id);
            setAnswers(answers.filter(answer => answer.id !== id));
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <AnswersQuestionContext.Provider value={{ answers, createAnswer, updateAnswer, deleteAnswer, getAnswersByComment }}>
            {children}
        </AnswersQuestionContext.Provider>
    );
};