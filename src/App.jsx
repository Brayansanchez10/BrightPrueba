import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./components/themes/theme.css";

// Context
import { AuthProvider } from "./context/auth.context";
import { UserProvider } from "./context/user/user.context";
import { RoleProvider } from "./context/user/role.context";
import { PermissionProvider } from "./context/user/permissions.context";
import { CategoryProvider } from "./context/courses/category.context";
import { CoursesProvider } from "./context/courses/courses.context";
import { CourseProgressProvider } from "./context/courses/progress.context";
import { ResourceProvider } from "./context/courses/resource.contex";
import { SubCategoryProvider } from "./context/courses/subCategory.context.jsx";
import { CommentProvider } from "./context/courses/comment.context";
import { RatingsProvider } from './context/courses/ratings.context.jsx';
import { FavoritesProvider } from './context/courses/favorites.context.jsx';
import { NotesProvider } from './context/courses/notes.context.jsx';
import { GeneralCommentProvider } from './context/courses/generalComment.context.jsx';
import { ForumCategoriesProvider } from "./context/forum/forumCategories.context.jsx";
import { TopicProvider } from "./context/forum/topic.context.jsx";
import { ForumFavoritesProvider } from "./context/forum/forumFavorite.context.jsx";
import { LikesProvider } from "./context/forum/likes.context.jsx";
import { ForumCommentProvider } from "./context/forum/forumComments.context.jsx";
import { AnswersProvider } from "./context/forum/answers.context.jsx";
import { BookmarkProvider } from "./context/forum/bookmark.context.jsx";
import { ThemeProvider } from "./components/themes/theme.context.jsx";

// Pages
import LoginForm from "./views/LoginForm";
import RegisterForm from "./views/RegisterForm";
import ResetPasswordForm from "./views/Password_change/ResetPassword";
import ResetPasswordVerifyForm from "./views/Password_change/codePassword";
import NewPassword from "./views/Password_change/newPassword";
import ChangePasswordUser from "./components/Home/ChangePasswordUser";
import CourseView from "./components/Home/Courses/courseView";
import Dashboard from "./views/Dashboard";
import Usuarios from "./components/Dashboard/Usuarios/Usuarios";
import ChangePassword from "./components/Dashboard/ProfileAdmin/Changepassword";
import ProfileEditor from "./components/Dashboard/ProfileAdmin/ProfileEditor";
import ViewProfile from "./components/Home/viewProfile";
import Courses from "./components/Dashboard/Courses/Courses";
import Roles from "./components/Dashboard/Roles/Roltable";
import Categories from "./components/Dashboard/Categories/Categories";
import ForumCategories from "./components/Dashboard/forum/categoriesTable.jsx";
import HomePage from "./views/HomePage";
import ProfileUser from "./components/Home/ProfileUser";
import PrevUser from "./components/Home/prevUsers";
import MyCourses from "./components/Home/Courses/MyCourses";
import CoursesHome from "./components/Home/Courses/Courses";
import UserDeleteAccount from "./components/Home/UserDeleteAccount";
import ResourceView from "./components/Home/Resources/resourceView";
import AllCourses from "./components/Home/Courses/AllCourses";
import CourseCategory from './components/Home/Courses/CourseCategory';
import ForumCategoriesComponent from "./components/Home/Forum/MyCategories.jsx";
import TopicComponent from "./components/Home/Forum/MyTopic.jsx";
import TopicViewComponente from "./components/Home/Forum/TopicView.jsx";
import NotFoundPage from "./views/Error/404Page";
import ProtectedRoute from "./protectedRoute";
import PublicRoute from "./publicRoutes";
import ActivationComponent from "./components/Activate";
import DeleteAccountConfirmation from "./components/Dashboard/ProfileAdmin/eliminatedCode";

function App() {
  const forumActive = localStorage.getItem("forumActive") === "true";

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <PermissionProvider>
              <CategoryProvider>
                <CoursesProvider>
                  <ResourceProvider>
                    <CourseProgressProvider>
                      <SubCategoryProvider>
                       <CommentProvider>
                        <RatingsProvider>
                          <FavoritesProvider>
                            <NotesProvider>
                              <GeneralCommentProvider>
                                <ForumCategoriesProvider>
                                  <TopicProvider>
                                    <ForumFavoritesProvider>
                                      <LikesProvider>
                                        <BookmarkProvider>
                                          <ForumCommentProvider>
                                            <AnswersProvider>
                                              <Routes>
                                                <Route element={<PublicRoute redirectToUser="/Home" redirectToAdmin="/admin" />}>
                                                  <Route path="/" element={<LoginForm />} />
                                                  <Route path="/register" element={<RegisterForm />} />
                                                  <Route path="/reset" element={<ResetPasswordForm />} />
                                                  <Route path="/code" element={<ResetPasswordVerifyForm />} />
                                                  <Route path="/newPassword" element={<NewPassword />} />
                                                </Route>

                                                <Route element={<ProtectedRoute allowedRoles="usuario"/>}>
                                                  <Route path="/Home" element={<HomePage />} />
                                                  <Route path="/MyCourses" element={<MyCourses />} />
                                                  <Route path="/CoursesHome" element={<CoursesHome />} />
                                                  <Route path="/course/:courseId" element={<CourseView />} />
                                                  <Route path="/course/:courseId/resource/:id" element={<ResourceView />} />
                                                  <Route path="/Account" element={<ProfileUser />} />
                                                  <Route path="/ChangePasswordUser" element={<ChangePasswordUser />} />
                                                  <Route path="/UserDeleteAccount" element={<UserDeleteAccount />} />
                                                  <Route path="/AllCourses" element={<AllCourses />}/>
                                                  <Route path="/CourseCategory/:category" element={<CourseCategory />} />
                                                      {forumActive && (
                                                          <>
                                                          <Route path="/Forum" element={<ForumCategoriesComponent />} />
                                                          <Route path="/categories/:forumCategoryId" element={<TopicComponent />} />
                                                          <Route path="/topic/:topicId" element={<TopicViewComponente />} />
                                                          </>
                                                      )}
                                                  <Route path="/profile/:id" element={<ViewProfile />} />
                                                  <Route path="/prevUser/:id" element={<PrevUser />} />
                                                </Route>

                                                <Route element={<ProtectedRoute allowedRoles={["Admin", 'instructor']} />}>
                                                  <Route path="/admin" element={<Dashboard />} />
                                                  <Route path="/Usuarios" element={<Usuarios />} />
                                                  <Route path="/Courses" element={<Courses />} />
                                                  <Route path="/Categories" element={<Categories />} />
                                                  <Route path="/ForumCategories" element={<ForumCategories />} />
                                                  <Route path="/roles" element={<Roles />} />
                                                  <Route path="/ProfileEditor" element={<ProfileEditor />} />
                                                  <Route path="/ChangePassword" element={<ChangePassword />} />
                                                  <Route path="/eliminatedCode" element={<DeleteAccountConfirmation />} />
                                                </Route>

                                                <Route path="/notFound" element={<NotFoundPage />} />
                                                <Route path="/activate/:id" element={<ActivationComponent />} />
                                                <Route path="*" element={<Navigate to="/notFound" />} />
                                              </Routes>
                                            </AnswersProvider>
                                          </ForumCommentProvider>
                                        </BookmarkProvider>
                                      </LikesProvider>
                                    </ForumFavoritesProvider>
                                  </TopicProvider>
                                </ForumCategoriesProvider>                 
                               </GeneralCommentProvider>
                              </NotesProvider>
                            </FavoritesProvider>
                          </RatingsProvider>
                        </CommentProvider>
                      </SubCategoryProvider>
                    </CourseProgressProvider>
                  </ResourceProvider>
                </CoursesProvider>
              </CategoryProvider>
            </PermissionProvider>
          </RoleProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;