import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context.jsx";
import Footer from "../../footer.jsx";
import image from "../../../assets/img/hola.png"

const ForumCategoriesComponent = () => {
    const { t } = useTranslation("global");
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getAllForumCategories } = useForumCategories();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchForumCategories = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const fetchedCategories = await getAllForumCategories();
                    setCategories(fetchedCategories);
                } catch (error) {
                    console.error("Error al obtener todas las categorias del Foro", error);
                }
            }
        };
        fetchForumCategories();
    }, [user]);

    const handleTopicClick = (forumCategoryId) => {
        console.log("Categoria Id: ", forumCategoryId)
        navigate(`/categories/${forumCategoryId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <NavigationBar />
                <div className="m-auto text-center">
                    <img src={image} className="w-1/2 m-auto"/>
                    <h1 className="text-3xl md:text-5xl font-bold">Proximamente</h1>
                </div> 
            <Footer />
        </div>
    );
};

export default ForumCategoriesComponent;
