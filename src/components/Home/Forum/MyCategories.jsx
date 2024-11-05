import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context.jsx";
import { useUserContext } from "../../../context/user/user.context.jsx";
import Footer from "../../footer.jsx";
import image from "../../../assets/img/hola.png"
import * as BsIcons from 'react-icons/ai';

const ForumCategoriesComponent = () => {
    const { t } = useTranslation("global");
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getAllForumCategories } = useForumCategories();
    const [categories, setCategories] = useState([]);
    const [entityId, setEntityId] = useState(null);
    const { getUserById } = useUserContext();
    const [searchTerm, setSearchTerm] = useState(""); // Definido para buscar por nombre

    useEffect(() => {
        const fetchForumCategories = async () => {
            if (user && user.data && user.data.id) {
                try {
                    const userData = await getUserById(user.data.id);
                    setEntityId(userData.entityId);

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

    const filteredForum = categories.filter((category) => {
        const isEntityMatch = entityId === 1 || category.entityId === entityId; // Filtrar por entityId
        const isSearchMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase()); // Filtrar por nombre
        return isEntityMatch && isSearchMatch; // Retornar true solo si ambos coinciden
    });

    return (
        <div className="flex flex-col min-h-screen bg-primary">
            <NavigationBar />
            <div className="flex-grow mt-16">
                <div className="container mx-auto mt-16 flex-grow px-4 sm:px-6 pb-16">
                    {filteredForum.length > 0 ? ( // Cambiar categories a filteredForum
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-2">
                            {filteredForum.map((category) => ( // Cambiar categories a filteredForum
                                <div
                                    key={category._id}
                                    className="bg-purple-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                                    onClick={() => handleTopicClick(category.id)}
                                >
                                    <div className="flex items-center">
                                        {category.icons && BsIcons[category.icons] ? (
                                        React.createElement(BsIcons[category.icons], { style: { width: "100px", height: "100px", color: "white" } })
                                        ) : (
                                        <span>No icon</span>
                                        )}
                                        <h2 className="text-xl font-semibold mb-2 text-white h-full flex items-center justify-center text-center">
                                            {category.name}
                                        </h2>
                                    </div>
                                    <p className="text-white text-sm sm:text-base">{category.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-3xl font-bold text-gray-700">{t("forumCategory.noCategory")}</h2>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ForumCategoriesComponent;
