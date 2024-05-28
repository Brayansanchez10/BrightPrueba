import { Routes, Route } from "react-router-dom";
import "./index.css";

// Context
import { AuthProvider } from "./context/auth.context";
import { UserProvider } from "./context/user/user.context";
import { RoleProvider } from "./context/user/role.context";
import {PermissionProvider} from "./context/user/permissions.context"
import {CategoryProvider} from "./context/courses/category.context"



// Pages
import LoginForm from "./views/LoginForm";
import RegisterForm from "./views/RegisterForm";


//Cambio de contraseña 
import ResetPasswordForm from "./views/Password_change/ResetPassword";
import ResetPasswordVerifyForm from './views/Password_change/codePassword'
import NewPassword from "./views/Password_change/newPassword";
import ChangePasswordUser from './components/Home/ChangePasswordUser';


//Vista admin
import Dashboard from "./views/Dashboard";
import Usuarios from "./components/Dashboard/Usuarios/Usuarios";
import ChangePassword from "./components/Dashboard/ProfileAdmin/Changepassword";
import ProfileEditor from "./components/Dashboard/ProfileAdmin/ProfileEditor";
import Courses from "./components/Dashboard/Courses/Courses";
import Roles from "./components/Dashboard/Roles/Roltable";


//Vista usuarios                
import HomePage from "./views/HomePage";
import ProfileUser from "./components/Home/ProfileUser"; 
import MyCourses from './components/Home/MyCourses';


//Vista error
import NotFoundPage from './views/Error/404Page'

//Rutas protegidas 
import ProtectedRoute from './protectedRoute'


import ActivationComponent from './components/Activate'

//pages





import DeleteAccountConfirmation from "./components/Dashboard/ProfileAdmin/eliminatedCode";
// import ProfileUser from "./components/Dashboard/Profile-User";






function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RoleProvider>
          <PermissionProvider>
            <CategoryProvider>

        
        <Routes>

        
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/reset" element={<ResetPasswordForm />} />
          <Route path="/code" element={<ResetPasswordVerifyForm />} />
          <Route path="/newPassword" element={<NewPassword/>} />
          <Route path="/eliminatedCode" element={<DeleteAccountConfirmation />} />
          <Route path="/notFound" element={<NotFoundPage />} />
          <Route path="/activate" element={<ActivationComponent />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="ChangePasswordUser" element={<ChangePasswordUser/>} />
          <Route path="/MyCourses" element={<MyCourses/>} />
          <Route path="/Courses" element={<Courses />} />
          
          <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/ProfileEditor" element={<ProfileEditor />} />
          <Route path="/Account" element={<ProfileUser/>} />
          <Route path="/roles" element={<Roles/>} />

          </Route>
          </Routes>
          </CategoryProvider>

</PermissionProvider>
        
        </RoleProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;