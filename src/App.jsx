import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Context
import { AuthProvider } from "./context/auth.context";
import { UserProvider } from "./context/user/user.context";
import { RoleProvider } from "./context/user/role.context";
import { PermissionProvider } from "./context/user/permissions.context";
import { CategoryProvider } from "./context/courses/category.context";
import { CoursesProvider } from "./context/courses/courses.context";
import { CourseProgressProvider } from "./context/courses/progress.context";
import { ResourceProvider } from "./context/courses/resource.contex";

// Pages
import LoginForm from "./views/LoginForm";
import RegisterForm from "./views/RegisterForm";

// Cambio de contraseña
import ResetPasswordForm from "./views/Password_change/ResetPassword";
import ResetPasswordVerifyForm from "./views/Password_change/codePassword";
import NewPassword from "./views/Password_change/newPassword";
import ChangePasswordUser from "./components/Home/ChangePasswordUser";
import CourseView from "./components/Home/Courses/courseView";

// Vista admin
import Dashboard from "./views/Dashboard";
import Usuarios from "./components/Dashboard/Usuarios/Usuarios";
import ChangePassword from "./components/Dashboard/ProfileAdmin/Changepassword";
import ProfileEditor from "./components/Dashboard/ProfileAdmin/ProfileEditor";
import Courses from "./components/Dashboard/Courses/Courses";
import Roles from "./components/Dashboard/Roles/Roltable";
import Categories from "./components/Dashboard/Categories/Categories";

// Vista usuarios
import HomePage from "./views/HomePage";
import ProfileUser from "./components/Home/ProfileUser";
import MyCourses from "./components/Home/Courses/MyCourses";
import CoursesHome from "./components/Home/Courses/Courses";
import UserDeleteAccount from "./components/Home/UserDeleteAccount";
import ResourceView from "./components/Home/Resources/resourceView";

// Vista error
import NotFoundPage from "./views/Error/404Page";

// Rutas protegidas
import ProtectedRoute from "./protectedRoute";
import PublicRoute from "./publicRoutes";
import ActivationComponent from "./components/Activate";
import DeleteAccountConfirmation from "./components/Dashboard/ProfileAdmin/eliminatedCode";

// Footer
import Footer from "./components/footer";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RoleProvider>
          <PermissionProvider>
            <CategoryProvider>
              <CoursesProvider>
                <ResourceProvider>
                  <CourseProgressProvider>
                    <Routes>
                      {/* Vistas del LOGIN */}
                      <Route element={<PublicRoute redirectToUser="/Home" redirectToAdmin="/admin" />}>
                        <Route path="/" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/reset" element={<ResetPasswordForm />} />
                        <Route path="/code" element={<ResetPasswordVerifyForm />} />
                        <Route path="/newPassword" element={<NewPassword />} />
                      </Route>

                    {/* Vistas para USUARIO */}
                    <Route element={<ProtectedRoute requiredRole="usuario"/>}>
                      <Route path="/Home" element={<HomePage />} />
                      <Route path="/MyCourses" element={<MyCourses />} />
                      <Route path="/CoursesHome" element={<CoursesHome />} />
                      <Route path="/course/:courseId" element={<CourseView />} />
                      <Route path="/resource/:id" element={<ResourceView /> } />
                      <Route path="/Account" element={<ProfileUser />} />
                      <Route path="/ChangePasswordUser" element={<ChangePasswordUser />} />
                      <Route path="/UserDeleteAccount" element={<UserDeleteAccount />} />
                      <Route path="" element={Footer} />
                    </Route>

                    {/* Rutas Protegidas PARA ADMINISTRADOR */}
                    <Route element={<ProtectedRoute requiredRole="Admin"/>}>
                      <Route path="/admin" element={<Dashboard />} />
                      <Route path="/Usuarios" element={<Usuarios />} />
                      <Route path="/Courses" element={<Courses />} />
                      <Route path="/Categories" element={<Categories />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/ProfileEditor" element={<ProfileEditor />} />
                      <Route path="/ChangePassword" element={<ChangePassword />} />
                      <Route path="/eliminatedCode" element={<DeleteAccountConfirmation />} />
                      <Route path="" element={Footer} />
                    </Route>

                      {/* Vistas ADICIONALES */}
                      <Route path="/notFound" element={<NotFoundPage />} />
                      <Route path="/activate" element={<ActivationComponent />} />
                      <Route path="*" element={<Navigate to="/notFound" />} />
                    
                    </Routes>
                  </CourseProgressProvider>
                </ResourceProvider>
              </CoursesProvider>
            </CategoryProvider>
          </PermissionProvider>
        </RoleProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
