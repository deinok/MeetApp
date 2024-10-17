import React from "react";
import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { MainPage } from "./pages/main/MainPage";
import { RegisterPage } from "./pages/login/ResgisterPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import AppLayout from "./layout/MainLayout";
import './i18n'; 
import NoPermissionPage from "./pages/noPermissionPage/NoPermissionPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <MainPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<NoPermissionPage />} />
      <Route
        path="/profile"
        element={
          <RequireAuth loginPath="/login">
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
