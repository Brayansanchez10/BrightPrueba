import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./../NavigationBar";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context.jsx";
import Footer from "../../footer.jsx";

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
            <div className="flex-grow mt-16">
                <div className="container mx-auto mt-16 flex-grow">
                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <div key={category._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6" onClick={() => handleTopicClick(category.id)}>
                                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h2>
                                    <p className="text-gray-600">{category.description}</p>
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
