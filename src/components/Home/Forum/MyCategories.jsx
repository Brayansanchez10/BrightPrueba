import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "./../NavigationBar";
import { useAuth } from "../../../context/auth.context";
import { useTranslation } from "react-i18next";
import { useForumCategories } from "../../../context/forum/forumCategories.context.jsx";
import Footer from "../../footer.jsx";
import { FaSearch } from "react-icons/fa";
import Logo from "../../../assets/img/hola.png";
import * as BsIcons from 'react-icons/ai';

export default function ForumCategoriesComponent() {
  const { t } = useTranslation("global");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllForumCategories } = useForumCategories();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const fetchForumCategories = useCallback(async () => {
    if (user && user.data && user.data.id) {
      try {
        const fetchedCategories = await getAllForumCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error al obtener todas las categorias del Foro", error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchForumCategories();
  }, [fetchForumCategories]);

  const handleTopicClick = (forumCategoryId) => {
    console.log("Categoria Id: ", forumCategoryId)
    navigate(`/categories/${forumCategoryId}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationBar />
      <div className="flex-grow mt-16 px-4 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <>
            <motion.div
              className="flex flex-col items-center sm:flex-row sm:justify-between mt-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold text-center sm:text-left font-bungee break-words"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="text-primary mr-2 block sm:inline">{t("forumCategory.title")}</span>
                  <span className="text-purple-700 dark:text-secondary block sm:inline">
                    {t("forumCategory.title2")}
                  </span>
                </motion.h1>
              </div>
              <div className="w-full sm:w-auto">
                <motion.div
                  className="flex px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-md"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FaSearch size={"18px"} className="mt-1 mr-2" />
                  <input
                    type="search"
                    className="bg-white outline-none w-full md:w-[280px] lg:w-[360px] xl:w-[420px]"
                    placeholder={t("coursesComponent.search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatePresence>
                {paginatedCategories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    className="bg-[#783CDA] dark:bg-secondary rounded-[14px] p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
                    onClick={() => handleTopicClick(category.id)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center h-full">
                      {category.icons && BsIcons[category.icons] ? (
                        React.createElement(BsIcons[category.icons], { style: { width: "50px", height: "50px", color: "white" } })
                        ) : (
                        <span>No icon</span>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <h2 className="text-lg font-bungee text-white mb-1 break-words">
                          {category.name}
                        </h2>
                        <p className="text-sm text-white opacity-80 line-clamp-3">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="flex justify-center items-center mt-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
              <img
                className="h-20 mb-4 mx-auto sm:h-24 md:h-28 lg:h-32"
                src={Logo}
                alt="Logo"
              />
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-primary sm:text-2xl md:text-3xl">
                {t("forumCategory.noCategory")}
              </h2>
              <p className="text-center text-gray-600 dark:text-primary text-sm sm:text-base md:text-lg">
                {t("forumCategory.check_back_later")}
              </p>
            </div>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            className="flex justify-center mb-8 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
          </motion.div>
        )}
      </div>
      <motion.div
        className="mt-16 border-t-4 border-gray-300 bg-white shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="mt-2">
        <Footer />
        </div>
      </motion.div>
    </motion.div>
  );
}